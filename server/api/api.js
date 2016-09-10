const express = require('express')
const { json, urlencoded } = require('body-parser')

module.exports = (app, mapFile, itemsFile, creditsFile) => {
  // used for parsing message body on 'post'
  app.use(json())
  app.use(urlencoded({ extended: true }))

  const { getRoom } = require('../game-map/game-map-service')(mapFile)

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
  // Requires [arrayOfItems]
  rooms.post('/:slug', (request, response) => response.json(getRoom(request.params.slug, request.body)))

  // Serve requested item details on /items/:item-name
  // Requires { properties: [arrayOfRequestedProperties] }
  items.post('/:itemName', (request, response) => response.json(getItemDetails(request.params.itemName, request.body.properties)))

  // Returns boolean for whether item can be used in current room
  // Requires ?roomSlug
  items.get('/:itemName/can-item-be-used', (request, response) => response.json(canItemBeUsed(request.params.itemName, request.query.roomSlug)))

  // Returns the initial inventory object
  inventory.get('/initialise', (request, response) => response.json(initialiseInventory()))

  // Return an inventory object initialised with data
  // Requires { items: [arrayOfItems], itemsUsed: [arrayOfItems] }
  inventory.post('/initialise', (request, response) =>
    response.json(initialiseInventory(request.body.items, request.body.itemsUsed)))

  // Returns original inventory plus the added item
  // Requires inventory object
  inventory.patch('/add/:itemName', (request, response) => response.json(addItem(request.body, request.params.itemName)))

  inventory.patch('/remove/:itemName', (request, response) => response.json(removeItem(request.body, request.params.itemName)))

  // Returns new inventory if items can be combined
  // Requires inventory object
  inventory.post('/combine/:item1/:item2', (request, response) => response.json(combineItems(request.body, request.params.item1, request.params.item2)))

  // Serve the credits on /credits
  credits.get('/', (request, response) => response.json(creditsFile))
}
