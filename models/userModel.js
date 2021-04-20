const {Schema, model} = require('mongoose')

const User = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String},
    username: {type: String, required: true, unique: true},
    phone: {type: String},
    googleId: {type: String},
    name: {type: String},
    site: {type: String}
})

module.exports = model('users', User)