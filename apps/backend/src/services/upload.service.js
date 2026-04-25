const XLSX = require('xlsx');
const RoutineSheet = require('../models/RoutineSheet');

// Map raw Excel column headers → schema field names
// Trim keys because Excel sometimes adds trailing spaces (e.g. "Start Time ")
const mapRowToSchema = (rawRow) => ({
  blockName:          String(rawRow['Block Name']          ?? '').trim(),
  startTime:          String(rawRow['Start Time']          ?? rawRow['Start Time '] ?? '').trim(),
  endTime:            String(rawRow['End Time']            ?? rawRow['End Time ']   ?? '').trim(),
  reflectionQuestion: String(rawRow['Reflection Question'] ?? '').trim(),
  activity:           String(rawRow['Activity']            ?? '').trim(),
  category:           String(rawRow['Category']            ?? '').trim(),
  day:                String(rawRow['Day']                 ?? '').trim(),
  note:               String(rawRow['Note']                ?? '').trim(),
});

exports.parseFile = async (file) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const workbook = XLSX.read(file.buffer, { type: 'buffer' });

  const savedSheets = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    // First row = headers (keys), remaining rows = data
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // Map each raw row to our strict schema shape
    const mappedRows = rawRows.map(mapRowToSchema);

    console.log(`\n=== Sheet: "${sheetName}" (${mappedRows.length} rows) ===`);
    console.log(JSON.stringify(mappedRows, null, 2));

    // Save to MongoDB
    const doc = await RoutineSheet.create({
      sheetName,
      uploadedFile: file.originalname,
      rows: mappedRows,
    });

    savedSheets.push(doc);
  }

  return {
    message: `${savedSheets.length} sheet(s) saved to database`,
    sheets: savedSheets.map((doc) => ({
      id:        doc._id,
      sheetName: doc.sheetName,
      rowCount:  doc.rows.length,
    })),
  };
};

exports.generateReport = async () => {
  throw new Error('Report generation is not available in the current setup');
};
