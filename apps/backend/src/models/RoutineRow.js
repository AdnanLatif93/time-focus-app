const mongoose = require('mongoose');

// Schema for a single row inside a routine sheet
const routineRowSchema = new mongoose.Schema(
  {
    blockName:          { type: String, default: '' },
    startTime:          { type: String, default: '' },
    endTime:            { type: String, default: '' },
    reflectionQuestion: { type: String, default: '' },
    activity:           { type: String, default: '' },
    category:           { type: String, default: '' },
    day:                { type: String, default: '' },
    note:               { type: String, default: '' },
  },
  { _id: false } // rows are embedded, no separate _id needed
);

module.exports = routineRowSchema;
