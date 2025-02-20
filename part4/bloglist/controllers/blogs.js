// npm module imports
const blogsRouter = require('express').Router()

// models
const Blog = require('../models/blog')

// routes
blogsRouter.get('/', (req, res, next) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
    .catch(err => next(err))
})

blogsRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(savedBlogPost => {
      res.status(201).json(savedBlogPost)
    })
    .catch(err => next(err))
})

// exports
module.exports = blogsRouter