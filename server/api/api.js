const express = require('express')
const { json, urlencoded } = require('body-parser')

module.exports = (app, mapFile, itemsFile, creditsFile, logLocation, logFileName) => {
  // used for parsing message body on 'post'
  app.use(json())
  app.use(urlencoded({ extended: true }))

  const { getRoom } = require('../game-map/game-map-service')(mapFile, logLocation, logFileName)

  const {
    getItemDetails,
    canItemBeUsed
  } = require('../game-items/game-item-service')(itemsFile)

  const {
    initialiseInventory,
    combineItems,
    addItem,
    removeItem
  } = require('../game-inventory/game-inventory-service')(require('../game-items/game-item-service')(itemsFile))

  const rooms = express()
  const items = express()
  const inventory = express()
  const credits = express()

  // Mount the sub apps
  app.use('/rooms', rooms)
  app.use('/items', items)
  app.use('/inventory', inventory)
  app.use('/credits', credits)

  // Serve requested room on /rooms/:requested-room-slug
  rooms.get('/:slug', (request, response) => response.json(getRoom(request.params.slug)))

  // Serve requested item details on /items/:item-name
  items.post('/:itemName', (request, response) =>  response.json(getItemDetails(request.params.itemName, request.body.properties)))

  // Serve the credits on /credits
  credits.get('/', (request, response) => response.json(creditsFile))
}
