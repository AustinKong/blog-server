const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const res = await Blog.find({})
  response.json(res)
})

blogsRouter.get('/:id', async (request, response) => {
  const res = await Blog.findById(request.params.id)
  response.json(res)
})

blogsRouter.post('/', async (request, response) => {
  // If likes is missing, default to 0
  if (!request.body.likes) {
    request.body.likes = 0
  }
  // If title or url is missing, 400 bad request
  if (!request.body.title || ! request.body.url) {
    return response.status(400).json({ error: 'missing title/url property' })
  }

  const blog = new Blog(request.body)
  const res = await blog.save()
  response.status(201).json(res)
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