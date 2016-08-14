module.exports = items => {
  const getItemDetails = itemName => items.filter(item => item.name === itemName)[0] || false

  return {
    getItemDetails: getItemDetails
  }
}
