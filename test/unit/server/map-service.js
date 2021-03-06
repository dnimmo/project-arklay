const tape = require('tape')
const { readFileSync } = require('fs')
const map = JSON.parse(readFileSync('test/unit/resources/mock-map.json', 'utf8')).rooms
const {
  getRoom,
  examineRoom
  } = require('../../../server/game-map/game-map-service')(map, 'test/unit/resources/test-logs', 'test-room.log')

// Set up test method to always prepend the service name so that test failures are easier to look into
const test = (description, func) => tape(`Map Service: ${description}`, func)

test('returns requested room', t => {
  const testRoom = getRoom('start', [])

  t.equal(testRoom.name, 'Foyer')
  t.end()
})

test('does not return direction option for any blocked rooms', t => {
  const testRoom = getRoom('start', [])
  t.equal(testRoom.directions.length, 1)
  t.end()
})

test('returns room with all unlocked directions if correct items have already been used', t => {
  const testRoom = getRoom('test-room', ['test-item'])
  t.equal(testRoom.directions.length, 3)
  t.end()
})

test('returns false if requested room does not exist', t => {
  const testRoom = getRoom('this-room-does-not-exist')

  t.equal(testRoom, false)
  t.end()
})

test('can return extra information about a given room', t => {
  const testRoomSlug = 'test-room'
  const testRoomExtraInfo = 'Some extra info you get when examining the room'
  const { description } = examineRoom(testRoomSlug)

  t.equal(description, testRoomExtraInfo)
  t.end()
})

test('can return an item when the room is examined, if one is present', t => {
  const testRoomSlug = 'test-room'
  const testItemName = 'test-item'
  const { item } = examineRoom(testRoomSlug)

  t.equal(item, testItemName)
  t.end()
})

test('returns false if an examined room has no item', t => {
  const testRoomSlug = 'start'
  const { item } = examineRoom(testRoomSlug)

  t.equal(item, false)
  t.end()
})
