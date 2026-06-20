import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20mb
});

export const uploadImage = async (req, res) => {
  try {
    console.log('[Upload] received request, content-type=', req.headers['content-type']);
  } catch {}

  const handleFile = async () => {
    console.log('[Upload] req.file present=', !!req.file);
    if (req.file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Only JPG, JPEG, PNG, WebP, PDF files allowed' });
      }
      console.log('[Upload] file.mimetype=', req.file.mimetype, 'size=', req.file.size);

      // Upload buffer to Cloudinary via upload_stream
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'thefamoushalwai' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        
        return res.json({ url: result.secure_url });
      } catch (err) {
        console.error('[Upload] Cloudinary upload_stream error:', err);
        return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
      }
    }

    if (req.body && req.body.image && typeof req.body.image === 'string') {
      const imageDataString = req.body.image;
      if (!imageDataString.startsWith('data:')) {
        return res.status(400).json({ error: 'Invalid image data string provided.' });
      }
      
      // Upload the image data string directly to Cloudinary
      try {
        const result = await cloudinary.uploader.upload(imageDataString, {
          folder: 'thefamoushalwai'
        });
        return res.json({ url: result.secure_url });
      } catch (err) {
        console.error('[Upload] Cloudinary data string upload error:', err);
        return res.status(500).json({ error: 'Failed to upload image data to Cloudinary.' });
      }
    }

    return res.status(400).json({ error: 'No file uploaded' });
  };

  // If request is multipart/form-data, run multer to parse file
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (contentType.startsWith('multipart/form-data')) {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.error('[Upload] multer error:', err);
        return res.status(400).json({ error: err.message || 'Upload error' });
      }
      return await handleFile();
    });
  } else {
    // Not multipart — rely on express.json() having populated req.body
    return await handleFile();
  }
};