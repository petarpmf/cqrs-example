'use strict'

const userService = require('./userService')
const denormalizerService = require('./denormalizerService')

// Test user.
const userId = 1;

console.log('Running...')

userService
  .createUser({ id: userId, name: 'Test Test', state: 'default' })
  .then(() => userService.updateUser({ id: userId, state: 'active' }))
  .then(() => userService.updateUser({ id: userId, name: 'Petar Ristov' }))
  .then(() => {
    // Client "query" denormalizer
    setTimeout(() => {
      console.log('User in user service database', userService.getUserById(userId))
      console.log('User in Reporting Database', denormalizerService.getUserById(userId))

      process.exit()
    }, 1000)
  })
