const User = require('../models/user')

const users = [
  {
    name: 'Abu Bakar',
    username: 'AbuB',
    password: 'ABBasdf'
  },
  {
    name: 'Clark Kent',
    username: 'ClaKent',
    password: '12345'
  },
  {
    name: 'Peter Parker',
    username: 'PPark',
    password: 'Peter pakk'
  }
]

const reset = async () => {
  await User.deleteMany({})
  for (let user of users) {
    let userObject = new User(user)
    await userObject.save()
  }
}

module.exports = reset