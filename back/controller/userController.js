const User = require("../model/User")

class userController {
    async getMoney(req, res) {
        try {
            const { userId } = req.query
            const user = await User.findById(userId)
            //console.log(user)
            return res.json({ userMoney: user.money })
        } catch (e) {
            console.log(e)
        }

    }

    async checkMoney(userId, bet) {
        try {
            const user = await User.findById(userId)
            return user.money >= bet
        } catch (e) {
            console.log(e)
        }
    }

    async updateMoney(userId, updateValueMoney) {
        try {
            const user = await User.findById(userId)
            const newValueMoney = Number(user.money + Number(updateValueMoney)).toFixed(2)
            await User.findByIdAndUpdate(userId, {money: newValueMoney})
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new userController()