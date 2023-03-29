const {Schema, model} = require("mongoose")

const Hash = new Schema({
    roundHash: {type: String}
})

module.exports = model('Hash', Hash)