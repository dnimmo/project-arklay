const express = require('express')

module.exports = (app, mapFile, creditsFile) => {
  const { getRoom } = require('../game-map/service')(mapFile)
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
