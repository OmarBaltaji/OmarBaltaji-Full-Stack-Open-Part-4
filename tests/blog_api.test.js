const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper.js');
const timeout = 100000;

beforeEach(async () => {
  await Blog.deleteMany({});

  const users = await helper.usersInDB();
  const blogs = helper.initialBlogs.map(blog => new Blog({...blog, user: users[0].id}));
  const promiseArray = blogs.map(blog => blog.save());
  await Promise.all(promiseArray);
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned in json and correct amount', async () => {
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
})

describe('adding a blog', () => {
  test('a valid blog can be added', async () => {
    const blog =   {
      title: 'blog 3',
      author: 'Mohamad Merhi',
      url: 'https://blog.com/blog3',
      likes: 10
    };

    const userCredentials = {
      username: 'root',
      password: 'password'
    };
    const tokenResponse = await api
    .post('/api/login')
    .send(userCredentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);
    const token = tokenResponse.body.token;
  
    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
  
    const titles = blogs.map(blog => blog.title);
    expect(titles).toContain('blog 3');
  });
  
  test('likes missing defaults to 0', async () => {
    const blog =   {
      title: 'blog 4',
      author: 'Moustafa Amar',
      url: 'https://blog.com/blog4',
    };
  
    const userCredentials = {
      username: 'root',
      password: 'password'
    };
  
    const tokenResponse = await api
    .post('/api/login')
    .send(userCredentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);
    const token = tokenResponse.body.token;

    const response = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    expect(response.body.likes).toBe(0);
  });
  
  test('blog with missing properties not added', async () => {
    const blog = {
      author: 'Amer Masr'
    };

    const userCredentials = {
      username: 'root',
      password: 'password'
    };
    const tokenResponse = await api
    .post('/api/login')
    .send(userCredentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);
    const token = tokenResponse.body.token;

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(400);
  
    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  }, timeout)

  test('adding a blog fails if a token is not provided', async () => {
    const blog =   {
      title: 'blog 3',
      author: 'Mohamad Merhi',
      url: 'https://blog.com/blog3',
      likes: 10
    };

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401);
    
    const blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length);
  }) 
})

describe('deletion of blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    let blogs = await helper.blogsInDB();
    const firstBlog = blogs[0];

    const userCredentials = {
      username: 'root',
      password: 'password'
    };
    const tokenResponse = await api
    .post('/api/login')
    .send(userCredentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);
    const token = tokenResponse.body.token;

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
    
    blogs = await helper.blogsInDB();
    expect(blogs).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogs.map(blog => blog.title);
    expect(titles).not.toContain(firstBlog.title);
  })
})

describe('updating a blog', () => {
  test('succeeds with updating a blog if id and body are valid', async () => {
    const blogs = await helper.blogsInDB();
    const firstBlog = blogs[0];
    const modifiedProperties = {
      url: 'https://newblogsite/modifiedblog'
    };

    const response = await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(modifiedProperties)
      .expect(200);

    const updatedBlog = {
      ...response.body,
      ...modifiedProperties,
    }
    
    expect(response.body).toEqual(updatedBlog);
  })
})

afterAll(async() => {
  await mongoose.connection.close()
})