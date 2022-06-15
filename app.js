require('dotenv').config()
require('express-async-errors')

const express = require('express')
const server = express()
const connectDB = require('./db/connect')
const port = process.env.PORT || 3700
const errorhandlermiddleware = require('./middlewares/errorhandler')
const notfoundMiddleware = require('./middlewares/notfound')
const exphbs = require('express-handlebars')
const path = require('path')
const authMiddleware = require('./middlewares/authenticated')

// Routes //
const htmlRouter = require('./routes/htmlpages')
const authRouter = require('./routes/auth')

//templating engine // 
server.engine("handlebars", exphbs.engine({extname: ".handlebars", defaultLayout: false}));
server.set('view engine', 'handlebars')

//allows us to access the public folder for js and css
server.use('/public', express.static(path.join(__dirname, 'public')))

// parse user imput in json format
server.use(express.json())
server.use(express.urlencoded({extended: false}))

//route functions
server.use('/', authRouter)
server.use('/', authMiddleware , htmlRouter)

//error handlers
server.use(errorhandlermiddleware)
server.use(notfoundMiddleware)

//function to check database connection and start server


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()