const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const socket = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const validator = require('express-validator')
const app = express()
const server = require('http').Server(app)
const io = socket(server)
const session = require('express-session')

const port = process.env.PORT || 3333
const route = require('./app/routes')

app.use(cors({origin: JSON.parse(process.env.CORS_ALLOWED || '["http://192.168.1.69:8080", "http://localhost:8080", "https://3340-147-30-52-154.ngrok-free.app", "164.92.206.196:8080"]'), credentials: true}))
app.use(session({
  secret: 'crest-online',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use((req,res,next) => {
  req.io = io
  next()
})
app.use(bodyParser.json())
app.use(validator())
app.use(route)

require('./app/socket')(io);

server.listen(port, () => {
  console.log('Listening on '+port)
})
