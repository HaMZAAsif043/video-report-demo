# Video Reports Demo

Reporters upload video → stored on Cloudflare R2 → viewable on `/reports`.

## Setup

1. `npm install`
2. Create R2 bucket in Cloudflare dashboard, note Account ID + Access Keys
3. Copy `.env.local.example` → `.env.local`, fill in R2 values
4. Set CORS on your R2 bucket (Cloudflare dashboard → bucket → Settings → CORS):
   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
5. `npm run dev` → open http://localhost:3000

## Flow

- `/` — upload form (reporter name, title, video file)
- `/reports` — lists all uploads with playback

Upload is direct browser → R2 (presigned URL), so video never passes through your server.
