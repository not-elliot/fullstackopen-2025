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
  name: {
    type: String,
    minLength: [3, 'too short (needs at least 3 characters)'],
    required: [true, 'required']
  },
  number: {
    type: String,
    minLength: [8, 'too short (needs at least 8 characters)'],
    required: [true, 'required'],
    validate: {
      validator: (val) => {

        const isValid = /^\d{2,4}-\d+$/.test(val)
        return isValid
      },
      message: function(props) {
        return `${props.value} has the wrong format - format needs to be: d{2,4}-d+`
      }
    }
  }
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