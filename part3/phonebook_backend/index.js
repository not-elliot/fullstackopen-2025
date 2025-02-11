const morgan = require('morgan')
const cors = require('cors')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3001
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// functions
const generateId = () => {
    return String(Math.floor(Math.random() * 10000000))
}

// incoming middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
// app.use(morgan('tiny'))
morgan.token('body', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// routes
app.get('/info', (req, res) => {
    res.send(`
        Phonebook has info for ${persons.length} people
        <br />
        <br />
        ${new Date(Date.now())}    
    `)
})

app.get('/api/persons', (req, res) => res.json(persons))
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if(!person) return res.status(404).end()
    res.json(person)
})
app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    if(persons.find(person => person.name === body.name)) {
        return res.status(409).json({
            error: "name must be unique"
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    res.json(newPerson)
})
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    console.log('person being deleted:', person)    
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

// start server
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`))