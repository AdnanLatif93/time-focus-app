const express = require('express');
const {
  getAllBlocks,
  getBlockById,
  getCurrentBlock,
  getNextBlock,
} = require('../controllers/block.controller');

const router = express.Router();

router.get('/',               getAllBlocks);     // GET /api/blocks
router.get('/current-block',  getCurrentBlock);  // GET /api/blocks/current-block
router.get('/next-block',     getNextBlock);     // GET /api/blocks/next-block
router.get('/:id',            getBlockById);     // GET /api/blocks/:id  ← :id LAST (avoid conflict)

module.exports = router;
