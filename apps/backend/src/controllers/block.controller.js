const blockService = require('../services/block.service');
const apiResponse  = require('../utils/apiResponse');

// GET /api/blocks
exports.getAllBlocks = async (req, res, next) => {
  try {
    const blocks = await blockService.getAllBlocks();
    return apiResponse.success(res, blocks, 'All blocks fetched successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/block/:id
exports.getBlockById = async (req, res, next) => {
  try {
    const block = await blockService.getBlockById(req.params.id);
    return apiResponse.success(res, block, 'Block fetched successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/current-block
exports.getCurrentBlock = async (req, res, next) => {
  try {
    const block = await blockService.getCurrentBlock();
    if (!block) {
      return apiResponse.success(res, null, 'No block is currently active');
    }
    return apiResponse.success(res, block, 'Current block fetched successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/next-block
exports.getNextBlock = async (req, res, next) => {
  try {
    const block = await blockService.getNextBlock();
    if (!block) {
      return apiResponse.success(res, null, 'No upcoming block found');
    }
    return apiResponse.success(res, block, 'Next block fetched successfully');
  } catch (error) {
    next(error);
  }
};
