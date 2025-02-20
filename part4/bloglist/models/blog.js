// npm module imports
const mongoose = require('mongoose')

// create blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [5, 'needs to be at least 5 chars'],
    required: [true, 'required'],
  },
  author: String,
  url: {
    type: String,
    unique: [true, 'blog post already present'],
    minLength: [11, 'needs to be at least 11 chars'],
    required: [true, 'required'],
  },
  likes: Number
})

// blog schema settings
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// create blog model
const Blog = mongoose.model('Blog', blogSchema)

// exports
module.exports = Blog