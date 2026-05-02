function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const filePath = `/uploads/${req.file.filename}`;

  return res.status(201).json({
    message: 'File uploaded successfully',
    file_url: `${baseUrl}${filePath}`,
    file_path: filePath,
    mime_type: req.file.mimetype,
    original_name: req.file.originalname,
    size: req.file.size
  });
}

module.exports = {
  uploadFile
};
