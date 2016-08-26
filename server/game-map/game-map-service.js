module.exports = (gameMap, logLocation, logFileName) => {
  const { log } = require('../logging-service/logging-service')(logLocation, logFileName)

  function getRoomExtraInfo (roomSlug) {
    const { examineInfo } = getRoom(roomSlug)
    return examineInfo
  }

  function getItem (roomSlug) {
    const { newItem } = getRoom(roomSlug)
    return newItem || false
  }

  function getDirectionInfo (directions, itemsUsed) {
    const tempDirections = directions.slice()
    // Check to see if any directions are locked, and if they are, check to see if all of the necessary items to unlock them have already been used

    const updatedDirections = tempDirections.map(direction => {
      if (direction['blocked']) {
        direction['blocked'] = !isDirectionUnlocked(direction.unlockedWith, itemsUsed)
      } else {
        direction = ''
      }
      return direction
    })
    return updatedDirections
  }

  function isDirectionUnlocked (unlockRequirements, itemsUsed) {
    const matchingItems = itemsUsed.filter(item => unlockRequirements.includes(item))
    return matchingItems.length === unlockRequirements.length
  }

  const getRoom = (slug, itemsUsed) => {
    const requestedRoom = gameMap.filter(room => room.slug === slug)[0]
    if (!requestedRoom) {
      log(`Attempted to retrieve non-existent room: ${slug}`)
      return false
    }
    // Get direction info: This prevents locked rooms from being sent to the client
    requestedRoom['directions'] = getDirectionInfo(requestedRoom['directions'], itemsUsed)
    return requestedRoom
  }

  const examineRoom = roomSlug => {
    return {
      description: getRoomExtraInfo(roomSlug),
      item: getItem(roomSlug)
    }
  }

  return {
    getRoom,
    examineRoom
  }
}
