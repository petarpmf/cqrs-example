'use strict'

const Tortoise = require('tortoise')
const _ = require('lodash')

const tortoise = new Tortoise(process.env.RABBITMQ_URI || 'amqp://localhost')
const QUEUE_USER_CREATE = 'user-created'
const QUEUE_USER_EDIT = 'user-edited'

// Simulate DB.
const userDB = {}

function createUser (user) {
  // Create user in service's DB
  userDB[user.id] = user

  // Emit event about create
  // Save records in rabbitMQ, in "user-created" queue.
  return tortoise
    .queue(QUEUE_USER_CREATE)
    .publish({
      id: user.id,
      name: userDB[user.id].name,
      state: userDB[user.id].state
    })
}

function updateUser (user) {
  // Update user in service's DB
  userDB[user.id] = _.merge(userDB[user.id], user)

  // Emit event about update
  // Update records in rabbitMQ, in "user-edited" queue.
  return tortoise
    .queue(QUEUE_USER_EDIT)
    .publish({
      id: user.id,
      name: userDB[user.id].name,
      state: userDB[user.id].state
    })
}
//Get User by ID.
function getUserById (userId) {
  return userDB[userId]
}

module.exports = {
  createUser,
  updateUser,
  getUserById
}
