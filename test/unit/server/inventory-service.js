const tape = require('tape')
const { readFileSync } = require('fs')
const items = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const itemService = require('../../../server/game-items/game-item-service')(items)
const { combineItems, addItem, removeItem } = require('../../../server/game-inventory/game-inventory-service')(itemService)

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape(`Inventory service: ${description}`, func)

test('should be able to add an item to the inventory', t => {
  const result = addItem([], 'test-item')

  t.deepEqual(result, ['test-item'])
  t.end()
})

test('should be able to remove an item from the inventory', t => {
  const result = removeItem(['test-item'], 'test-item')

  t.deepEqual(result, [])
  t.end()
})

test('should be able to return an updated inventory when two items are combined', t => {
  const testItem1 = 'test-item'
  const testItem2 = 'test-item-2'
  const result = combineItems([testItem1, testItem2], testItem1, testItem2)

  t.deepEqual(result, ['test-item-3'])
  t.end()
})

test('should return false if items can not be combined', t => {
  const result = combineItems('a', 'b')

  t.equal(result, false)
  t.end()
})
