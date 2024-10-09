// our env varibles to export (port, uri)
require('dotenv').config()

// choose mongo database for testing and production
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const PORT = process.env.PORT

const SECRET = process.env.SECRET

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET
}
