module.exports = items => {
  const getItemDetails = itemName => items.filter(item => item.name === itemName)[0] || false

  const canItemBeUsed = (itemName, roomSlug) => {
    const { canBeUsedIn } = getItemDetails(itemName)
    return canBeUsedIn.includes(roomSlug)
  }

  return {
    getItemDetails: getItemDetails,
    canItemBeUsed: canItemBeUsed
  }
}
