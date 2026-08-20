import { NextResponse } from "next/server";
import { ListObjectsV2Command, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, BUCKET } from "@/lib/r2";

export async function GET() {
  try {
    if (!BUCKET) {
      return NextResponse.json({ error: "R2_BUCKET_NAME not configured", items: [] }, { status: 500 });
    }

    const list = await r2.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "reports/" })
    );

    if (!list.Contents || list.Contents.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const items = await Promise.all(
      list.Contents
        .sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))
        .map(async (obj) => {
          try {
            const head = await r2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: obj.Key! }));
            const viewUrl = await getSignedUrl(
              r2,
              new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key! }),
              { expiresIn: 3600 }
            );

            let tags: string[] = [];
            try {
              tags = JSON.parse(head.Metadata?.tags || "[]");
            } catch {}

            return {
              key: obj.Key,
              size: obj.Size,
              uploadedAt: obj.LastModified,
              reporter: head.Metadata?.reporter || "unknown",
              title: head.Metadata?.title || "",
              category: head.Metadata?.category || "",
              location: head.Metadata?.location || "",
              tags,
              viewUrl,
            };
          } catch {
            return {
              key: obj.Key,
              size: obj.Size,
              uploadedAt: obj.LastModified,
              reporter: "unknown",
              title: "",
              category: "",
              location: "",
              tags: [],
              viewUrl: "",
            };
          }
        })
    );

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Reports API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch reports", items: [] },
      { status: 500 }
    );
  }
}
