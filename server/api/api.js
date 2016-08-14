const express = require('express')

module.exports = (app, mapFile, itemsFile, creditsFile, logLocation, logFileName) => {
  const { getRoom } = require('../game-map/game-map-service')(mapFile, logLocation, logFileName)
  const { combineItems } = require('../game-items/game-item-service')(itemsFile)

  const rooms = express()
  const items = express()
  const credits = express()

  // Mount the sub apps
  app.use('/rooms', rooms)
  app.use('/items', items)
  app.use('/credits', credits)

  // Serve requested room on /rooms/requested-room-slug
  rooms.get('/:slug', (request, response) => response.json(getRoom(request.params.slug)))

  // Serve the credits on /credits
  credits.get('/', (request, response) => response.json(creditsFile))
}
