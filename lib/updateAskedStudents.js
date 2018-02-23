const _ = require('underscore')

module.exports = (batch) => {

  const { students, askedStudents } = batch

  const redStudents = students.filter((s) => {
    return s.evaluations[s.evaluations.length-1].color === 'red'
  })

  const yellowStudents = students.filter((s) => {
    return s.evaluations[s.evaluations.length-1].color === 'yellow'
  })

  const greenStudents = students.filter((s) => {
    return s.evaluations[s.evaluations.length-1].color === 'green'
  })

  console.log('asked students: ' + askedStudents)

  const redAskedStudents = askedStudents.filter((s) => {
    if (!s) {
      return
    }
    return s.evaluations[s.evaluations.length-1].color === 'red'
  })

  const yellowAskedStudents = askedStudents.filter((s) => {
    if (!s) {
      return
    }
    return s.evaluations[s.evaluations.length-1].color === 'yellow'
  })

  const greenAskedStudents = askedStudents.filter((s) => {
    if (!s) {
      return
    }
    return s.evaluations[s.evaluations.length-1].color === 'green'
  })

  let percentageRed = Math.round((redAskedStudents.length / askedStudents.length) * 100) / 100
  let percentageYellow = Math.round((yellowAskedStudents.length / askedStudents.length) * 100) / 100
  let percentageGreen = Math.round((greenAskedStudents.length / askedStudents.length) * 100) / 100

  let randomStudent = []

  if (percentageRed < 0.50 && redStudents.length > 0) {
    randomStudent = [_.sample(redStudents)]
  } else if (percentageYellow < 0.34 && yellowStudents.length > 0) {
    randomStudent = [_.sample(yellowStudents)]
  } else if (percentageGreen < 0.19 && greenStudents.length > 0) {
    randomStudent = [_.sample(greenStudents)]
  } else {
    randomStudent = [_.sample(students)]
  }

  console.log('Random student: ' + randomStudent)

  let newAskedStudents = askedStudents

  if (randomStudent.length > 0) {
    newAskedStudents = askedStudents.concat(randomStudent)
  }

  return {
    ...batch,
    askedStudents: newAskedStudents,
  }
}
