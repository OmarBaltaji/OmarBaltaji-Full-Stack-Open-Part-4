const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const token = jwt.verify(request.token, process.env.SECRET);

  if (!token.id) {
    return response.status(401).json({ error: 'Unauthenticated' });
  }

  const user = await User.findById(token.id);

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user._id
  });

  const newBlog = await blog.save();
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();

  response.status(201).json(newBlog);
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const blog = await Blog.findById(id);

  const modifiedBlog = {
    title: body.title ?? blog.title,
    url: body.url ?? blog.url,
    author: body.author ?? blog.author,
    likes: body.likes ?? blog.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, modifiedBlog, {new: true});

  response.json(updatedBlog);
})

module.exports = blogsRouter;