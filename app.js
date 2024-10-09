// handle app logic and database connection
const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


mongoose.connect(config.MONGODB_URI)
 .then(() =>  logger.info('Database connection successful'))
 .catch((e) => logger.error(e))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter) // enable router for blogs
// use user extractor only for blogs
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
// enable middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app