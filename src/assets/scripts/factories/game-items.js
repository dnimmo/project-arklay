angular.module('projectArklay').factory('GameItemFactory', ['UnlockedRoomsService', function(UnlockedRoomsService) {
  var inventory = [];
  var itemsUsed = [];
  // Register sound effects
  var newItemSound = new Audio('../assets/sounds/newItemChime.mp3');
  var errorSound = new Audio('../assets/sounds/error.mp3');
  var volume = 0.5;
  newItemSound.volume = volume;
  errorSound.volume = volume;
  
  return {
    add:
    function(item, soundEnabled){
      inventory.push(item);
      // Play chime when item is picked up, if sound is enabled
      if(soundEnabled){
        newItemSound.play();
      }
      return inventory;
    },
    checkIfItemAlreadyHeld:
    // If an item is already in the inventory, you don't want it to be able to be added again
    function(item){
      var itemIsAlreadyHeld = false;
        angular.forEach(inventory, function(inventoryItem){
          if(inventoryItem.name == item.name){
            itemIsAlreadyHeld = true;
          }
        });
      return itemIsAlreadyHeld;
    },
    checkIfItemHasAlreadyBeenUsed:
    // If an item's already been used, you don't want the player to be able to pick it up when they go back to where it was originally
    function(item, usedItems){
      var itemHasAlreadyBeenUsed = false;
      angular.forEach(usedItems, function(usedItem){
        if(item.name == usedItem){
          itemHasAlreadyBeenUsed = true;
          return itemHasAlreadyBeenUsed;
         }
      });
      // Return true or false so we know if this item has been used previously
      return itemHasAlreadyBeenUsed;
    },
    getInventory: 
    function(saveData){
      // If loading a previous save, initialise the inventory from save data
      if(saveData){
        inventory = saveData;
      }
      return inventory;
    },
    getItemsUsed:
    function(saveData){
      // If loading a previous save, initialise items used from save data
      if(saveData){
        itemsUsed = saveData;
      }
      return itemsUsed;
    },
    remove:
    function(item){
      // Remove the item that's passed in by checking its index in the inventory and then splicing the inventory on that index
      var itemPosition = inventory.indexOf(item);
      inventory.splice(itemPosition, 1);
      return inventory;
    },
    use:
    function(item, currentRoom, soundEnabled){
      var itemHasBeenUsed = false;
      var unlockRequirementsCount;
      var unlockRequirementsMet = 0;
      // For each direction available in the current room, check to see if the link to the room matches the link in selectedItem.unlocks
      if(item.canBeUsedIn == currentRoom.slug){
        itemHasBeenUsed = true;
        itemsUsed.push(item.name);
      }
      // Return true or false so we know if we need to discard the current item
      return itemHasBeenUsed;
    },
  }
}]);