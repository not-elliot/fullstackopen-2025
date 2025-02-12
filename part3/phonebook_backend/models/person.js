const mongoose = require('mongoose')

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'too short (needs at least 3 characters)'],
    required: [true, 'required'],
    unique: true
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