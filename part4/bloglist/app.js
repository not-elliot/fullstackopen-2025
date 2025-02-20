const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

// my module imports
const config = require('./utils/config')
const logger = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()

mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(err => logger.error(err))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// exports
module.exports = app