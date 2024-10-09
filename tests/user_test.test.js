const { describe, beforeEach, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helper')

describe('setup users before each test', () => {
    beforeEach( async () => {
        await User.deleteMany({})
        const hashedPassword = await bcrypt.hash('userTestPassword1', 10)
        const user = new User({
            username: 'userTest1',
            passwordHash: hashedPassword,
            name: 'User Test'
        })
       await user.save()
    })
    test('possible to view all users with get', async () => {
        const startingUsers = await helper.getUsers()
        //console.log('user: ', typeof(startingUsers[0].id))
        const response = await api
        .get('/api/users')
        assert.strictEqual(startingUsers.length, response.body.length)
    })

    test('valid user is being added to database', async () => {
        const startingUsers = await helper.getUsers()
        const newUser = {
            username: 'validUsername1234',
            name: 'Valid Username',
            password: 'deleteLater1234'
        }

        const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-type', /application\/json/)

        const endingUsers = await helper.getUsers()

        assert.strictEqual(startingUsers.length + 1, endingUsers.length)
        assert.deepStrictEqual(newUser.username, response.body.username)
    })

    test('invalid users with the same username are not added and respond with 401', async () => {
        const startingUsers = await helper.getUsers()

        const newUser = {
            username: 'userTest1',
            password: 'johnsSecretPassword',
            name: 'Whatever Name'
        }

        const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const endUsers = await helper.getUsers()
        assert.strictEqual(startingUsers.length, endUsers.length)
        assert(response.body.error.includes('expected `username` to be unique'))
    })
    test('bad formatted users are not added', async () => {
        const usersAtStart = await helper.getUsers()
        const newUser = {
            password: 'johnsSecretPassword',
            name: 'Whatever Name'
        }
        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const userstAtEnd = await helper.getUsers()

        assert.strictEqual(usersAtStart.length, userstAtEnd.length)
    })
})


after(async () => {
    mongoose.connection.close()
})