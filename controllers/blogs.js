const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

// Create a new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  // If title or url is missing, 400 bad request
  if (!body.title || ! body.url) {
    return response.status(400).json({ error: 'missing title/url property' })
  }

  const randomUser = (await User.find({}))[0]

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: randomUser.id
  })
  let savedBlog = await blog.save()
  randomUser.blogs = randomUser.blogs.concat(savedBlog.id)
  await randomUser.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const res = await Blog.findByIdAndUpdate(id, request.body, { new: true })
  response.json(res)
})

module.exports = blogsRouter