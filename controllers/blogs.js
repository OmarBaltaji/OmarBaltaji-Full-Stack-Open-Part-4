const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
})

blogsRouter.post('/', middleware.userExtractor,  async (request, response) => {
  const { title, author, url, likes } = request.body;
  const token = jwt.verify(request.token, process.env.SECRET);

  if (!token.id) {
    return response.status(401).json({ error: 'Unauthenticated' });
  }

  const user = request.user;

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id;
  const token =  jwt.verify(request.token, process.env.SECRET);

  if (!token.id) {
    return response.status(401).json({ error: 'Unauthenticated' });
  }

  const user = request.user;

  const blog = await Blog.findById(id);

  if(blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(id);
    return response.status(204).end();
  }

  return response.status(400).json({ error: "Cannot delete blogs that aren't yours" });
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