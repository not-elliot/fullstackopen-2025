const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()

// models
const Note = require('./models/note')

// vars
const PORT = process.env.PORT || 3001

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },{
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },{
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

// functions
const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    return String(maxId + 1)
}

const requestLogger = (req, res, next) => {
    console.log(`Method: ${req.method}`)
    console.log(`Path: ${req.path}`)
    console.log(`Body:`, req.body)
    console.log(`---`)
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: "unknown endpoint"
    })
}

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
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

app.get('/', (req, res) => res.send('<h1>Hello World!</h1>'))

app.get('/api/notes', (req, res) => {
    const notesFromDB = Note.find({}).then(notes => res.json(notes))
    // res.json(notes)
})
app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)

    // if(note) {
    //     res.json(note)
    // } else {
    //     res.status(404).end()
    // }

    if(!note) return res.status(404).end()
    
    res.json(note)
})
app.post('/api/notes', (req, res) => {
    const body = req.body

    if(!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    console.log('note:', note)

    notes = notes.concat(note)

    res.json(note)    
})
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)
    
    res.status(204).end()
})

// outgoing middleware
app.use(unknownEndpoint)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
