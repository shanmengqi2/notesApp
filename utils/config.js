require('dotenv').config()

const PORT = process.env.PORT || process.env.PORT_NOTEAPP || 3001
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const SECRET = process.env.SECRET

// Debug logging for environment variables (only log existence, not values)
if (process.env.NODE_ENV === 'production') {
  console.log('Environment check:')
  console.log('- MONGODB_URI exists:', !!MONGODB_URI)
  console.log('- SECRET exists:', !!SECRET)
  console.log('- NODE_ENV:', process.env.NODE_ENV)

  // Ensure critical environment variables are present in production
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required in production')
  }
  if (!SECRET) {
    throw new Error('SECRET environment variable is required in production')
  }
}

module.exports = { MONGODB_URI, PORT, SECRET }