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
const passport = require('passport')
const cookieSession = require('cookie-session')
const googleAuth = require('./googleAuth/googleAuth')
const bodyParser = require('body-parser')

server.use(cookieSession({
    name: 'eventmaker',
    keys: ['event', 'maker'],
    maxAge: 24 * 60 * 60 * 1000
}))
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(passport.initialize())
server.use(passport.session())
server.use(corsMiddleware)


server.use('/api/auth', authRouter)
server.use('/api/events', eventRouter)
server.use('/api/types', typeRouter)
server.use('/api/cities', cityRouter)
server.use('/api/info', userInfoRouter)
server.use('/google', googleAuth)

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify:false
        })

        server.listen(PORT, () => {
            console.log('Server started on port', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

start()