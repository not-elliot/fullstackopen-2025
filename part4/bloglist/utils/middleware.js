// npm module imports
const morgan = require('morgan')

// my module imports
const logger = require('./logger')

// config for using morgan for custom logging
const myMorganStream = {
  write: (message) => {
    logger.info(`${new Date(Date.now())}: Morgan sagt:`, message.trim())

    // Führ weitere Logik aus, z.B. in eine Datei schreiben,
    // an einen Logging-Service schicken, etc.
  }
}
morgan.token('body', function(req) { return JSON.stringify(req.body) })
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :body', { stream: myMorganStream })

// middleware functions
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: '404 - not found' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(`ERROR HAPPENING NOW: ${error.name}`)
  switch(error.name) {
  case 'CastError':
    return res.status(400).send({ error: 'malformed id' })
  case 'ValidationError':
    return res.status(400).json({ error: error.message })
  case 'MongooseError':
    return res.status(400).json({ error: error.message })
  default: next(error)
  }
}

const requestLogger = (req, res, next) => {
  morganMiddleware(req, res, (err) => {
    if (err) {
      return next(err)
    }
    // Dann kannst du eigenen Logging-Code einfügen
    logger.info(`${new Date(Date.now())}: custom log before morgan! Pfad: ${req.path}`)

    // Und schließlich zum nächsten Middleware-Schritt
    next()
  })
}

// exports
module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger
}