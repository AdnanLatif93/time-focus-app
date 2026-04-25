const RoutineSheet = require('../models/RoutineSheet');

// Convert "HH:MM" string to total minutes since midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const clean = String(timeStr).trim();
  const [hh, mm] = clean.split(':').map(Number);
  if (isNaN(hh) || isNaN(mm)) return null;
  return hh * 60 + mm;
};

// Get current time in minutes since midnight (server local time)
const nowInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Flatten all sheets into a single sorted list of blocks
// Each block = one row enriched with its sheetName and sheetId
const getAllBlocksSorted = async () => {
  const sheets = await RoutineSheet.find().lean();

  const blocks = [];

  for (const sheet of sheets) {
    for (const row of sheet.rows) {
      const startMins = timeToMinutes(row.startTime);
      const endMins   = timeToMinutes(row.endTime);

      blocks.push({
        sheetId:            sheet._id,
        sheetName:          sheet.sheetName,
        blockName:          row.blockName,
        startTime:          row.startTime,
        endTime:            row.endTime,
        startMins,          // internal — used for sorting/comparison
        endMins,            // internal — used for sorting/comparison
        reflectionQuestion: row.reflectionQuestion,
        activity:           row.activity,
        category:           row.category,
        day:                row.day,
        note:               row.note,
      });
    }
  }

  // Sort by startTime ascending
  blocks.sort((a, b) => (a.startMins ?? 0) - (b.startMins ?? 0));

  return blocks;
};

// Strip internal minute fields before sending to client
const sanitize = (block) => {
  if (!block) return null;
  const { startMins, endMins, ...rest } = block;
  return rest;
};

// ─── Service Methods ──────────────────────────────────────────────────────────

// GET /api/blocks — all sheets with their rows
exports.getAllBlocks = async () => {
  const sheets = await RoutineSheet.find().lean();
  return sheets;
};

// GET /api/block/:id — one sheet by its _id
exports.getBlockById = async (id) => {
  const sheet = await RoutineSheet.findById(id).lean();
  if (!sheet) throw new Error('Block not found');
  return sheet;
};

// GET /api/current-block — block whose startTime <= now < endTime
exports.getCurrentBlock = async () => {
  const blocks = await getAllBlocksSorted();
  const now    = nowInMinutes();

  const current = blocks.find(
    (b) => b.startMins !== null && b.endMins !== null &&
           now >= b.startMins && now < b.endMins
  );

  return sanitize(current) ?? null;
};

// GET /api/next-block — block that starts after the current one
exports.getNextBlock = async () => {
  const blocks = await getAllBlocksSorted();
  const now    = nowInMinutes();

  // Find the first block whose startTime is strictly in the future
  const next = blocks.find(
    (b) => b.startMins !== null && b.startMins > now
  );

  return sanitize(next) ?? null;
};
