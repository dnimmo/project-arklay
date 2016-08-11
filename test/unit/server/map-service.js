const test = require('tape')
const { readFileSync } = require('fs')
const map = JSON.parse(readFileSync('test/unit/resources/mock-map.json', 'utf8')).rooms
const { getRoom, canItemBeUsed } = require('../../../server/game-map/game-map-service')(map, 'test/unit/resources/test-logs', 'test-room.log')

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

  test('can tell if an item can be used in a given room', t => {
    const testRoomSlug = 'test-room'
    const testItemUseInfo = ['test-room']
    const result = canItemBeUsed(testItemUseInfo, testRoomSlug)

    t.equal(result, true)
    t.end()
  })

  t.end()
})
