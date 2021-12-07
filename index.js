const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')
const cookieParser = require('cookie-parser')
const apiRouter = require('./routes/API.routes')
const rootRouter = require('./routes/root.routes')
const cors = require('cors')
const { PORT, NODE_ENV } = require('./config/index')
require('./db')

// Live reload
const livereload = require('livereload')

const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'views'))

const connectLivereload = require('connect-livereload')
app.use(connectLivereload())
// Serve middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
// Routes
app.use('/', rootRouter)
app.use('/api', cors(), apiRouter)
// Set view engine
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('express-es6-template-engine'))
app.set('view engine', 'html')

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT} in ${NODE_ENV}`)
})

module.exports = server
