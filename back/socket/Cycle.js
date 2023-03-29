const CryptoJS = require("crypto-js")
const hashController = require("../controller/hashController")
const coefsController = require("../controller/coefsController")
const config = require("config")

class Cycle {
    timer = 0
    interval = 0
    t = 0
    sum = 1
    status = false
    counter = 0
    gameSeed = config.get("gameSeed")
    randomCoef = 1

    constructor(countdown, lastRoundHash) {
        this.countdown = countdown
        this.lastRoundHash = lastRoundHash
    }

    startRatio(coef) {
        this.t = 0
        this.interval = setInterval(() => {
            this.t += 0.002
            // this.sum += this.t * this.t * this.t
            this.sum += this.t === 0 ? 0 : Math.pow(2, 10 * this.t - 10)

            if (this.sum >= coef) {
                this.stopRatio()
                this.startCycle()
            }
        }, 100)
        return this.interval
    }

    stopRatio() {
        coefsController.saveCoef(this.randomCoef)
        clearInterval(this.interval)
        this.status = false
    }

    getSumRatio() {
        return this.sum.toFixed(2)
    }
    getStatus() {
        return this.status
    }
    getLastCoef() {
        return this.randomCoef
    }
    startCycle() {
        this.counter = this.countdown
        this.sum = 1
        this.timer = setInterval(() => {
            if (this.counter == 0) {
                this.stopTimer()
                this.lastRoundHash = this.sha256(this.lastRoundHash, true)
                hashController.saveHash(this.lastRoundHash)
                this.randomCoef = this.calculateGameResult(this.lastRoundHash, this.gameSeed)
                this.startRatio(this.randomCoef)
                //console.log(this.randomCoef)
            } else {
                --this.counter
            }
            // this.count == 0 ? this.stop() : this.count -= 1
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.timer)
        this.status = true
    }

    getLeftSeconds() {
        return this.counter
    }

    sha256(key, asString) {
        return asString ? CryptoJS.SHA256(key).toString() : CryptoJS.SHA256(key);
    }

    saltHash(hash, salt) {
        return CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, hash)
            .update(salt)
            .finalize()
            .toString(CryptoJS.enc.Hex);
    }

    calculateGameResult(gameHash, publicKey) {
        const bytes = 13;
        const nBits = bytes * 4;

        let hash = this.saltHash(gameHash, publicKey);

        var slice = hash.slice(0, bytes);
        var e = parseInt(slice, 16);
        var h = Math.pow(2, nBits);

        let X = e / h;

        X = 94 / (1 - X);

        return Math.max(1, Math.floor(X) / 100);
    }
}
module.exports = Cycle
