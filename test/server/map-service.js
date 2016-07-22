const test = require('tape')
const fs = require('fs')
const map = JSON.parse(fs.readFileSync('test/resources/mock-map.json', 'utf8')).rooms
const mapService = require('../../server/game-map/service')(map)

test('Map Service: ', t => {
  test('returns requested room', t => {
    const testRoom = mapService.getRoom('start')
    t.equal(testRoom.name, 'Foyer')

    t.end()
  })

  test('returns false if requested room does not exist', t => {
    const testRoom = mapService.getRoom('this-room-does-not-exist')
    t.equal(testRoom, false)

    t.end()
  })

  t.end()
})
