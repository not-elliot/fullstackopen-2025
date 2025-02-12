// npm modules import
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')

// my modules import
const Person = require('./models/person')

// vars
const app = express()
const PORT = process.env.PORT || 3001

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     },
//     { 
//       "id": "5",
//       "name": "Anna Erna", 
//       "number": "0332-242353324"
//     },
//     { 
//       "id": "6",
//       "name": "Moritz Bleibscheu", 
//       "number": "03122-13324"
//     },
//     { 
//       "id": "7",
//       "name": "Herman Boring", 
//       "number": "0331-32453252"
//     }
// ]

// functions

// const generateId = () => {
//     return String(Math.floor(Math.random() * 10000000))
// }

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

app.get('/api/persons', (req, res) => {
    // res.json(persons)

    Person
        .find({})
        .then(allPersons => {
            console.log('all persons in DB:')        
            allPersons.forEach(person => console.log(person.name, person.number));
            if(!allPersons) return res.status(404).json({ error: '404 - nothing found' })
            res.json(allPersons)
        })
        .catch(err => res.status(500).json({ error: '500 - something went wrong' }))
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    // const person = persons.find(person => person.id === id)
    // if(!person) return res.status(404).end()
    // res.json(person)

    Person
        .findById(id)
        .then(returnedPerson => {
            console.log('returnedPerson:', returnedPerson)
            if(!returnedPerson) return res.status(404).json({ error: '404 - nothing found' })
            res.json(returnedPerson)
        })
        .catch(err => res.status(500).json({ error: '500 - something went wrong' }))
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(!body.name || !body.number) {
        return res.status(400).json({ error: "400 - name or number missing" })
    }

    // if(persons.find(person => person.name === body.name)) {
    //     return res.status(409).json({
    //         error: "name must be unique"
    //     })
    // }

    // const newPerson = {
    //     id: generateId(),
    //     name: body.name,
    //     number: body.number
    // }

    // persons = persons.concat(newPerson)

    // res.json(newPerson)

    // check if person already exists
    Person
        .findOne({ name: body.name })
        .then(returnedPerson => {
            console.log("returnedPerson:", returnedPerson)
            // if person exists send error
            if(returnedPerson) {
                console.log('person exists, abort')
                return res.status(409).json({ error: "409 - name must be unique" })
            // else create new person and save
            } else {
                const newPerson = new Person({
                    name: body.name,
                    number: body.number
                })
            
                newPerson
                    .save()
                    .then(savedPerson => {
                        console.log("savedPerson:", savedPerson)
                        res.json(savedPerson)
                    })
                    .catch(err => res.status(500).json({ error: "500 - something went wrong" }))
            }
        })
        .catch(err => res.status(500).json({ error: "500 - something went wrong "}))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    // const person = persons.find(person => person.id === id)
    // console.log('person being deleted:', person)    
    // persons = persons.filter(person => person.id !== id)
    // res.status(204).end()
    Person
        .deleteOne(new mongoose.Types.ObjectId(id))
        .then(deleteInfos => {
            console.log('deleteInfos:', deleteInfos)
            res.status(204).end()
        })
        .catch(err => res.status(500).json({ error: "500 - something went wrong" }))
})

// start server
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`))