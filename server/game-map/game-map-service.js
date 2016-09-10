module.exports = gameMap => {
  function getRoomExtraInfo (roomSlug, itemsUsed = []) {
    const { examineInfo } = getRoom(roomSlug, itemsUsed)
    return examineInfo
  }

  function getItem (roomSlug, itemsUsed = []) {
    const { newItem } = getRoom(roomSlug, itemsUsed)
    return newItem || false
  }

  function getDirectionInfo (directions, itemsUsed) {
    // Only return unlocked directions
    return directions.filter(direction => isDirectionUnlocked(direction, itemsUsed))
  }

  function isDirectionUnlocked ({ blocked, unlockedWith }, itemsUsed) {
    if (typeof(blocked) === 'undefined') {
      // Room was never blocked to begin with
      return true
    }
    const matchingItems = itemsUsed.filter(item => unlockedWith.includes(item))
    return matchingItems.length === unlockedWith.length
  }

  const getRoom = (slug, itemsUsed) => {
    const requestedRoom = gameMap.filter(room => room.slug === slug)[0]
    if (!requestedRoom) {
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
