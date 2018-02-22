const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date: { type: Date, default: Date.now },
  color: { type: String },
  userId: { type: String },
  remarks: { type: String, default: '' }
});

const studentSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
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
