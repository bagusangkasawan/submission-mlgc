const express = require('express');
const multer = require('multer');
const { predictHandler, getHistoriesHandler } = require('./handlers');

const router = express.Router();

// Configure multer for file upload with 1MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000, // 1MB = 1000000 bytes
  },
});

// POST /predict - Predict cancer from image
router.post('/predict', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          status: 'fail',
          message: 'Payload content length greater than maximum allowed: 1000000',
        });
      }
      return res.status(400).json({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
    }
    next();
  });
}, predictHandler);

// GET /predict/histories - Get prediction histories
router.get('/predict/histories', getHistoriesHandler);

module.exports = router;
