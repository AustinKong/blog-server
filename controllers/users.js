const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

// Create new user
userRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  // Validate password length
  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'password must be three characters or above' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await newUser.save()
  response.status(201).json(savedUser)
})

// Get all users
userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.status(201).json(users)
})

module.exports = userRouter