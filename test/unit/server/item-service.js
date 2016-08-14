const tape = require('tape')
const { readFileSync } = require('fs')
const items = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const { combineItems } = require('../../../server/game-items/game-item-service')(items)

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape.call(null, `Item service: ${description}`, func)

test('is able to return a new item when two items are combined', t => {
  const testItem1 = 'test-item'
  const testItem2 = 'test-item-2'
  const result = combineItems(testItem1, testItem2)

  t.equal(result, 'test-item-3')
  t.end()
})
