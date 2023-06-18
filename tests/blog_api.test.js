const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('../utils/test_helper.js');
const timeout = 100000;

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogs = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogs.map(blog => blog.save());
  await Promise.all(promiseArray);
})

test('notes are returned in json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(response.body).toHaveLength(2);
}, timeout);

test('unique identifier be id', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
}, timeout);

test('a valid blog can be added', async () => {
  const blog =   {
    title: 'blog 3',
    author: 'Mohamad Merhi',
    url: 'https://blog.com/blog3',
    likes: 10
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  
  const blogs = await helper.blogsInDB();
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const contents = blogs.map(blog => blog.title);
  expect(contents).toContain('blog 3');
});

test('likes missing defaults to 0', async () => {
  const blog =   {
    title: 'blog 4',
    author: 'Moustafa Amar',
    url: 'https://blog.com/blog4',
  };

  const response = await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  
  expect(response.body.likes).toBe(0);
});

test('blog with missing properties not added', async () => {
  const blog = {
    author: 'Amer Masr'
  };

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(400);

  const blogs = await helper.blogsInDB();
  expect(blogs).toHaveLength(helper.initialBlogs.length);
}, timeout)