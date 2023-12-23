const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/user_extractor.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

// Create a new blog
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  // If title or url is missing, 400 bad request
  if (!body.title || ! body.url) {
    return response.status(400).json({ error: 'missing title/url property' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: request.user._id
  })
  let savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog.id)
  await request.user.save()

  savedBlog = await savedBlog.populate('user')
  response.status(201).json(savedBlog)
})

// Delete a blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  // Unauthorized
  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'unauthorized to delete this blog' })
  }
  await Blog.findByIdAndDelete(id)
  request.user.blogs = request.user.blogs.filter(blog => blog._id.toString() !== id)
  await request.user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const res = await Blog.findByIdAndUpdate(id, request.body, { new: true })
  response.json(res)
})

module.exports = blogsRouter