const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)
beforeEach(async () => {
    await Blog.deleteMany({})
    const blogsObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogsObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as JSON', async () => {
    await api
    .get('/api/blogs/')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs/')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('verify that the unique identifier of the blog is id', async () => {
    const response = await api.get('/api/blogs/')
    assert(response.body[0].id) // check whether first blog has id property
})

test('verify that POST to /api/blogs/ creates a new blog post', async () => {
    // authorize new user
    // add new user as user to a blog

    const tokenResponse = await api
    .post('/api/login')
    .send(helper.userToLog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newBlog = {
        title: 'newTestBlog',
        author: 'Will Smith',
        url: 'www.newBlogSmith.net',
        likes: 4,
    }

    await api
    .post('/api/blogs/')
    .send(newBlog)
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.getBlogs()
    const titles = blogsAtEnd.map(b => b.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert(titles.includes('newTestBlog'))
})

test('set likes number to 0 if they are missing', async () => {
    const tokenResponse = await api
    .post('/api/login')
    .send(helper.userToLog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newBlog = {
        title: 'blbalba',
        author: 'Josh Eager',
        url: 'www.newBlog.net'
    }

    await api
    .post('/api/blogs/')
    .send(newBlog)
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.getBlogs()
    const [ addedBlog ] = await Blog.find({ title: 'blbalba' })
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.strictEqual(addedBlog.likes, 0)
})

test('respond with code 400 if title or url is missing', async () => {

    const tokenResponse = await api
    .post('/api/login')
    .send(helper.userToLog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const newBlog = {
        author: 'Josh Eager',
    }

    await api
    .post('/api/blogs/')
    .send(newBlog)
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .expect(400)

    const blogsAtEnd = await helper.getBlogs()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog with correct id is being deleted correctly (204 code)', async () => {

    const tokenResponse = await api
    .post('/api/login')
    .send(helper.userToLog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.getBlogs()
    const blogToDelete = blogsAtStart[0]

    //console.log('fdsafds :', blogToDelete)

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${tokenResponse.body.token}`)
    .expect(204)

    const blogsAtEnd = await helper.getBlogs()
    const ids = blogsAtEnd.map(b => b.id)

    assert(!ids.includes(blogToDelete.id))
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})
// update blog (likes)
test('blogs are being updated and return updated blog as a response', async () => {
    const startingBlogs = await helper.getBlogs()
    const blogToUpdate = startingBlogs[0]
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect({ ...updatedBlog, user: String(updatedBlog.user) })

    const blogsAtEnd = await helper.getBlogs()
    const newBlog =  blogsAtEnd[0]

    assert.strictEqual(blogToUpdate.likes + 1, newBlog.likes)
})

test('fail adding new blog with 401 Unauthorized code if no token', async () => {
    const startingBlogs = await helper.getBlogs()

    const newBlog = {
        title: 'newTestBlog',
        author: 'Will Smith',
        url: 'www.newBlogSmith.net',
        likes: 4,
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

    const endingBlogs = await helper.getBlogs()
    assert.strictEqual(startingBlogs.length, endingBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})
