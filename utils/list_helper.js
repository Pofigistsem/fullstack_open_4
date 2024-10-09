const dummy = (blogs) => {
    if (blogs)
        return 1
}

const totalLikes = (blogs) => {
    let likeSum = 0
    blogs.map(blog => likeSum += blog.likes)
    return likeSum
}

const favoriteBlog = (blogs) => {
    let mostLiked = {
        likes: 0
    }
    blogs.map(blog => {
        if (blog.likes > mostLiked.likes)
            mostLiked =
            {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
    })
    return mostLiked
}

const mostBlogs = (blogs) => {
// return author with most blogs (object with author and number)
// iterate through blogs, set author, calculate for each author set as biggest
// ideally have an array of all authors and map it, then compare to blog list
// since currently we are mapping each blog and its author (there are duplicates)

let biggestAuthor = {
    author: ' ',
    blogs: 0
} // set biggest author object

const checkedAuthors = [] // checked authors

let currentAuthor = ' ' // our iterators
let blogCount = 0 // iterators

blogs.map(blog => {
    currentAuthor = blog.author // current author for outer iteration
    if (!checkedAuthors.includes(currentAuthor)) { // check whether we already checked an author
    blogs.map(blog => { // inner iteration, blog count for a specific author
        if (blog.author === currentAuthor)
            blogCount +=1
    })
    if (blogCount > biggestAuthor.blogs) // if this author has more blogs than biggest set him/her as biggest
        biggestAuthor = {
            author: currentAuthor,
            blogs: blogCount
        }
    checkedAuthors.push(currentAuthor)
    }
    blogCount = 0 // revert to default
    currentAuthor = '' // revert to default
})
return biggestAuthor
}

const mostLikes = (blogs) => {
// map through array
// return author with most amount of likes (total)
let mostLikedAuthor = {
    author: '',
    likes: 0
}

const visitedAuthors = []
let likeCount = 0
let currentAuthor = ''

blogs.map(blog => {
    if (!visitedAuthors.includes(blog.author)){
        currentAuthor = blog.author
        blogs.map(blog => {
            if (blog.author === currentAuthor)
                likeCount += blog.likes
        })
        if (likeCount > mostLikedAuthor.likes)
            mostLikedAuthor = {
                author: blog.author,
                likes: likeCount
            }
        likeCount = 0
        currentAuthor = ' '
    }
})

return mostLikedAuthor
} // try rewriting mostBlogs and mostLiked with reduce for like count

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}