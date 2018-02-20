// routes/batches.js
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

const getStudents = (req, res, next) => {
  Promise.all(req.batch.students.map(students => User.findById(player.userId)))
    .then((users) => {
      // Combine player data and user's name
      req.players = req.batch.players.map((player) => {
        const { name } = users
          .filter((u) => u._id.toString() === player.userId.toString())[0]

        return {
          userId: player.userId,
          symbol: player.symbol,
          name
        }
      })
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    .get('/batches/:id/students', loadBatch, getStudents, (req, res, next) => {
      if (!req.batch || !req.students) { return next() }
      res.json(req.students)
    })

    .post('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      const userId = req.account._id

      // Change to compare new student id to existing students
      if (req.batch.students.filter((s) => s.userId.toString() === userId.toString()).length > 0) {
        const error = Error.new('This student is already in the batch!')
        error.status = 401
        return next(error)
      }

      // Add the student to the students
      req.batch.students = [...req.batch.students, { userId }]

      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch students data
    getStudents,
    // Respond with new player data in JSON and over socket
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

    .delete('/batches/:id/students', authenticate, (req, res, next) => {
      if (!req.batch) { return next() }

      const userId = req.account._id
      const currentStudent = req.batch.students.filter((s) => s.userId.toString() === userId.toString())[0]

      if (!currentPlayer) {
        const error = Error.new('This student is not part of this batch!')
        error.status = 401
        return next(error)
      }

      req.batch.students = req.batch.students.filter((s) => s.userId.toString() !== userId.toString())
      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new player data
    getStudents,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          players: req.students
        }
      })
      res.json(req.students)
    })

  return router
}
