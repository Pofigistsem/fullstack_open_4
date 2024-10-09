// use user token to check for auth before allowing to post
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const returnedBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(returnedBlogs)
  } catch(e) {
    next(e)
  }
  })

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
  const { body } = request
  const decodedToken = jwt.verify(request.token, config.SECRET) // get token from request compare with secret decoded
  //console.log(decodedToken)
  const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: Number(body.likes) || 0,
      user: user._id // id of a user who created a note
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch(e) {
    next(e)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  // delete by user who added it, therefore compare blog user._id with decodedToke.id
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id) // find blog to delete
    if (blog.user.toString() === user.toString()) { // compare blog user id to decoded token id
      await Blog.findByIdAndDelete(request.params.id) // find and
      response.status(204).end()
    } else {
      response.status(401).send({ error: 'bad auth' })
    }
  }
  catch(e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' })
    response.status(200).json(updatedBlog)
  } catch(e) {
    next(e)
  }
})

module.exports = blogsRouter