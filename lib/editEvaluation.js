module.exports = (batch, data) => {

  let students = batch.students

  const currentStudent = students.filter((s) => {
    return s._id.toString() === data[0].toString()
  })[0]

  const currentEvaluation = currentStudent.evaluations.filter((e) => {
    return e._id.toString() === data[1].toString()
  })[0]

  let updatedRemarks = currentEvaluation.remarks
  let updatedColor = currentEvaluation.color

  if (data[2].remarks) {
    updatedRemarks = data[2].remarks
  }

  if (data[2].color) {
    updatedColor = data[2].color
  }

  const updatedEvaluations = currentStudent.evaluations.map((e) => {
    if (e._id.toString() === data[1].toString()) {
      e.remarks = updatedRemarks
      e.color = updatedColor
    }
    return e
  })

  const updatedStudents = students.map((s) => {
    if (s._id.toString() === data[0].toString()) {
      s.evaluations = updatedEvaluations
    }
    return s
  })

  return {...batch, students: updatedStudents}
}
