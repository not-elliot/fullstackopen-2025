// my module imports
const app = require('./app') // the actual express application
const config = require('./utils/config')
const logger = require('./utils/logger')

// start server
app.listen(config.PORT, () => logger.info(`Server running on port ${config.PORT}`))
