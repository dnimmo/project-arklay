const tape = require('tape')
const { readFileSync } = require('fs')
const items = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const { getItemDetails } = require('../../../server/game-items/game-item-service')(items)

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape.call(null, `Item service: ${description}`, func)

test('should be able to return details for a requested item', t => {
  const testItem = 'test-item'
  const result = getItemDetails(testItem)

  t.equal(result.name, testItem)
  t.end()
})
