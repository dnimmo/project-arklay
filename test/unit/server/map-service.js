const tape = require('tape')
const { readFileSync } = require('fs')
const map = JSON.parse(readFileSync('test/unit/resources/mock-map.json', 'utf8')).rooms
const {
  getRoom,
  canItemBeUsed,
  examineRoom,
  getRoomExtraInfo,
  getItem
  } = require('../../../server/game-map/game-map-service')(map, 'test/unit/resources/test-logs', 'test-room.log')

const test = (description, func) => tape.call(null, `Map Service: ${description}`, func)

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
