const express = require("express")
const app = express()
const mongoose = require("mongoose")
const sockServer = require("http").createServer(app)
const authRoute = require("./routes/authRouter")
const coefRoute = require("./routes/coefRouter")
const userRoute = require("./routes/userRouter")
const config = require("config")
const PORT = config.get("PORT")
const PORT_SOCK = config.get("PORT_SOCK")
let initSocket = require("./socket/socket")


app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/casino", coefRoute)
app.use("/api/user", userRoute)
initSocket(sockServer)



const start = async() => {
    try{
        await mongoose.connect(config.get("dbURL"))
        app.listen(PORT, () => console.log(`API Server starting at port ${PORT}`))
        sockServer.listen(PORT_SOCK, () => {
            console.log(`Socket server starting at port ${PORT_SOCK}`)
        })
    }catch(e){
        console.log(e)
    }
}

start()