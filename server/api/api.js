const express = require('express')

module.exports = (app, mapFile, creditsFile, logLocation, logFileName) => {
  const { getRoom } = require('../game-map/game-map-service')(mapFile, logLocation, logFileName)
  const rooms = express()
  const credits = express()

  // Mount the sub apps
  app.use('/rooms', rooms)
  app.use('/credits', credits)

  // Serve requested room on /rooms/requested-room-slug
  rooms.get('/:slug', (request, response) => response.json(getRoom(request.params.slug)))

  // Serve the credits on /credits
  credits.get('/', (request, response) => response.json(creditsFile))
}
