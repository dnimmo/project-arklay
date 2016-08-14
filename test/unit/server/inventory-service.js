const tape = require('tape')
const { readFileSync } = require('fs')
const items = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const itemService = require('../../../server/game-items/game-item-service')(items)
const { combineItems } = require('../../../server/game-inventory/game-inventory-service')(itemService)

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape.call(null, `Inventory service: ${description}`, func)

test('is able to return an updated inventory when two items are combined', t => {
  const testItem1 = 'test-item'
  const testItem2 = 'test-item-2'
  const result = combineItems([testItem1, testItem2], testItem1, testItem2)

  t.deepEqual(result, ['test-item-3'])
  t.end()
})

test('will return false if items can not be combined', t => {
  const result = combineItems('a', 'b')

  t.equal(result, false)
  t.end()
})
