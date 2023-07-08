const jwt = require('jsonwebtoken');
const User = require('../models/user');
const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ error: 'This username does not exist' });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({ error: 'Wrong credentials' });
  }

  const userForToken = {
    id: user._id,
    username: user.username
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60*24 }
  );

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;