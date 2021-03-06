const tape = require('tape')
const { readFileSync } = require('fs')
const items = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const { getItemDetails, canItemBeUsed } = require('../../../server/game-items/game-item-service')(items)

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape(`Item service: ${description}`, func)

test('should be able to return details for a requested item', t => {
  const testItem = 'test-item'
  const { name } = getItemDetails(testItem, ['name'])

  t.equal(name, testItem)
  t.end()
})

test('can tell if an item can be used in a given room', t => {
  const itemName = 'test-item'
  const roomSlug = 'test-room'
  const result = canItemBeUsed(itemName, roomSlug)

  t.equal(result, true)
  t.end()
})
