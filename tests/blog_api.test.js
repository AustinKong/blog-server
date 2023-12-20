const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

describe('GET request obtaining all blogs', () => {
  test('succeeds', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(blogs.length)
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
  test('successfully creates new blog if all properties are valid', async () => {
    const newBlog = {
      title: 'Deleting System 32',
      author: 'An GreeBirds',
      url: 'http://blog.cleancoder.com/deletingSys32.htmll',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length + 1)
    expect(response.body.map(r => r.title)).toContain(
      'Deleting System 32'
    )
  })

  test('defaults like property to 0 if missing', async () => {
    const newBlog = {
      title: 'Deleting System 32',
      author: 'An GreeBirds',
      url: 'http://blog.cleancoder.com/deletingSys32.htmll'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')
    expect(response.body.find(blog => blog.title === 'Deleting System 32').likes)
      .toBeDefined()
  })

  test('returns 400 bad request, if title property is missing', async () => {
    const newBlog = {
      author: 'An GreeBirds',
      url: 'http://blog.cleancoder.com/deletingSys32.htmll'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('returns 400 bad request, if url property is missing', async () => {
    const newBlog = {
      title: 'Deleting System 32',
      author: 'An GreeBirds',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE request deleting a blog', () => {
  test('deletes the blog', async () => {
    // To access id
    const blogId = (await api.get('/api/blogs'))
      .body.find(blog => blog.title === 'React patterns').id

    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(204)
  })

  test('blog is deleted', async () => {
    // To access id
    const blogId = (await api.get('/api/blogs'))
      .body.find(blog => blog.title === 'React patterns').id

    await api.delete(`/api/blogs/${blogId}`)

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map(r => r.title)

    expect(blogTitles).not.toContain(
      'React patterns'
    )
    expect(blogTitles).toHaveLength(blogs.length - 1)
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
beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of blogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})