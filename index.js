const mongoose = require('mongoose')
const express = require('express')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const corsMiddleware = require('./middlewares/cors.middleware')
const PORT = config.get('serverPort')
const todoRouter = require('./routes/todos.routes')

const server = express()
server.use(corsMiddleware)
server.use(express.json())
server.use('/api/auth',authRouter)
server.use('/api/todos',todoRouter)
const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        server.listen(PORT, () => {
            console.log('Server started on port', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()