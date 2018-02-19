// models/batch.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const daySchema = new Schema({
  date: { type: Date, default: Date.now },
  color: { type: String },
});

const studentSchema = new Schema({
  name: { type: String },
  picture: { type: String },
  days: [daySchema],
});

const batchSchema = new Schema({
  batchNr: { type: Number },
  students: [studentSchema],
  askedStudents: { type: Array, default: [] },
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model('batches', batchSchema)
