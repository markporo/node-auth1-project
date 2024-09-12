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
router.get('/', restricted, (req, res) => {
  usersModel.find()
    .then(users => {
      //if(RESTRICTED -not a client) {res.status(401).json("message": "You shall not pass!")} else {
      res.status(200).json(users)
    })
    .catch(() => {
      res.status(500).json({ message: "Users could not be retrieved by Database." })
    })
})


// get  user by id route
router.get('/:id', (req, res) => {
  usersModel.findById(req.params.id)
    .then(user => {
      console.log(user, "from get by id route")
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: `user with id ${req.params.id} is not found` })
      }
    })
    .catch(() => {
      res.status(500).json({ message: "The User with that Id could not be found." })
    })
})

// add user  ---change route to /api/auth/register
router.post('/', checkUsernameExists, checkUsernameFree, checkPasswordLength, (req, res) => {

  usersModel.add(req.body)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(() => {
      res.status(500).json({ message: "The User could not be added to the DB." })
    })
})



// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router