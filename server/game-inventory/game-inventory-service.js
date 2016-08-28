module.exports = itemService => {
  const { getItemDetails } = itemService
  const allItemAttributes = ['name', 'displayName', 'image', 'description', 'messageWhenUsed', 'messageWhenNotUsed', 'canBeUsedIn', 'unlocks', 'soundWhenUsed']

  function updateInventory ({ items, itemsUsed }, itemsToAdd, itemsToRemove) {
    let updatedItems = items.concat(itemsToAdd).filter(item => !itemsToRemove.includes(item))
    const updatedItemsUsed = itemsUsed.concat(itemsToRemove)
    // Update inventory by: taking existing inventory, concatenating it and the 'itemsToAdd' array, and then filtering out any items that appear in the 'itemsToRemove' array
    return {
      items: updatedItems,
      itemsUsed: updatedItemsUsed
    }
  }

  const initialiseInventory = (items, itemsUsed) => {
    // Can be initialied with item data (for loading game)
    return {
      items: items || [],
      itemsUsed: itemsUsed || []
    }
  }

  // Only add item if it isn't already in the inventory, otherwise just return inventory as-is
  const addItem = (inventory, item) => inventory.items.includes(item) || inventory.itemsUsed.includes(item) ? inventory : updateInventory(inventory, [getItemDetails(item, allItemAttributes)], [])

  const removeItem = (inventory, item) => updateInventory(inventory, [], [item])

  const combineItems = (inventory, item1name, item2name) => {
    const item1 = getItemDetails(item1name, ['canBeCombinedWith', 'creates'])
    const item2 = getItemDetails(item2name, ['canBeCombinedWith'])
    if (!item1 || !item1.canBeCombinedWith || !item2 || !item2.canBeCombinedWith || !item1.canBeCombinedWith === item2name || !item2.canBeCombinedWith === item1name) {
      return false
    }

    return updateInventory(inventory, [item1.creates], [item1name, item2name])
  }

  return {
    initialiseInventory,
    addItem,
    removeItem,
    combineItems
  }
}
