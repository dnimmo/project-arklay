const mapService = (gameMap, logLocation, logFileName) => {
  const { log } = require('../logging-service/logging-service')(logLocation, logFileName)

  const getRoom = slug => {
    const requestedRoom = gameMap.filter(room => room.slug === slug)[0]
    if (!requestedRoom) {
      log(`Attempted to retrieve non-existent room: ${slug}`)
      return false
    }
    return requestedRoom
  }

  const canItemBeUsed = (roomsItemCanBeUsedIn, roomSlug) => canBeUsed = roomsItemCanBeUsedIn.includes(roomSlug)

  return {
    getRoom: getRoom,
    canItemBeUsed: canItemBeUsed
  }
}

module.exports = mapService
