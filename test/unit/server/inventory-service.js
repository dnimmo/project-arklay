const tape = require('tape')
const { readFileSync } = require('fs')
const items = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const itemService = require('../../../server/game-items/game-item-service')(items)
const {
  initialiseInventory,
  combineItems,
  addItem,
  removeItem } = require('../../../server/game-inventory/game-inventory-service')(itemService)

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape(`Inventory service: ${description}`, func)

test('should be able to initialise empty inventory', t => {
  const { items } = initialiseInventory()
  t.deepEqual(items, [])
  t.end()
})

test('should be able to initialise empty array of used items', t => {
  const { itemsUsed } = initialiseInventory()
  t.deepEqual(itemsUsed, [])
  t.end()
})

test('should be able to initialise inventory with items passed in', t => {
  const { items } = initialiseInventory(['test-item-1', 'test-item-2'])

  t.deepEqual(items, ['test-item-1', 'test-item-2'])
  t.end()
})

test('should be able to initialise used items array with items passed in', t => {
  const { itemsUsed } = initialiseInventory([], ['test-item-1', 'test-item-2'])

  t.deepEqual(itemsUsed, ['test-item-1', 'test-item-2'])
  t.end()
})

test('should be able to add an item to the inventory', t => {
  const inventory = { items: [], itemsUsed: []}
  const expectedResult = { items: ['test-item'], itemsUsed: [] }
  const result = addItem(inventory, 'test-item')

  t.deepEqual(result, expectedResult)
  t.end()
})

test('should not be able to add a duplicate item to the inventory', t => {
  const inventory = { items: ['test-item'], itemsUsed: [] }
  const result = addItem(inventory, 'test-item')

  t.deepEqual(result, inventory)
  t.end()
})

test('should not be able to add an item that has already been used to the inventory', t => {
  const inventory = { items: [], itemsUsed: ['test-item'] }
  const result = addItem(inventory, 'test-item')

  t.deepEqual(result, inventory)
  t.end()
})

test('should be able to remove an item from the inventory', t => {
  const inventory = { items: ['test-item'], itemsUsed: [] }
  const expectedResult = { items: [], itemsUsed: ['test-item'] }
  const result = removeItem(inventory, 'test-item')

  t.deepEqual(result, expectedResult)
  t.end()
})

test('should be able to return an updated inventory when two items are combined', t => {
  const inventory = { items: ['test-item', 'test-item-2'], itemsUsed: []}
  const testItem1 = 'test-item'
  const testItem2 = 'test-item-2'
  const expectedResult = { items: ['test-item-3'], itemsUsed: ['test-item', 'test-item-2'] }
  const result = combineItems(inventory, testItem1, testItem2)

  t.deepEqual(result, expectedResult)
  t.end()
})

test('should return false if items can not be combined', t => {
  const inventory = { items: ['test-item', 'test-item-3'], itemsUsed: []}
  const result = combineItems(inventory, 'test-item', 'test-item-3')

  t.equal(result, false)
  t.end()
})
