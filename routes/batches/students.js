const router = require('express').Router()
const passport = require('../../config/auth')
const { Batch, User } = require('../../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadBatch = (req, res, next) => {
  const id = req.params.id

  Batch.findById(id)
    .then((batch) => {
      req.batch = batch
      next()
    })
    .catch((error) => next(error))
}

//figure out how to use this
const getStudent = (req, res, next) => {
  const id = req.params.id

  Batch.findById(id)
    .then((batch) => {
      req.batch = batch
      next()
    })
    .catch((error) => next(error))
}

const getStudents = (req, res, next) => {
  Promise.all(req.game.students.map(student => User.findById(student.userId)))
    .then((users) => {
      // Combine player data and user's name
      req.students = req.batch.students.map((player) => {
        const { name } = users
          .filter((u) => u._id.toString() === student.userId.toString())[0]

        return {
          userId: student.userId,
          symbol: student.symbol,
          name
        }
      })
      next()
    })
    .catch((error) => next(error))
}

// const getStudents = (req, res, next) => {
//   req.students = req.batch.students
//   next()
// }

module.exports = io => {
  router
    .get('/batches/:id/students', loadBatch, getStudents, (req, res, next) => {
      if (!req.batch || !req.students) { return next() }
      res.json(req.batch.students)
    })

    .get('/batches/:id/students/:id', loadBatch, /*getStudents,*/ (req, res, next) => {
      if (!req.batch || !req.students) { return next() }
      res.json(req.students)
    })

    .post('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      newStudent = req.body

      // Change to compare new student id to existing students
      // if (req.batch.students.filter((s) => s.name.toString() === newStudent.name.toString()).length > 0) {
      //   const error = Error.new('This student is already in the batch!')
      //   error.status = 401
      //   return next(error)
      // }

      // Add the student to the students
      req.batch.students = [...req.batch.students, newStudent]

      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch students data
    /*getStudents,*/
    // Respond with new student data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.students
        }
      })
      res.json(req.students)
    })

    .delete('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {

      console.log('deleting...')

      if (!req.batch) { return next() }

      const studentId = req.body.id
      const currentStudent = req.batch.students.filter((s) => {
        return s._id.toString() === studentId
      })[0]

      console.log(currentStudent)

      if (!currentStudent) {
        const error = new Error('This student is not part of this batch!')
        error.status = 401
        return next(error)
      }

      req.batch.students = req.batch.students.filter((s) => s._id.toString() !== studentId)
      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new student data
    /*getStudents,*/
    // Respond with new student data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.students
        }
      })
      res.json(req.students)
    })

  return router
}
