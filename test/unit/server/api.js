const test = require('tape')
const request = require('supertest')
const express = require('express')
const app = express()
const { readFileSync } = require('fs')
const mapFile = JSON.parse(readFileSync('test/unit/resources/mock-map.json', 'utf8')).rooms
const credits = 'mock credits'
require('../../../server/api/api')(app, mapFile, credits, 'test/unit/resources/test-logs', 'test-log')

test('API: ', t => {
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
  t.end()
})
