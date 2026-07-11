import fs from 'fs';
import path from 'path';

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'application/zip': '.zip',
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function ensureUploadDir(): void {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
