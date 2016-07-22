const mapService = (gameMap) => {

  const itemsMatch = (a, b) => a.toString() === b.toString()

  const getRoom = slug => {
    const requestedRoom = gameMap.filter(room => itemsMatch(room.slug, slug))[0]
    return requestedRoom ? requestedRoom : false
  }

  return {
    getRoom: getRoom
  }
}

module.exports = mapService