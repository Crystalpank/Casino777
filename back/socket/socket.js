
module.exports = async function (server) {
    const hashController = require("../controller/hashController")
    const userController = require("../controller/userController")
    const config = require("config")
    let objLastHash = await hashController.getLastHash()
    let lastHash = config.get("firstRoundHash")

    if (objLastHash !== undefined) {
        lastHash = objLastHash.roundHash
    }

    let Cycle = require("./Cycle")
    let cycle = new Cycle(10, lastHash)


    let io = require('socket.io')(server, {
        cors: {
            origin: '*'
        }
        // origins: ["http://localhost:8080"],
        // handlePreflightRequest: (req, res) => {
        //     res.writeHead(200, {
        //       "Access-Control-Allow-Origin": "http://localhost:8080",
        //       "Access-Control-Allow-Methods": "GET,POST",
        //       "Access-Control-Allow-Headers": "abcd",
        //       "Access-Control-Allow-Credentials": true
        //     });
        //     res.end();
        //   }
    })


    let clients = []
    let betsUsers = []

    cycle.startCycle()


    io.on("connection", (socket) => {
        //console.log(`Client with id ${socket.id} connected`)
        clients.push(socket.id)


        socket.on("getData", (data) => {
            socket.emit("ratio", {
                status: cycle.getStatus(),
                ratio: cycle.getSumRatio(),
                timer: cycle.getLeftSeconds()
            })
        })
        socket.on("getCoef", (data) => {
            betsUsers.length = 0
            socket.emit("lastCoef", {
                lastCoef: cycle.getStatus() ? "" : cycle.getLastCoef(),
            })

        })

        socket.on("setBet", async (data) => {
            if (userController.checkMoney(data.userId, data.bet)) {
                await userController.updateMoney(data.userId, -data.bet)
                betsUsers.push(data)
                //console.log(data)
                // io.emit("userBet", data)
                io.emit("usersBets", betsUsers)
            }
        })

        socket.on("getUsersBets", (data) => {
            socket.emit("usersBets", betsUsers)
        })
        socket.on("withdraw", async (data) => {
            const myTotalBets = betsUsers.filter(userBetInfo => data.userId == userBetInfo.userId).reduce((acc, bet) => acc + bet.bet, 0)
            betsUsers = betsUsers.filter(userBetInfo => data.userId !== userBetInfo.userId)
            //console.log("myTotalBets", myTotalBets)
            const win = Number((myTotalBets * data.coef).toFixed(2))
            await userController.updateMoney(data.userId, win)
            socket.emit("getReward", win)
            io.emit("usersBets", betsUsers)
        })

        socket.on('disconnect', () => {
            clients.splice(clients.indexOf(socket.id), 1)
            //console.log(`Client with id ${socket.id} disconnected`)
        })
    })
    return io
}