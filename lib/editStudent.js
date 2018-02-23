module.exports = (batch, data) => {

  let students = batch.students

  const currentStudent = students.filter((s) => {
    return s._id.toString() === data[0].toString()
  })[0]

  let updatedFirstName = currentStudent.firstName
  let updatedLastName = currentStudent.lastName
  let updatedPicture = currentStudent.picture

  if (data[1].firstName) {
    updatedFirstName = data[1].firstName
  }

  if (data[1].lastName) {
    updatedLastName = data[1].lastName
  }

  if (data[1].picture) {
    updatedPicture = data[1].picture
  }

  const updatedStudents = students.map((s) => {
    if (s._id.toString() === data[0].toString()) {
      s.firstName = updatedFirstName
      s.lastName = updatedLastName
      s.picture = updatedPicture
    }
    return s
  })

  return {...batch, students: updatedStudents}
}
