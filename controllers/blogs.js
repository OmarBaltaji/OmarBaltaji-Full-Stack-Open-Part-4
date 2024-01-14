const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
})

blogsRouter.post('/', userExtractor,  async (request, response) => {
  const { title, author, url, likes } = request.body;

  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  });

  const newBlog = await blog.save();
  await newBlog.populate('user');
  
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();

  response.status(201).json(newBlog);
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);

  const user = request.user;

  if(!user || blog.user.toString() !== user._id.toString()) {
    return response.status(400).json({ error: "Operation not permitted. Cannot delete blogs that aren't yours" });
  }
  
  user.blogs = user.blogs.filter(userBlog => userBlog.toString() !== blog._id.toString());
  await user.save();
  await blog.remove();
  return response.status(204).end();
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { title, url, author, likes, user } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(id, { title, url, author, likes, user }, {new: true}).populate('user', { username: 1, name: 1 });

  response.json(updatedBlog);
})

module.exports = blogsRouter;