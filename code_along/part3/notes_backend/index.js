// const http = require('http')
const cors = require('cors')
// const mongoose = require('mongoose')
const express = require('express')
const app = express()

// models
const Note = require('./models/note')

// vars
const PORT = process.env.PORT || 3001

// let notes = [
//     {
//         id: "1",
//         content: "HTML is easy",
//         important: true
//     },{
//         id: "2",
//         content: "Browser can execute only JavaScript",
//         important: false
//     },{
//         id: "3",
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     }
// ]

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

// const generateId = () => {
//     const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
//     return String(maxId + 1)
// }

// database test
Note.find({}).then(notes => {
  console.log('mongoose notes:')
  notes.forEach(note => console.log(note.content, ' - ', note.important))
  // mongoose.connection.close()
})

// alternative simple server w/o express
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
// })

// incoming middleware
// json parser middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'))

app.get('/api/notes', (req, res, next) => {
  // res.json(notes)

  Note
    .find({})
    .then(notes => res.json(notes))
    .catch(err => next(err))
})
app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  // const note = notes.find(note => note.id === id)

  // if(note) {
  //     res.json(note)
  // } else {
  //     res.status(404).end()
  // }

  // if(!note) return res.status(404).end()

  // res.json(note)

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

  // // needed when there is no mongoose validation
  // if(body.content === undefined) {
  //     return res.status(400).json({
  //         error: 'content missing'
  //     })
  // }

  // const note = {
  //     content: body.content,
  //     important: Boolean(body.important) || false,
  //     id: generateId()
  // }

  // notes = notes.concat(note)
  // res.json(note)

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
  // notes = notes.filter(note => note.id !== id)
  // res.status(204).end()

  // Note
  //     .deleteOne(new mongoose.Types.ObjectId(id))
  //     .then(deletedNote => {
  //         console.log('deletedNote:', deletedNote)
  //         res.status(204).end()
  //     })
  //     .catch(err => res.status(500).json({
  //         error: '500 - something went wrong'
  //     }))

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
