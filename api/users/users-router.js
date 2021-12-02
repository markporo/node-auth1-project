// require express
const express = require('express')

// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const { checkPasswordLength, checkUsernameExists, checkUsernameFree, restricted } = require('../auth/auth-middleware')

// access the model functions
const usersModel = require('./users-model')

//invoke the router method from the express library
const router = express.Router()

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */
router.get('/', (req, res) => {
  usersModel.find()
    .then(users => {
      //if(RESTRICTED -not a client) {res.status(401).json("message": "You shall not pass!")} else {
      res.status(201).json(users)
    })
    .catch(() => {
      res.status(500).json({ message: "Users could not be retrieved by Database." })
    })
})



// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router