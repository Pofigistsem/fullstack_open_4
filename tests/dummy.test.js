const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper.js')

test('dummy returns 1', () => {
    const blogs = []

    assert.strictEqual(listHelper.dummy(blogs), 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '66ca6f0dc03b8f7348f2325e',
            title: 'hello world',
            author: 'John Jones',
            url: 'www.example1.com',
            likes: 22,
            __v: 0
        }
    ]
    test('when list has only one blog, total likes is equal to likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 22)
    })
})

describe('returns most liked blog', () => {
    const blogList = [
        {
            _id: '66ca6ef4c03b8f7348f2325b',
            title: 'example_title1',
            author: 'Jeff Bezos',
            url: 'www.amazing.com',
            likes: 25,
            __v: 0
        },
        {
            _id: '66ca6f0dc03b8f7348f2325e',
            title: 'hello world',
            author: 'John Jones',
            url: 'www.example1.com',
            likes: 22,
            __v: 0
        }
    ]
    const mostLiked = {
        title: 'example_title1',
        author: 'Jeff Bezos',
        likes: 25,
    }
    assert.deepStrictEqual(listHelper.favoriteBlog(blogList), mostLiked) // compare most liked returned vs defined above
})

describe('returns most liked author', () => {
    const blogList = [
        {
            _id: '66ca6ef4c03b8f7348f2325b',
            title: 'example_title1',
            author: 'Jeff Bezos',
            url: 'www.amazing.com',
            likes: 2,
            __v: 0
        },
        {
            _id: '66ca6f0dc03b8f7348f2325e',
            title: 'hello world',
            author: 'John Jones',
            url: 'www.example1.com',
            likes: 5,
            __v: 0
        },
        {
            _id: 'newid2',
            title: 'newtitle2',
            author: 'John Jones',
            url: 'www.fewfew.com',
            likes: 2,
            __v: 0
        },
        {
            _id: 'newid1',
            title: 'hello world',
            author: 'Miles Will',
            url: 'www.mwill.com',
            likes: 4,
            __v: 0
        },
        {
            _id: 'newid3',
            title: 'fpeowfkwe',
            author: 'Miles Will',
            url: 'www.mwill4.com',
            likes: 4,
            __v: 0
        },
        {
            _id: 'newid4',
            title: 'fpeowfkwe',
            author: 'Miles Will',
            url: 'www.mwill4.com',
            likes: 4,
            __v: 0
        },
    ]
    const largestAmount = {
        author: 'Miles Will',
        blogs: 3
    }

    assert.deepStrictEqual(listHelper.mostBlogs(blogList), largestAmount)
})

describe('most liked author', () => {
    const blogList = [
        {
            _id: '66ca6ef4c03b8f7348f2325b',
            title: 'example_title1',
            author: 'Jeff Bezos',
            url: 'www.amazing.com',
            likes: 2,
            __v: 0
        },
        {
            _id: '66ca6f0dc03b8f7348f2325e',
            title: 'hello world',
            author: 'John Jones',
            url: 'www.example1.com',
            likes: 5,
            __v: 0
        },
        {
            _id: 'newid2',
            title: 'newtitle2',
            author: 'John Jones',
            url: 'www.fewfew.com',
            likes: 2,
            __v: 0
        },
        {
            _id: 'newid1',
            title: 'hello world',
            author: 'Miles Will',
            url: 'www.mwill.com',
            likes: 4,
            __v: 0
        },
        {
            _id: 'newid3',
            title: 'fpeowfkwe',
            author: 'Miles Will',
            url: 'www.mwill4.com',
            likes: 4,
            __v: 0
        },
        {
            _id: 'newid4',
            title: 'fpeowfkwe',
            author: 'Miles Will',
            url: 'www.mwill4.com',
            likes: 4,
            __v: 0
        },
    ]
    const mostLiked = {
        author: 'Miles Will',
        likes: 12
    }
    assert.deepStrictEqual(listHelper.mostLikes(blogList), mostLiked)
})