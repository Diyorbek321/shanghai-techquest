import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { MAX_UPLOAD_BYTES, UPLOAD_DIR } from '../uploads/storage';

export const uploadsRouter = Router();

uploadsRouter.use(requireAuth);

uploadsRouter.post('/', (req, res) => {
  upload.single('file')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `Fayl hajmi ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))}MB dan oshmasligi kerak.` });
    }
    if (err) {
      return res.status(400).json({
        error: "Fayl turi qo'llab-quvvatlanmaydi. Ruxsat etilgan: docx, xlsx, pptx, pdf, png, jpg, zip.",
      });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Fayl tanlanmagan.' });
    }
    res.status(201).json({
      url: `/api/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
    });
  });
});

uploadsRouter.get('/:filename', (req, res) => {
  const safeName = path.basename(req.params.filename);
  const filePath = path.join(UPLOAD_DIR, safeName);

  if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Fayl topilmadi.' });
  }
  res.sendFile(filePath);
});
