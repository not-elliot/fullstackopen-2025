const mongoose = require('mongoose')

const SCHEME    = String(process.env.MONGO_SCHEME)
const USER      = encodeURIComponent(process.env.MONGO_USER)
const PW        = encodeURIComponent(process.env.MONGO_PW)
const URL       = String(process.env.MONGO_URL)
const DB        = String(process.env.MONGO_DB)
const PARAMS    = String(process.env.MONGO_PARAMS)

const url = `${SCHEME}://${USER}:${PW}@${URL}/${DB}?${PARAMS}`

mongoose
    .connect(url)
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.log('error connecting to MongoDB:', err.message))

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person