// npm module imports
const notesRouter = require('express').Router()

// my module imports
const logger = require('../utils/logger')

// models
const Note = require('../models/note')

// database test
Note.find({}).then(notes => {
  logger.info('mongoose notes:')
  notes.forEach(note => logger.info(note.content, ' - ', note.important))
  // mongoose.connection.close()
})

// routes
notesRouter.get('/', (req, res, next) => {
  Note
    .find({})
    .then(notes => res.json(notes))
    .catch(err => next(err))
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id

  Note
    .findById(id)
    .then(note => {
      if(!note) return res.status(404).end()
      res.json(note)
    })
    .catch(err => next(err))
})

notesRouter.post('/', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  })

  note
    .save()
    .then(savedNote => {
      // here are _id and __v still existent
      logger.info('savedNote:', savedNote)
      // here .toJSON will be used to get rid of _id and __v
      res.json(savedNote)
    })
    .catch(err => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
  const { id } = req.params
  const { content, important } = req.body

  const note = {
    content,
    important,
  }

  // validations are not run by default when findOneAndUpdate and related methods are executed -> add runValidators: true, context: 'query' to options
  Note
    .findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(err => next(err))
})

notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id

  Note
    .findByIdAndDelete(id)
    .then(deletionInfo => {
      logger.info('deletionInfo:', deletionInfo)
      res.status(204).end()
    })
    .catch(err => next(err))
})

// export
module.exports = notesRouter