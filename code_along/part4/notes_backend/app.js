// npm module imports
const cors = require('cors')
const mongoose = require('mongoose')
const express = require('express')

// my module imports
const config = require('./utils/config')
const logger = require('./utils/logger')

// route imports
const notesRouter = require('./controllers/notes')

// middleware imports
const middleware = require('./utils/middleware')

// vars
const app = express()

// database
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(err => {
    logger.error('error connection to MongoDB:', err.message)
  })

// incoming middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // json parser middleware
app.use(middleware.requestLogger)

// info route
app.get('/api', (req, res) => res.send('<h1>Hello World!</h1>'))

// note routes
app.use('/api/notes', notesRouter)

// outgoing middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// export
module.exports = app