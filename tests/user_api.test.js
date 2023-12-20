const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')

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

describe('POST request creating a new user', () => {
  const userDetails = {
    name: 'John Doe',
    username: 'Johnny Dove',
    password: 'jdlgh312'
  }

  test('succeeds when valid details are provided', async () => {
    const newUser = { ...userDetails }
    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(res.body.id).toBeDefined()
    expect(res.body._id).not.toBeDefined()

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(users.length + 1)
    expect(response.body.map(user => user.name)).toContain(userDetails.name)
  })

  test('fails when no username provided', async () => {
    const newUser =  { ...userDetails }
    delete newUser.username
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails when username too short', async () => {
    const newUser =  { ...userDetails, username: 'Jo' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails when no password provided', async () => {
    const newUser =  { ...userDetails }
    delete newUser.password
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails when password too short', async () => {
    const newUser =  { ...userDetails, password: 'Jd' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

// Reset before each test
beforeEach(async () => {
  await User.deleteMany({})
  for (let user of users) {
    let userObject = new User(user)
    await userObject.save()
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})