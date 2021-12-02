const db = require('../../data/db-config')

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  console.log('youve found bob');
  return db('users as us')
    .select('us.user_id', 'us.username')
    .orderBy('us.user_id', 'asc')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {

}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {

}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = { find, findById, findBy, add }