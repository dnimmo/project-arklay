module.exports = items => {
  function getItemProperty (itemName, property) {
    return items.filter(item => item.name === itemName)[0][property] || false
  }

  const getItemDetails = (itemName, detailsRequested) => detailsRequested.reduce((details, current) => {
    details[current] = getItemProperty(itemName, current)
    return details
  }, {})

  const canItemBeUsed = (itemName, roomSlug) => {
    const canBeUsedIn = getItemProperty(itemName, 'canBeUsedIn')
    return canBeUsedIn.includes(roomSlug)
  }

  return {
    getItemDetails,
    canItemBeUseds
  }
}
