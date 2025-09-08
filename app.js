const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const notesRouter = require('./controllers/note')
const usersRouter = require('./controllers/user')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

// MongoDB connection options for better stability
const mongoOptions = {
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

mongoose
  .connect(config.MONGODB_URI, mongoOptions)
  .then(() => {
    logger.info('connected to MongoDB')
    logger.info('MongoDB connection state:', mongoose.connection.readyState)
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
    logger.error('MongoDB URI format check:', config.MONGODB_URI ? 'URI exists' : 'URI missing')
    logger.error('Full error:', error)
  })

// Add connection event listeners
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected from MongoDB')
})

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app