const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');
const { uploadFile } = require('../controllers/upload.controller');

const router = express.Router();
const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/tiff'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeExtension = extension || (file.mimetype === 'application/pdf' ? '.pdf' : '.bin');
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExtension}`;
    cb(null, uniqueName);
  }
});

const uploader = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error('Only image and PDF files are allowed'));
  }
});

router.post('/uploads', (req, res, next) => {
  uploader.single('file')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'File is too large. Maximum size is 10MB.' });
      return;
    }

    res.status(400).json({ message: error.message || 'Failed to upload file' });
  });
}, uploadFile);

module.exports = router;
