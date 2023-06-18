const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const newBlog = await blog.save()
  response.status(201).json(newBlog)
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