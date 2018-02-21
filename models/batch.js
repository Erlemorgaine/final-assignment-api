const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date: { type: Date, default: Date.now },
  color: { type: String },
  userId: { type: String },
});

const studentSchema = new Schema({
  name: { type: String },
  picture: { type: String },
  evaluations: [evaluationSchema],
});

const batchSchema = new Schema({
  batchNr: { type: Number },
  students: [studentSchema],
  askedStudents: { type: Array, default: [] },
  startDate: { type: Date },
  endDate: { type: Date },
});

module.exports = mongoose.model('batches', batchSchema)
