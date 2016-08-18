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
    .get(`/rooms/${testRoomID}`)
    .end((error, response) => {
      if (error) {
        console.log(error)
      }
      const result = JSON.parse(response.text)
      t.equal(result.name, 'Foyer')
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
  const expectedResult = { items: ['test-item'], itemsUsed: []}
  request(app)
    .patch('/inventory/add/test-item')
    .send({ inventory: { items: [], itemsUsed: [] } })
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
