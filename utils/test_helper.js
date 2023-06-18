const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'blog 1',
    author: 'Omar Baltaji',
    url: 'https://blog.com/blog1',
    likes: 5
  },
  {
    title: 'blog 2',
    author: 'Ahmad Sarhan',
    url: 'https://blog.com/blog2',
    likes: 4
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

module.exports = {
  initialBlogs,
  blogsInDB
}