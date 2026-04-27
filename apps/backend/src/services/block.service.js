const RoutineSheet = require('../models/RoutineSheet');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const clean = String(timeStr).trim();
  const [hh, mm] = clean.split(':').map(Number);
  if (isNaN(hh) || isNaN(mm)) return 0;
  return hh * 60 + mm;
};

const nowInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

// Map a RoutineSheet document → TimeBlock shape expected by mobile
// Each sheet = one TimeBlock; rows = tasks array
const sheetToTimeBlock = (sheet, index) => {
  const rows = sheet.rows ?? [];

  // First row drives block-level fields (blockName, startTime, endTime, reflection)
  const first = rows[0] ?? {};

  const startTime = first.startTime ?? '';
  const endTime   = first.endTime   ?? '';
  const startMins = timeToMinutes(startTime);
  const endMins   = timeToMinutes(endTime);
  const now       = nowInMinutes();

  // Progress percent
  const total    = endMins - startMins;
  const elapsed  = Math.max(0, now - startMins);
  const progressPercent = total > 0
    ? Math.min(100, Math.round((elapsed / total) * 100))
    : 0;

  // Time remaining
  const timeRemainingMinutes = Math.max(0, endMins - now);

  // Tasks — every row becomes a task
  const tasks = rows.map((row) => ({
    activity: row.activity  ?? '',
    category: normCategory(row.category),
    dayType:  normDay(row.day),
    note:     row.note      ?? '',
  }));

  return {
    _id:                  sheet._id.toString(),
    sheetName:            sheet.sheetName ?? '',
    blockName:            first.blockName ?? sheet.sheetName ?? '',
    startTime,
    endTime,
    startMinutes:         startMins,
    endMinutes:           endMins,
    order:                index,
    reflectionQuestion:   first.reflectionQuestion ?? '',
    tasks,
    progressPercent,
    timeRemainingMinutes,
    uploadedFile:         sheet.uploadedFile ?? '',
    createdAt:            sheet.createdAt,
  };
};

// Normalize category string → 'jism' | 'rooh' | 'dimag' | 'ALL'
const normCategory = (cat) => {
  const c = String(cat ?? '').toLowerCase().trim();
  if (c === 'body'  || c === 'jism')  return 'jism';
  if (c === 'soul'  || c === 'rooh')  return 'rooh';
  if (c === 'mind'  || c === 'dimag') return 'dimag';
  return 'ALL';
};

// Normalize day string → DayType
const VALID_DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
const normDay = (day) => {
  const d = String(day ?? '').toUpperCase().trim();
  if (VALID_DAYS.includes(d)) return d;
  return 'ALL';
};

// ─── Service Methods ──────────────────────────────────────────────────────────

// GET /api/blocks — all TimeBlocks sorted by startTime
exports.getAllBlocks = async () => {
  const sheets = await RoutineSheet.find().lean();
  const blocks = sheets.map(sheetToTimeBlock);
  blocks.sort((a, b) => a.startMinutes - b.startMinutes);
  return blocks;
};

// GET /api/blocks/:id — single TimeBlock by sheet _id
exports.getBlockById = async (id) => {
  const sheet = await RoutineSheet.findById(id).lean();
  if (!sheet) throw new Error('Block not found');
  return sheetToTimeBlock(sheet, 0);
};

// GET /api/blocks/current-block — block active right now
exports.getCurrentBlock = async () => {
  const blocks = await exports.getAllBlocks();
  const now    = nowInMinutes();

  const current = blocks.find(
    (b) => now >= b.startMinutes && now < b.endMinutes
  );

  if (!current) return null;

  // Filter today's tasks
  const DAY_CODES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const todayCode = DAY_CODES[new Date().getDay()];
  const todayTasks = current.tasks.filter(
    (t) => t.dayType === 'ALL' || t.dayType === todayCode
  );

  return { ...current, todayTasks };
};

// GET /api/blocks/next-block — first block starting after now
exports.getNextBlock = async () => {
  const blocks = await exports.getAllBlocks();
  const now    = nowInMinutes();

  return blocks.find((b) => b.startMinutes > now) ?? null;
};
