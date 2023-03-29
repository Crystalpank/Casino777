const Hash = require("../model/Hash")

class hashController {
    async saveHash(roundHash) {
        try {
            await Hash.deleteMany({})
            const hash = new Hash({ roundHash })
            await hash.save()
        } catch (error) {
            console.log(error)
        }
    }
    async getLastHash() {
        try {
            const hashes = await Hash.find()
            const lastHash = hashes.at(-1)
            return lastHash
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = new hashController()