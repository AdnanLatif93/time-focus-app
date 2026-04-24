const uploadService = require('../services/upload.service');
const apiResponse = require('../utils/apiResponse');

exports.uploadFile = async (req, res, next) => {
  try {
    const result = await uploadService.parseFile(req.file /*, req.user?.id */);
    return apiResponse.success(res, result, 'File uploaded successfully');
  } catch (error) {
    next(error);
  }
};

exports.downloadReport = async (req, res, next) => {
  try {
    const { filePath, fileName } = await uploadService.generateReport(req.user?.id);
    res.download(filePath, fileName);
  } catch (error) {
    next(error);
  }
};
