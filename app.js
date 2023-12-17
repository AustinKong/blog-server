const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.json())

const url = config.MONGODB_URI
logger.info('Connecting to MongoDB ...')
mongoose
  .connect(url)
  .then(() => logger.info('Successfully connected to MongoDB'))
  .catch(() => logger.error('Error connecting to MongoDB'))

app.use('/api/blogs', blogsRouter)

module.exports = app