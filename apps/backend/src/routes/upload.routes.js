const express = require('express');
const path    = require('path');
const upload  = require('../middlewares/multer.middleware');
const { uploadFile } = require('../controllers/upload.controller');

const router = express.Router();

// POST /api/upload — multipart .xlsx upload
router.post('/', upload.single('file'), uploadFile);

// GET /api/upload/sample-template — download sample .xlsx
router.get('/sample-template', (req, res) => {
  const filePath = path.resolve(__dirname, '../assets/sample-template.xlsx');
  res.download(filePath, 'focusday-sample-template.xlsx', (err) => {
    if (err) {
      res.status(404).json({ success: false, message: 'Template file not found' });
    }
  });
});

module.exports = router;
