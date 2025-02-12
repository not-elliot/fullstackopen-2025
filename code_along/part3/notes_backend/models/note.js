const mongoose = require('mongoose')

// database setup
// vars
const SCHEME = String(process.env.MONGO_SCHEME)
const USER = encodeURIComponent(process.env.MONGO_USER)
const PW = encodeURIComponent(process.env.MONGO_PW)
const DOMAIN = String(process.env.MONGO_URL)
const DB = String(process.env.MONGO_DB)
const PARAMS = String(process.env.MONGO_PARAMS)
const url = `${SCHEME}://${USER}:${PW}@${DOMAIN}/${DB}?${PARAMS}`

// settings
mongoose.set('strictQuery', false)

// connect to db
mongoose
    .connect(url)
    .then(res => {
        console.log('connected to MongoDB')
    })
    .catch(err => {
        console.log('error connection to MongoDB:', err.message)        
    })

// create schema for notes
const noteSchema = mongoose.Schema({
    content: String,
    important: Boolean
})

// setup returned JSON object -> delete versioning and convert id to string
noteSchema.set('toJSON', {
    transform: (document, returnedObnject) => {
        returnedObnject.id = returnedObnject._id.toString()
        delete returnedObnject._id
        delete returnedObnject.__v
    }
})

// create model for a note
const Note = mongoose.model('Note', noteSchema)

module.exports = Note