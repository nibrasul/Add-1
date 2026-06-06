import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { filename, contentType, base64Data } = req.body;

  if (!base64Data) {
    return res.status(400).json({ error: 'base64Data is required.' });
  }

  try {
    // Decode base64 data
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, 'base64');
    const cleanFilename = filename || `avatar-${Date.now()}.jpg`;
    const cleanContentType = contentType || 'image/jpeg';

    // If Vercel Blob Read/Write token is present, upload to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(cleanFilename, buffer, {
        contentType: cleanContentType,
        access: 'public',
      });
      return res.status(200).json({ url: blob.url });
    } else {
      // Fallback for local development offline mode: write to public/uploads
      const uploadsDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileExt = cleanContentType.split('/')[1] || 'jpg';
      const localFileName = `avatar-${Date.now()}.${fileExt}`;
      const localFilePath = path.join(uploadsDir, localFileName);

      fs.writeFileSync(localFilePath, buffer);

      // Return local URL statically served by Vite / Express
      return res.status(200).json({ url: `/uploads/${localFileName}` });
    }
  } catch (error) {
    console.error('File upload handler error:', error);
    return res.status(500).json({ error: 'Failed to upload image.' });
  }
}
