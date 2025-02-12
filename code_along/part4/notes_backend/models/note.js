const mongoose = require('mongoose')

// create schema for notes
// with validation
const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
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