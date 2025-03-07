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
// // without express-async-errors npm package we need the try catch block:
// notesRouter.get('/', async (req, res, next) => {
//   try {
//     const notes = await Note.find({})
//     res.json(notes)
//   } catch(err) {
//     next(err)
//   }
// })

// routes when using npm package express-async-errors
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id

  const note = await Note.findById(id)

  if(note) {
    return res.json(note)
  }
  else {
    return res.status(404).end()
  }
})

notesRouter.post('/', async (req, res) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  const savedNote = await note.save()

  // here are _id and __v still existent
  logger.info('savedNote:', savedNote)

  // here .toJSON will be used to get rid of _id and __v
  res.status(201).json(savedNote)
})

notesRouter.put('/:id', async (req, res, ) => {
  const { id } = req.params
  const { content, important } = req.body

  const note = {
    content,
    important,
  }
  // validations are not run by default when findOneAndUpdate and related methods are executed -> add runValidators: true, context: 'query' to options
  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })

  res.json(updatedNote)
})

notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

  await Note.findByIdAndDelete(id)

  res.status(204).end()
})

// export
module.exports = notesRouter