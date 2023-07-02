const User = require('../models/user');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const helpers = require('../utils/test_helper.js');
const mongoose = require('mongoose');

beforeEach(async () => {
  await User.deleteMany({});

  const rootUser = new User({
    username: 'root',
    name: 'root',
    password: await bcrypt.hash('password', 10)
  });

  await rootUser.save();
})

describe('When only one user in database', () => {
  test('success when adding a new user', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: 'omar',
      name: 'omar',
      password: await bcrypt.hash('password', 10)
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helpers.usersInDB();
    
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usersNames = usersAtEnd.map(user => user.username);
    expect(usersNames).toContain(newUser.username);
  })

  test('fails when adding user with an existing username', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: 'root',
      name: 'root',
      password: await bcrypt.hash('password', 10)
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helpers.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  })

  test('fails when password is less than 3 characters', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: 'omar2',
      name: 'omar2',
      password: '12'
    };

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('Password must be more than 3 character');

    const usersAtEnd = await helpers.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  })

  test('fails when username or password is not provided', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      name: 'omar3',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('Please provide the ');

    const usersAtEnd =  await helpers.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  })
})

afterAll(async () => {
  await mongoose.connection.close()
});