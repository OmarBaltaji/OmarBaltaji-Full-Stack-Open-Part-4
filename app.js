const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('Failed to connect to MongoDB')
})

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app