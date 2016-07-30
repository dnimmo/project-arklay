const mapService = (gameMap, logLocation, logFileName) => {
  const { log } = require('../logging-service/logging-service')(logLocation, logFileName)

  const getRoom = slug => {
    const requestedRoom = gameMap.filter(room => room.slug === slug)[0]
    if (!requestedRoom) {
      log('Attempted to retrieve non-existant room: ' + slug)
      return false
    }
    return requestedRoom
  }

  return {
    getRoom: getRoom
  }
}

module.exports = mapService
