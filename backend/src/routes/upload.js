const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Fix: Use the same path resolution as the server (backend/uploads, not backend/src/uploads)
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
console.log('Upload route - uploads directory:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Upload route - created uploads directory');
}

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    console.log('Generated filename:', name);
    cb(null, name);
  }
});

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log(`File uploaded successfully:`);
    console.log(`  - Original: ${req.file.originalname}`);
    console.log(`  - Saved as: ${req.file.filename}`);
    console.log(`  - Path: ${req.file.path}`);
    console.log(`  - URL: ${fileUrl}`);
    
    // Verify file was actually saved
    if (fs.existsSync(req.file.path)) {
      console.log(`  - File exists on disk: YES`);
    } else {
      console.log(`  - File exists on disk: NO`);
    }
    
    res.status(201).json({ 
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    next(err);
  }
});

// Error handling for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max size is 5MB.' });
    }
  }
  console.error('Upload error:', err);
  res.status(500).json({ error: err.message || 'Upload failed' });
});

module.exports = router;
