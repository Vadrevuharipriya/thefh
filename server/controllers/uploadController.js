import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20mb
});

export const uploadImage = async (req, res) => {
  try {
    console.log('[Upload] received request, content-type=', req.headers['content-type']);
  } catch {}

  const handleFile = () => {
    console.log('[Upload] req.file present=', !!req.file);
    console.log('[Upload] req.body keys=', Object.keys(req.body || {}).join(',') || '(none)');
    if (req.file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Only JPG, JPEG, PNG, WebP, PDF files allowed' });
      }
      console.log('[Upload] file.mimetype=', req.file.mimetype, 'size=', req.file.size);
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      return res.json({ url: base64 });
    }

    if (req.body && req.body.image && typeof req.body.image === 'string') {
      const image = req.body.image;
      console.log('[Upload] received base64 length=', image.length);
      if (!image.startsWith('data:')) {
        return res.status(400).json({ error: 'Invalid image data' });
      }
      return res.json({ url: image });
    }

    return res.status(400).json({ error: 'No file uploaded' });
  };

  // If request is multipart/form-data, run multer to parse file
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType.startsWith('multipart/form-data')) {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('[Upload] multer error:', err);
        return res.status(400).json({ error: err.message || 'Upload error' });
      }
      return handleFile();
    });
  } else {
    // Not multipart — rely on express.json() having populated req.body
    return handleFile();
  }
};