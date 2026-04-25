const mongoose = require('mongoose');
const routineRowSchema = require('./RoutineRow');

// Schema for one sheet from the uploaded Excel file
// e.g. "Morning Routine", "Office Routine", "Evening Routine"
const routineSheetSchema = new mongoose.Schema(
  {
    sheetName:    { type: String, required: true, trim: true }, // e.g. "Morning Routine"
    uploadedFile: { type: String, default: '' },                // original .xlsx filename
    rows:         { type: [routineRowSchema], default: [] },    // all rows of this sheet
  },
  { timestamps: true } // createdAt, updatedAt auto-managed
);

module.exports = mongoose.model('RoutineSheet', routineSheetSchema);
