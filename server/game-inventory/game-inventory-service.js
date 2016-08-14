module.exports = itemService => {
  const { getItemDetails } = itemService

  // Update inventory by: taking existing inventory, concatenating it and the 'itemsToAdd' array, and then filtering out any items that appear in the 'itemsToRemove' array
  const updateInventory = (inventory, itemsToAdd, itemsToRemove) => inventory.concat(itemsToAdd).filter(item => !itemsToRemove.includes(item))

  const addItem = (inventory, item) => updateInventory(inventory, [item], [])

  const removeItem = (inventory, item) => updateInventory(inventory, [], [item])

  const combineItems = (inventory, item1name, item2name) => {
    const item1 = getItemDetails(item1name)
    if (!item1 || !item1.canBeCombinedWith) return false

    const item2 = getItemDetails(item2name)
    if (!item2 || !item2.canBeCombinedWith) return false

    if (!item1.canBeCombinedWith === item2name || !item2.canBeCombinedWith === item1name) {
      return false
    } else {
      return updateInventory(inventory, [item1.creates], [item1name, item2name])
    }
  }

  return {
    combineItems: combineItems,
    updateInventory: updateInventory,
    addItem: addItem,
    removeItem: removeItem
  }
}