const express = require('express');
const authRoutes   = require('./auth.routes');
const taskRoutes   = require('./task.routes');
const uploadRoutes = require('./upload.routes');
const blockRoutes  = require('./block.routes');

const router = express.Router();

router.use('/auth',   authRoutes);
router.use('/tasks',  taskRoutes);
router.use('/upload', uploadRoutes);
router.use('/blocks', blockRoutes);

module.exports = router;
