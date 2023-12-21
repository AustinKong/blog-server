const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('GET request obtaining all blogs', () => {
  test('succeeds', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(6)
  })

  test('identifier is named id instead of _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })
})

describe('POST request creating a new blog', () => {
  const blog = {
    title: 'Deleting System 32',
    url: 'http://blog.cleancoder.com/deletingSys32.htmll',
    likes: 12,
  }

  test('successfully creates new blog if all properties are valid', async () => {
    const newBlog = { ...blog }
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(7)
    expect(response.body.map(r => r.title)).toContain(
      'Deleting System 32'
    )
  })

  test('defaults like property to 0 if missing', async () => {
    const newBlog = { ...blog }
    delete newBlog.likes
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const response = await api.get('/api/blogs')
    expect(response.body.find(blog => blog.title === 'Deleting System 32').likes)
      .toBeDefined()
  })

  test('returns 400 bad request, if title property is missing', async () => {
    const newBlog = { ...blog }
    delete newBlog.title
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('returns 400 bad request, if url property is missing', async () => {
    const newBlog = { ...blog }
    delete newBlog.url
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE request deleting a blog', () => {
  test('deletes the blog', async () => {
    const token = await helper.getToken()
    // To access id
    const blogId = (await api.get('/api/blogs'))
      .body.find(blog => blog.title === 'React patterns').id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('blog is deleted', async () => {
    const token = await helper.getToken()
    // To access id
    const blogId = (await api.get('/api/blogs'))
      .body.find(blog => blog.title === 'React patterns').id

    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(r => r.title)

    expect(blogTitles).not.toContain(
      'React patterns'
    )
    expect(blogTitles).toHaveLength(5)
  })
})

describe('PUT request updating blog', () => {
  const updatedBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 128,
  }

  test('returns updated information', async () => {
    // To access id
    const blogId = (await api.get('/api/blogs'))
      .body.find(blog => blog.title === 'React patterns').id

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
    expect(response.body.likes).toBe(128)
  })

  test('information is reflected in database', async () => {
    // To access id
    const blogId = (await api.get('/api/blogs'))
      .body.find(blog => blog.title === 'React patterns').id

    const response = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
    expect(response.body.likes).toBe(128)

    const newResponse = await api.get(`/api/blogs/${blogId}`)
    expect(newResponse.body.likes).toBe(128)
  })
})

// Reset before each test
beforeEach(async () => helper.resetAll())

afterAll(async () => {
  await mongoose.connection.close()
})