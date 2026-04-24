const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const Task = require('../models/Task');

const uploadDir = path.resolve(__dirname, '../../uploads');

exports.parseFile = async (file, userId) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const tasks = rows.map((row) => ({
    title: row.title || row.Title,
    description: row.description || row.Description,
    duration: row.duration || row.Duration,
    completed: row.completed || row.Completed || false,
    user: userId,
  }));

  await Task.insertMany(tasks);
  return { imported: tasks.length };
};

exports.generateReport = async (userId) => {
  const tasks = await Task.find({ user: userId }).lean();
  const worksheet = XLSX.utils.json_to_sheet(tasks);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, `tasks_report_${Date.now()}.xlsx`);
  XLSX.writeFile(workbook, filePath);

  return { filePath, fileName: path.basename(filePath) };
};
