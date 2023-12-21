const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
// const mongoose = require('mongoose')

const api = supertest(app)

const users = [
  {
    name: 'Abu Bakar',
    username: 'AbuB',
    password: 'ABBasdf'
  },
  {
    name: 'Clark Kent',
    username: 'ClaKent',
    password: '12345'
  },
  {
    name: 'Peter Parker',
    username: 'PPark',
    password: 'Peter pakk'
  }
]

const blogs = [
  {
    title: 'React patterns',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

// Resets database: Creates 3 users, and creates 2 blogs for each user
const resetAll = async () => {
  // Nukes everything
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Creates some users
  for (let user of users) {
    await api.post('/api/users').send(user)
  }

  let blogIndex = 0
  // Logins for each user and creates two blog each
  for (let user of users) {
    // Logins and caches token
    const token = (await api.post('/api/login').send({
      username: user.username,
      password: user.password
    })).body.token
    // Runs twice
    for (let i = 0; i < 2; i++) {
      // Creates one blog post
      await api.post('/api/blogs').set(
        'Authorization', `Bearer ${token}`
      ).send(
        blogs[blogIndex]
      )
      blogIndex++
    }
  }
}

// Logins with user 'Abu Bakar' and returns a token
const getToken = async () => {
  const token = (await api.post('/api/login').send({
    username: users[0].username,
    password: users[0].password
  })).body.token
  return token
}

/*
describe('everything reset', () => {
  test('users reset', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(users.length)
  })
  test('blogs created', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
  })
})
*/

module.exports = { resetAll, getToken }