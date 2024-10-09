const Blog = require('../models/blog')
const User = require('../models/user')

// fetch notes
const getBlogs = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const initialBlogs = [
    {
        title: 'example_title1',
        author: 'User Test',
        url: 'www.usertestBlog.com',
        likes: 2,
        user: '6706ca49ffc75a311482ea3a'
    },
    {
        title: 'hello world',
        author: 'John Jones',
        url: 'www.example.com',
        likes: 22,
        user: '6706ca49ffc75a311482ea3a'
    }
]

const userToLog = {
    username: 'userTest1',
    password: 'userTestPassword1'
}


const getUsers = async () => {
    const returnedUsers = await User.find({})
    return returnedUsers.map(user => user.toJSON())
}

module.exports = {
    getBlogs,
    initialBlogs,
    getUsers,
    userToLog
}