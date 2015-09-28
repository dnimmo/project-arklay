angular.module('projectArklay').controller('MainCtrl', ['$rootScope', '$scope', 'CreditsFactory', 'GameItemFactory', 'GameMapFactory', 'SaveDataFactory', 'SettingsFactory', 'UnlockedRoomsService', function($rootScope, $scope, CreditsFactory, GameItemFactory, GameMapFactory, SaveDataFactory, SettingsFactory, UnlockedRoomsService) {
  // Assign $scope to a 'view model' variable to save my poor fingers
  var vm = $scope;
  // Set-up stuff, probably needs to be more sensible
  vm.additionalMessage = '';
  vm.credits = [];
  vm.inventory = [];
  vm.inventoryOpen = false;
  vm.itemMessage = '';
  vm.itemOptionsOpen = false;
  vm.itemsUsed = [];
  vm.localStorageEnabled;
  vm.saveData = SaveDataFactory.load();
  vm.settings = SettingsFactory.getDefaults();
  vm.showDescription = false;
  vm.unlockedRooms = UnlockedRoomsService();
  vm.visitedRooms = GameMapFactory.initialiseVisitedRooms();
  
  if(typeof(localStorage) !== 'undefined'){
    vm.localStorageEnabled = true;
  }
  
  // Set background music
  var backgroundMusic = new Audio('../assets/sounds/backgroundMusic.flac');
  backgroundMusic.playbackRate = .8;
  
  // Load an existing saved game   
  vm.loadGame = function(){
    // Set up the current room by getting the room from the save data,
    // then having the game think you've just 'moved' into that room
    vm.current = {};
    vm.current.slug = vm.saveData.currentState;
    vm.move(vm.saveData.currentState);
    
    // Set up the inventory and the unlocked rooms by initialising them both from save data
    vm.inventory = GameItemFactory.getInventory(vm.saveData.inventory);
    vm.itemsUsed = GameItemFactory.getItemsUsed(vm.saveData.itemsUsed);
    angular.forEach(vm.saveData.unlockedRooms.unlocked, function(room){
      UnlockedRoomsService(room);
    });
    vm.unlockedRooms = UnlockedRoomsService();
  }
  
  // Start a new game
  vm.newGame = function(){
    // Initialise the game from /rooms/start
    GameMapFactory.init()
      .then(function(response){
      // Set starting info
      vm.current = response.data;
    });
  }
  
  // If vm.current doesn't exist by this point force a hard refresh
  if(!vm.current){
    window.location = window.location.origin+'#';
  }
  
  // Cancel selected item
  vm.clearSelectedItem = function(){
    vm.additionalMessage = '';
    vm.selectedItem = '';
    // Close the inventory
    vm.itemOptionsOpen = false; 
  }
  
  // Handle items that have been used
  vm.discardItem = function(){
      // Discard current item
      GameItemFactory.remove(vm.selectedItem);
      // Clear the current selected item (which no longer exists anyway)
      vm.clearSelectedItem();
      // Close inventory
      vm.toggleInventory();
  }
  
  // Toggle the settings menu - should probably be moved to be part of a function that takes in what you want to toggle, as it repeats code from the "toggleInventory" function at present. Easily done, sort it out future me. :) 
  vm.toggleSettings = function(){
    vm.settings.open = !vm.settings.open;
  }
  
  vm.settings.individual = function(setting){
    if(setting == 'default'){
      // Reset settings to defaults
      vm.settings = SettingsFactory.getDefaults();
    } else {
      vm.settings.optionsOpen = true;
      switch(setting){
        case 'backgroundColour':
          vm.settings.backgroundColourOpen = true;
          // Store the value on opening the menu in case the user cancels
          vm.settings.tempBackgroundColour = vm.settings.backgroundColour;
          break;
        case 'textColour':
          vm.settings.textColourOpen = true;
          // Store the value on opening the menu in case the user cancels
          vm.settings.tempTextColour = vm.settings.textColour;
          break;
        case 'menuColour':
          vm.settings.menuColourOpen = true;
          // Store the value on opening the menu in case the user cancels
          vm.settings.tempMenuColour = vm.settings.menuColour;
          break;
        case 'menuTextColour':
          vm.settings.menuTextColourOpen = true;
          // Store the value on opening the menu in case the user cancels
          vm.settings.tempMenuTextColour = vm.settings.menuTextColour;
          break;
        case 'sound':
          vm.settings.soundOpen = true;
          // Store the value on opening the menu in case the user cancels
          vm.settings.tempSoundOption = vm.settings.soundEnabled;
          break; 
      }
    }
  };
  
  // Handle whether settings are saved or reset. Saved is a boolean, if it's true it's kept as-is, if it's false it's reset to default
  vm.settings.close = function(setting, toChange){
    vm.settings.optionsOpen = false;
    switch(setting){
      case 'backgroundColour':
          vm.settings.backgroundColourOpen = false;
          if(!toChange){
            // Revert to previously stored colour
            vm.settings.backgroundColour = vm.settings.tempBackgroundColour;
          }
        break;
      case 'textColour':
          vm.settings.textColourOpen = false;
          if(!toChange){
            // Revert to previously stored colour
            vm.settings.textColour = vm.settings.tempTextColour;
          }
        break;
      case 'menuColour':
          vm.settings.menuColourOpen = false;
          if(!toChange){
            // Revert to previously stored colour
            vm.settings.menuColour = vm.settings.tempMenuColour;
          }
        break;
      case 'menuTextColour':
          vm.settings.menuTextColourOpen = false;
          if(!toChange){
            // Revert to previously stored colour
            vm.settings.menuTextColour = vm.settings.tempMenuTextColour;
          }
        break;
      case 'sound':
          vm.settings.soundOpen = false;
          if(!toChange){
            // Revert to previously stored sound setting
            vm.settings.soundEnabled = vm.settings.tempSoundOption;
          }
        break;
    }
  }
  
  vm.toggleInventory = function(){
    vm.additionalMessage = '';
    vm.inventoryOpen = !vm.inventoryOpen;
  }
  
  vm.update = function(roomToMoveTo){
    // GameMapFactory.checkLocation returns a promise which then returns the data for the current room
    GameMapFactory.checkLocation(roomToMoveTo).then(function(response){
      
      // Assign promise response to vm.current
      vm.current = response.data;
      
      // Save current progress at the end of each room move
      SaveDataFactory.save(vm.current, vm.inventory, vm.unlockedRooms, vm.itemsUsed);
      
      if(vm.current.gameOver){
        return;
      }
      // Check to see if a locked area in this room has been previously unlocked
      var unlockedDirections = GameMapFactory.checkIfSurroundingsAreUnlocked(vm.current.directions, vm.itemsUsed);
      // If there are any rooms leading off from the player's current position that were once locked,
      // but have since been unlocked, make sure they remain unlocked.
      if (unlockedDirections.length > 0){
        // Loop through the locked rooms, compare them against the link in each available direction...
        angular.forEach(unlockedDirections, function(unlockedDirection){
          angular.forEach(vm.current.directions, function(direction){
            // ...and set any that match to be unlocked.
            if (direction.link == unlockedDirection){
              direction.blocked = false;
              vm.updateSurroundings('used');
            }
          })
        })
      }
      
      // Check to see if there's a new item here
      if (typeof vm.current.newItem === 'object'){
        // Check to make sure we don't already have this item in the inventory
        var itemAlreadyPickedUp = GameItemFactory.checkIfItemAlreadyHeld(vm.current.newItem);
        // Check to make sure item hasn't already been used
        var itemAlreadyUsed = GameItemFactory.checkIfItemHasAlreadyBeenUsed(vm.current.newItem, vm.itemsUsed);
        if(itemAlreadyPickedUp, function(){
          // Update text displayed
          vm.updateSurroundings('picked up');
        });
      
        // If item has never been picked up or used
        if(!itemAlreadyPickedUp && !itemAlreadyUsed){
          // Add the new item to the inventory
          GameItemFactory.add(vm.current.newItem, vm.settings.soundEnabled);
          // Update our inventory
          vm.inventory = GameItemFactory.getInventory();
          // Display message to show item picked up
          vm.itemMessage = '== "' + vm.current.newItem.name + '" picked up ==';
        }
      }
    });
  }
  
  vm.updateSurroundings = function(usedOrPickedUp){
    // Update surroundings based on whether an item has been used or picked up
    if(vm.current.canChange){
      if(usedOrPickedUp == 'picked up'){
        vm.current.surroundings = vm.current.surroundingsWhenItemPickedUp;  
       } else if (usedOrPickedUp == 'used'){
         vm.current.surroundings = vm.current.surroundingsWhenItemUsed; 
       } 
    } else {
      // Nothing to see here
    }
  }  
  
  // Move in a given direction
  vm.move = function(roomToMoveTo){
    vm.update(roomToMoveTo);
    var hasBeenVisited = GameMapFactory.checkIfRoomHasBeenVisited({"name" : vm.current.name, "slug" : vm.current.slug});
    if(!hasBeenVisited){
      GameMapFactory.addToVisitedRooms({"name" : vm.current.name, "slug" : vm.current.slug});
    }
    // Reset any additional message on the screen
    vm.itemMessage= '';
    vm.additionalMessage = '';
  }
  
  // Show item options
  vm.showOptions = function(item){
    vm.itemOptionsOpen = true;
    vm.selectedItem = item;
  }
  
  vm.use = function(){
    vm.additionalMessage = '';
    // checkItemResult returns true if the item can be used, and false if it can't
    var checkItemResult = GameItemFactory.use(vm.selectedItem, vm.current, vm.settings.soundEnabled);
    
    // Unlock any rooms associated with this item with the result from GameItemFactory.use
    if(checkItemResult){
      // If there's a sound effect associated with this item, add the 'Audio' functionality to the item to allow it to play
      if(vm.selectedItem.soundWhenUsed != 'undefined'){
        vm.selectedItem.soundEffect = new Audio(vm.selectedItem.soundWhenUsed);
      }
      // Play audio (if there is an audio file associated with this item)
      if(vm.selectedItem.soundEffect != 'undefined' && vm.settings.soundEnabled){
        vm.selectedItem.soundEffect.play();
      }
      // Display message to say that item has been used
      vm.itemMessage = '== "' + vm.selectedItem.name + '" used ==';
      // Update text displayed if necessary
      vm.updateSurroundings('used');
      // Add to used items
      vm.itemsUsed = GameItemFactory.getItemsUsed();
      // Discard item
      vm.discardItem();
      // Update the current room
      vm.update('/rooms/' + vm.current.slug);
    } else {
      // Item can't be used in this room
      vm.additionalMessage = "== You can't do that here =="; 
    }
  }
  
  vm.getCredits = CreditsFactory.getCredits().then(function(response){
    vm.credits = response.data.credits;
  });
  
  vm.handleBackgroundMusic = function(toggle){
    // You can call this function with a parameter to toggle whether the sound is enabled or not - this is for the settings menu. The reason this is optional is to allow the game to start with music playing / not playing without having to pass a parameter in
    if(toggle){
      vm.settings.soundEnabled = !vm.settings.soundEnabled;
    }
    if(vm.settings.soundEnabled){
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.6;
      backgroundMusic.play();
    } else {
      // If sound has been disabled
      //backgroundMusic.pause();
    }
  }
  
  vm.playCreditsSound = function(){
    if(vm.settings.soundEnabled){    
      var creditsMusic = new Audio('../assets/sounds/credits.mp3');
      var creditsSound = new Audio('../assets/sounds/radioChatter.mp3');
      creditsSound.playbackRate = 1;
      backgroundMusic.volume = 0;
      creditsMusic.play();
      creditsSound.play(); 
    }
  }
  
  // Allow music to start on page load - does not work in Android Chrome as it does not allow auto-play
  vm.$watch(vm.settings.soundEnabled, function(){
    vm.handleBackgroundMusic(false);
  });
}]);