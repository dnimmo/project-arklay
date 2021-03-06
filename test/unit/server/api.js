const tape = require('tape')
const request = require('supertest')
const express = require('express')
const app = express()
const { readFileSync } = require('fs')
const mapFile = JSON.parse(readFileSync('test/unit/resources/mock-map.json', 'utf8')).rooms
const itemFile = JSON.parse(readFileSync('test/unit/resources/mock-items.json')).items
const credits = 'mock credits'
require('../../../server/api/api')(app, mapFile, itemFile, credits, 'test/unit/resources/test-logs', 'test-log')

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape(`API: ${description}`, func)

test('Calls the map service when a room is requested', t => {
  const testRoomID = 'start'
  request(app)
    .post(`/rooms/${testRoomID}`)
    .send([])
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)
      t.equal(result.name, 'Foyer')
      t.end()
    })
})

test('returns room with all unlocked directions if correct items have already been used', t => {
  const testRoomID = 'test-room'
  const itemsUsed = ['test-item']

  request(app)
    .post(`/rooms/${testRoomID}`)
    .send(itemsUsed)
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)
      t.equal(result.directions.length, 3)
      t.end()
    })
})

test('Returns item info when requested', t => {
  const testItemName = 'test-item'
  request(app)
    .post(`/items/${testItemName}`)
    .send({ properties: ['name'] })
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const { name } = JSON.parse(response.text)
      t.equal(name, 'test-item')
      t.end()
    })
})

test('Returns whether an item can be used in a given room or not', t => {
  const testItemName = 'test-item'
  const testRoomSlug = 'test-room'
  request(app)
    .get(`/items/${testItemName}/can-item-be-used?roomSlug=${testRoomSlug}`)
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)

      t.equal(result, true)
      t.end()
    })
})

test('Returns an initialised inventory', t => {
  const expectedResult = { items: [], itemsUsed: [] }
  request(app)
    .get('/inventory/initialise')
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)

      t.deepEqual(result, expectedResult)
      t.end()
    })
})

test('Returns an initialised inventory with items', t => {
  const expectedResult = { items: ['test-item'], itemsUsed: ['test-item-2'] }
  request(app)
    .post('/inventory/initialise')
    .send(expectedResult)
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)

      t.deepEqual(result, expectedResult)
      t.end()
    })
})

test('Can add an item with /add/item-name', t => {
  const expectedResult = 'test-item'
  request(app)
    .patch('/inventory/add/test-item')
    .send({ items: [], itemsUsed: [] })
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)

      t.equal(result.items[0].name, expectedResult)
      t.end()
    })
})

test('Can remove items on /remove/item-name', t => {
  const expectedResult = { items: [], itemsUsed: ['test-item'] }
  request(app)
    .patch('/inventory/remove/test-item')
    .send({ items: [{ name: 'test-item' }], itemsUsed: [] })
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)
      t.deepEqual(result, expectedResult)
      t.end()
    })
})

test('Can combine items on /combine/item-1/item-2', t => {
  const expectedResult = { items: [{ canBeUsedIn: false, description: false, displayName: false, image: false, messageWhenNotUsed: false, messageWhenUsed: false, name: 'test-item-3', soundWhenUsed: false, unlocks: false }], itemsUsed: ['test-item', 'test-item-2'] }
  request(app)
    .post('/inventory/combine/test-item/test-item-2')
    .send({ items: [{name: 'test-item'}, {name: 'test-item-2'}], itemsUsed: [] })
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)

      t.deepEqual(result, expectedResult)
      t.end()
    })
})

test('Returns credits on /credits', t => {
  // 'mock credits' is defined at the top of this file, and passed in to the API functions
  request(app)
    .get('/credits')
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      t.equal(response.text, '"mock credits"')
      t.end()
    })
})
