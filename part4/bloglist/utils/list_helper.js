// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogposts) => {
  return blogposts.reduce((sumLikes, blogpost) => sumLikes + blogpost.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return {}
  if(blogs.length === 1) return blogs.map(blog => ({ title: blog.title, author: blog.author, likes: blog.likes }))[0]

  const sortedByLikes = blogs.sort((a, b) => b.likes - a.likes)
  // console.log(sortedByLikes)
  return sortedByLikes.map(blog => ({ title: blog.title, author: blog.author, likes: blog.likes }))[0]
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return {}
  if(blogs.length === 1) return blogs.map(blog => ({ author: blog.author, blogs: 1 }))[0]

  const hashmap = new Map()
  blogs.forEach(blog => {
    if(hashmap.get(blog.author)) hashmap.set(blog.author, hashmap.get(blog.author) + 1)
    else hashmap.set(blog.author, 1)
  })
  // create array from hashmap entries and map them in wanted shape, then sort descending and return first/highest entry
  return Array.from(hashmap.entries()).map(entry => ({ author: entry[0], blogs: entry[1] })).sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) return {}
  if(blogs.length === 1) return blogs.map(blog => ({ author: blog.author, likes: blog.likes }))[0]

  const hashmap = new Map()
  blogs.forEach(blog => {
    if(hashmap.get(blog.author)) hashmap.set(blog.author, hashmap.get(blog.author) + blog.likes)
    else hashmap.set(blog.author, blog.likes)
  })
  // create array from hashmap entries and map them in wanted shape, then sort descending and return first/highest entry
  return Array.from(hashmap.entries()).map(entry => ({ author: entry[0], likes: entry[1] })).sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

