const User = require('../models/user');
const userRouter = require('express').Router();
const bcrypt = require('bcrypt');

userRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users); 
})

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'Please provide the password' });
  }

  if (!username) {
    return res.status(400).json({ error: 'Please provide the username' });
  }

  if (password.length < 3) {
    return res.status(400).json({ error: "Password must be more than 3 character" });
  }

  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    password: hashPassword
  });

  const savedUser = await newUser.save();

  res.status(201).json(savedUser);
});

module.exports = userRouter;