const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
// const Task = require('../models/Task');
// const Upload = require('../models/Upload');

const uploadDir = path.resolve(__dirname, '../../uploads');

const getCellValue = (row, key) => {
  if (row[key] !== undefined) return row[key];
  const capitalized = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
  return row[capitalized];
};

exports.parseFile = async (file /*, userId */) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) {
    throw new Error('Uploaded file does not contain a valid worksheet');
  }

  const rows = XLSX.utils.sheet_to_json(sheet);
  if (!rows.length) {
    throw new Error('The Excel file contains no rows to import');
  }

  const tasks = rows.map((row) => {
    const title = getCellValue(row, 'title');
    const description = getCellValue(row, 'description');
    const duration = getCellValue(row, 'duration');
    const completed = getCellValue(row, 'completed');

    if (!title) {
      throw new Error('Every row must include a task title');
    }

    return {
      title,
      description: description || '',
      duration: duration ? Number(duration) : 0,
      completed: completed === true || completed === 'true' || completed === 1 || completed === '1',
      // user: userId,
    };
  });

  // const uploadRecord = await Upload.create({
  //   user: userId,
  //   filename: file.originalname,
  //   originalName: file.originalname,
  //   mimeType: file.mimetype,
  //   size: file.size,
  // });

  // await Task.insertMany(tasks);
  return { imported: tasks.length, tasks /* uploadId: uploadRecord._id */ };
};

exports.generateReport = async (userId) => {
  // Report generation is disabled until the database layer is enabled.
  throw new Error('Report generation is not available in the current local setup');
};
