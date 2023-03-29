const Coefs = require("../model/Coefs")

class coefsController {
    async saveCoef(coef) {
        try {
            const newCoef = new Coefs({ coef })
            await newCoef.save()
        } catch (e) {
            console.log(e)
        }
    }
    async getCoefs(req, res) {
        try {
            
            const coefs = await Coefs.find().sort({ $natural: -1 }).limit(10)
            return res.json({ previousCoefs: coefs })
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new coefsController()