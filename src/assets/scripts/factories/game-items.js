angular.module('projectArklay').factory('GameItemFactory', [function() {
  var inventory = [];
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
    function(item, unlockedRooms){
      var itemHasAlreadyBeenUsed = false;
        
      angular.forEach(unlockedRooms, function(room){
        if(item.unlocks == room){
          itemHasAlreadyBeenUsed = true;
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
    remove:
    function(item){
      // Remove the item that's passed in by checking its index in the inventory and then splicing the inventory on that index
      var itemPosition = inventory.indexOf(item);
      inventory.splice(itemPosition, 1);
      return inventory;
    },
    use:
    function(unlocks, currentRoomSurroundings, soundEnabled){
      var itemHasBeenUsed = false;
        // For each direction available in the current room, check to see if the link to the room matches the link in selectedItem.unlocks
      angular.forEach(currentRoomSurroundings, function(direction){
        // If the item being used unlocks a direction in the current room, set itemHasBeenUsed to true and unblock the relevant direction
        if(direction.link == unlocks){
          direction.blocked = false;
          itemHasBeenUsed = true;
        }
      });
      // If itemHasBeenUsed is still false then item has not been used; play error chime
      if(!itemHasBeenUsed && soundEnabled){
        errorSound.play();
      }
      // Return true or false so we know if we need to discard the current item
      return itemHasBeenUsed;
    },
  }
}]);