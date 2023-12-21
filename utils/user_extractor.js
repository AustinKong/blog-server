const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  const user = await User.findById(decodedToken.id)
  if (!user || !user.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  request.user = user
  next()
}

module.exports = userExtractor