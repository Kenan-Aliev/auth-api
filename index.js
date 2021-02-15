const mongoose = require('mongoose')
const express = require('express')
const server = express()
const config = require('config')
const authRouter = require('./routes/auth.routes')
const corsMiddleware = require('./middlewares/cors.middleware')
const PORT = config.get('serverPort')
const eventRouter = require('./routes/events.routes')
const typeRouter = require('./routes/type.routes')
const cityRouter = require("./routes/city.routes")
const userInfoRouter = require('./info/userInfo')


server.use(corsMiddleware)
server.use(express.json())
server.use('/api/auth', authRouter)
server.use('/api/events', eventRouter)
server.use('/api/types', typeRouter)
server.use('/api/cities', cityRouter)
server.use('/api/info', userInfoRouter)

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        server.listen(PORT, () => {
            console.log('Server started on port', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()