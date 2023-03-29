const {Schema, model} = require("mongoose")

const User = new Schema({
    email: {type: String, unique: true, required: true},
    userName: {type: String, required: true},
    password: {type: String, required: true},
    money: {type: Number, default: 10}
})

module.exports = model('User', User)