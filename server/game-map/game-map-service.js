module.exports = (gameMap, logLocation, logFileName) => {
  const { log } = require('../logging-service/logging-service')(logLocation, logFileName)

  function getRoomExtraInfo (currentRoomSlug) {
    const { examineInfo } = getRoom(currentRoomSlug)
    return examineInfo
  }

  function getItem (currentRoomSlug) {
    const { newItem } = getRoom(currentRoomSlug)
    return newItem || false
  }

  const getRoom = slug => {
    const requestedRoom = gameMap.filter(room => room.slug === slug)[0]
    if (!requestedRoom) {
      log(`Attempted to retrieve non-existent room: ${slug}`)
      return false
    }
    return requestedRoom
  }

  const examineRoom = currentRoomSlug => {
    return {
      description: getRoomExtraInfo(currentRoomSlug),
      item: getItem(currentRoomSlug)
    }
  }

  return {
    getRoom: getRoom,
    examineRoom: examineRoom
  }
}
