const test = require('tape')
const { readFileSync } = require('fs')
const map = JSON.parse(readFileSync('test/unit/resources/mock-map.json', 'utf8')).rooms
const { getRoom } = require('../../../server/game-map/service')(map)

test('Map Service:', t => {
  test('returns requested room', t => {
    const testRoom = getRoom('start')
    t.equal(testRoom.name, 'Foyer')

    t.end()
  })

  test('returns false if requested room does not exist', t => {
    const testRoom = getRoom('this-room-does-not-exist')
    t.equal(testRoom, false)

    t.end()
  })

  t.end()
})
