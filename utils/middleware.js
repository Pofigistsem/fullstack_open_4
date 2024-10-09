const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', req.body)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      req.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, config.SECRET)
    req.user = decodedToken.id
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown Endpoint' })
}

// handle errors that might arise when using controllers
const errorHandler = (e, req, res, next) => {
    logger.error(e.message)
    if (e.name === 'CastError') {
        res.status(400).send({ error:'malformatted id' })
    } else if(e.name === 'ValidationError') {
        res.status(400).json({ error: e.message })
    } else if (e.name === 'MongoServerError' && e.message.includes('E11000 duplicate key error')){
        res.status(400).json({ error: 'expected `username` to be unique' })
    } else if (e.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' })
    } else if (e.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' })
    }
    next()
}

module.exports = {
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler
}
