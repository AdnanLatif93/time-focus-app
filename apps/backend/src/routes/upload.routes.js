const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { uploadFile, downloadReport } = require('../controllers/upload.controller');
// const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// router.use(authMiddleware);
router.post('/', upload.single('file'), uploadFile);
router.get('/report', downloadReport);

module.exports = router;
