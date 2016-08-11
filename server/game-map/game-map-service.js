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

  const examineRoom = currentRoom => {
    const roomDetails = {
      description: currentRoom.examineInfo,
      item: currentRoom.newItem ? currentRoom.newItem : false
    }
    return roomDetails
  }

  return {
    getRoom: getRoom,
    examineRoom: examineRoom,
    canItemBeUsed: canItemBeUsed
  }
}

module.exports = mapService
