const {Schema, model} = require("mongoose")

const Coefs = new Schema({
    coef: {type: String}
})

module.exports = model('Coefs', Coefs)