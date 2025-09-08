const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// Wait for mongoose connection before starting the server
const startServer = async () => {
  try {
    // Wait for mongoose to be ready
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve()
      } else {
        mongoose.connection.once('connected', resolve)
      }
    })
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
  }
}

startServer()