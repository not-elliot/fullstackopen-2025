// npm module imports
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')

// models
const Note = require('./models/note')

// vars
const PORT = process.env.PORT || 3001
const app = express()

// database
const SCHEME = String(process.env.MONGO_SCHEME)
const USER = encodeURIComponent(process.env.MONGO_USER)
const PW = encodeURIComponent(process.env.MONGO_PW)
const DOMAIN = String(process.env.MONGO_URL)
const DB = String(process.env.MONGO_DB)
const PARAMS = String(process.env.MONGO_PARAMS)
const url = `${SCHEME}://${USER}:${PW}@${DOMAIN}/${DB}?${PARAMS}`

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connection to MongoDB:', err.message)
  })

// functions
const  errorHandler = (error, req, res, next) => {
  console.error(error.message)

  switch(error.name) {
  case 'CastError':
    return res.status(400).send({ error: 'malformatted id' })
  case 'ValidationError':
    return res.status(400).json({ error: error.message })
  default: next(error)
  }
}

const requestLogger = (req, res, next) => {
  console.log(`Method: ${req.method}`)
  console.log(`Path: ${req.path}`)
  console.log('Body:', req.body)
  console.log('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: 'unknown endpoint'
  })
}

// database test
Note.find({}).then(notes => {
  console.log('mongoose notes:')
  notes.forEach(note => console.log(note.content, ' - ', note.important))
  // mongoose.connection.close()
})

// incoming middleware
// json parser middleware
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(requestLogger)

app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'))

app.get('/api/notes', (req, res, next) => {
  Note
    .find({})
    .then(notes => res.json(notes))
    .catch(err => next(err))
})
app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note
    .findById(id)
    .then(note => {
      if(!note) return res.status(404).end()
      res.json(note)
    })
    .catch(err => next(err))
})
app.post('/api/notes', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false
  })

  note
    .save()
    .then(savedNote => {
      // here are _id and __v still existent
      console.log('savedNote:', savedNote)
      // here .toJSON will be used to get rid of _id and __v
      res.json(savedNote)
    })
    .catch(err => next(err))
})
app.put('/api/notes/:id', (req, res, next) => {
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
app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note
    .findByIdAndDelete(id)
    .then(deletionInfo => {
      console.log('deletionInfo:', deletionInfo)
      res.status(204).end()
    })
    .catch(err => next(err))
})

// outgoing middleware
app.use(unknownEndpoint)
app.use(errorHandler)

// start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
