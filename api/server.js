/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */

// require express
const express = require("express")

//require express sessions for keeping users logged in via cookies
const session = require('express-session')

// connect-session-knex --this creates a session
//invokes session
const Store = require('connect-session-knex')(session)

//require dbconfig
const knex = require('../data/db-config')

//get access to the router file
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')

// third party middleware required
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')

// invoke express as a server
const server = express();

//sessionConfig for passing into sessions
const sessionConfig = {
  name: 'chocolatechip', // default name in cookie is sid // this is name cookies uses for session
  secret: 'keep it secret, keep it safe!',
  saveUninitialized: false, // GDPR laws against setting cookies automatically -- change dynamically based on user response
  resave: false,
  Store: new Store({
    knex,
    createtable: true,
    clearInterval: 1000 * 60 * 10,
    tablename: 'sessions',
    sidfieldname: 'sid',
  }),
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 minutes
    secure: false, // should be true in production
    httpOnly: true, // should always be true 
    //sameSite: 'none', //only works over https
  },
}

//use sessions
server.use(session(sessionConfig))

// use the middleware by the server
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(morgan('dev'))


// connect the url and endpoints of the router file to this
// server file
server.use('/api/users', usersRouter) // 1st param = url route, 2nd param = router name that was required above

server.use('/api/auth', authRouter) // 1st param = url route, 2nd param = router name that was required above


// endpoints that fare kind of  a catch all endpoint
server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
