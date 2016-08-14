module.exports = items => {
  const getItemDetails = itemName => items.filter(item => item.name === itemName)[0]

  const combineItems = (item1name, item2name) => {
    const item1 = getItemDetails(item1name)
    if (!item1.canBeCombinedWith) return false
    const item2 = getItemDetails(item2name)
    if (!item2.canBeCombinedWith) return false

    if (item1.canBeCombinedWith === item2name && item2.canBeCombinedWith === item1name) {
      return item1.creates
    } else {
      return false
    }
  }

  return {
    combineItems: combineItems
  }
}
