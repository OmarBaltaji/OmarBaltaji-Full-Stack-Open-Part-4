const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch(error => {
  console.log('Failed to connect to MongoDB')
})

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);

// app.use('/api/blogs',  middleware.userExtractor, blogsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;