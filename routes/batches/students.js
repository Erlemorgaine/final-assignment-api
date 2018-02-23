const router = require('express').Router()
const passport = require('../../config/auth')
const { Batch, User } = require('../../models')
const editStudent = require('../../lib/editStudent')
const editEvaluation = require('../../lib/editEvaluation')

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

module.exports = io => {
  router
    .get('/batches/:id/students', (req, res, next) => {
      id = req.params.id

      Batch.findById(id)
        .then((batch) => {
          if (!batch || !batch.students) { return next() }

          res.json(batch.students)
        })
    })

    .get('/batches/:id/students/:id', loadBatch, (req, res, next) => {
      if (!req.batch || !req.students) { return next() }
      res.json(req.students)
    })

    .post('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      newStudent = {...req.body, evaluations: [{ date: Date.now(), color: 'red', remarks: 'Not yet evaluated', userId: req.account._id }]}

      req.batch.students = [...req.batch.students, newStudent]

      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))
    },

    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.batch.students
        }
      })
      res.json(req.batch.students)
    })
    .patch('/batches/:id/students', authenticate, (req, res, next) => {
      const id = req.params.id

      Batch.findById(id)
        .then((batch) => {
          if (!batch) { return next() }

          const updatedBatch = editStudent(batch, req.body)

          Batch.findByIdAndUpdate(id, { $set: updatedBatch }, { new: true })
            .then((batch) => {
              io.emit('action', {
                type: 'BATCH_STUDENT_UPDATED',
                payload: batch
              })
              res.json(batch)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
      },
      (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENT_UPDATED',
        payload: {
          batch: batch,
          students: batch.students
        }
      })
      res.json(batch.students)
    })
    .delete('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      const studentId = req.body.id
      const currentStudent = req.batch.students.filter((s) => {
        return s._id.toString() === studentId
      })[0]

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

    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.batch.students
        }
      })
      res.json(req.batch.students)
    })

  return router
}
