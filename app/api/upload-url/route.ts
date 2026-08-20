import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    if (!BUCKET) {
      return NextResponse.json({ error: "R2_BUCKET_NAME not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const reporterName = (formData.get("reporterName") as string) || "unknown";
    const title = (formData.get("title") as string) || "";
    const category = (formData.get("category") as string) || "";
    const location = (formData.get("location") as string) || "";
    const tags = (formData.get("tags") as string) || "[]";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const key = `reports/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: file.type,
        Body: buffer,
        Metadata: {
          reporter: reporterName,
          title,
          category,
          location,
          tags,
        },
      })
    );

    return NextResponse.json({ key, message: "Upload successful" });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
