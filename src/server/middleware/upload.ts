import crypto from 'crypto';
import multer from 'multer';
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES, UPLOAD_DIR, ensureUploadDir } from '../uploads/storage';

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const extension = ALLOWED_MIME_TYPES[file.mimetype] ?? '';
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      cb(new Error('UNSUPPORTED_FILE_TYPE'));
      return;
    }
    cb(null, true);
  },
});
