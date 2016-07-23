const express = require('express')
const compression = require('compression')
const app = express()

//  GZIP assets
app.use(compression())

// Load services
const API = require('./api/api')(app)

// Serve files
const server = require('http').createServer(app)
const port = 8080

app.use(express.static(__dirname + '/build'))

server.listen(port, () => {
  console.log('Server listening at port %d', port)
  console.log('ctrl+c to stop server')
})
