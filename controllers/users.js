const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res, next) => {
    try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
    res.json(users)

    } catch(e) {
        next(e)
    }
})

usersRouter.post('/', async (req, res, next) => {
    try {
        const { username, password, name } = req.body
        if (password.length >= 3) {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)
            const newUser = new User({
                username,
                passwordHash,
                name
            })
            const savedUser = await newUser.save()
            res.status(200).json(savedUser)
        } else {
            res.status(400).send({ error: 'malformatted password ' })
        }
    } catch(e) {
        next(e)
    }
})

module.exports = usersRouter