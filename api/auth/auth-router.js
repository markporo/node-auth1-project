const express = require('express')

//require bcrypt library
const bcrypt = require('bcryptjs')

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const { checkPasswordLength, checkUsernameExists, checkUsernameFree } = require('./auth-middleware')


// access the model functions
const usersModel = require('../users/users-model')

//invoke the router method from the express library
const router = express.Router()

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


// add/ register user 
router.post('/register', checkUsernameExists, checkUsernameFree, checkPasswordLength, (req, res) => {

  // hash password!
  const hash = bcrypt.hashSync(req.body.password, 14)
  //assign hash of password to the user's password
  req.body.password = hash;

  usersModel.add(req.body)
    .then(newUser => {
      res.status(200).json(newUser)
    })
    .catch(() => {
      res.status(500).json({ message: "The User could not be added to the DB." })
    })
})


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', (req, res) => {
  let { username, password } = req.body;

  usersModel.findBy({ username })
    .first()
    .then(user => {
      // check that passwords match
      if (user && bcrypt.compareSync(password, user.password)) {

        req.session.user = user;

        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        // we will return 401 if the password or username are invalid
        // we don't want to let attackers know when they have a good username
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router