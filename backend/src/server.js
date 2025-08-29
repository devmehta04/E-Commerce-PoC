const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ensure uploads directory exists - fix the path resolution
const uploadsDir = path.join(__dirname, '..', 'uploads');
console.log('Server file location:', __dirname);
console.log('Uploads directory path:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// List files in uploads directory for debugging
try {
  const files = fs.readdirSync(uploadsDir);
  console.log('Files in uploads directory:', files);
} catch (err) {
  console.log('Error reading uploads directory:', err.message);
}

// Static file serving for uploads
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/public', require('./routes/public'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/upload', require('./routes/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`Uploads directory exists: ${fs.existsSync(uploadsDir)}`);
});
