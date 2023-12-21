const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const mongoose = require('mongoose')

const api = supertest(app)

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
    expect(response.body).toHaveLength(4)
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
beforeEach(async () => helper.resetAll())

afterAll(async () => {
  await mongoose.connection.close()
})