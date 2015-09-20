var app = angular.module('projectArklay', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  // Default state
  $urlRouterProvider.otherwise("/start");
  
  // State Provider may not be necessary
  $stateProvider 
    .state('start', {
      url: '/start',
      templateUrl: 'views/start.html'
    })
    .state('inventory', {
      templateUrl: 'views/inventory.html'
    })
    .state('setup', {
      url: '/setup',
      templateUrl: 'views/setup.html'
    })
    .state('game', {
    url: '/game',
    templateUrl: 'views/game.html'
    })
    .state('credits', {
    url: '/credits',
    templateUrl: 'views/credits.html'
    })
  }
]);

app.factory('GameMapFactory', ['$http', function($http) {
  var unlockedRooms = [];
  var visitedRooms = [];
 
  return{    
    init:
    function(){
      // Always cache results: Since a get request is called for every room, and the player will be re-visiting rooms, no need to have them keep requesting resources they should already have
      return $http.get('/rooms/start', {cache: true});
    },
    checkLocation: 
    function(current){
      // Get info from [url]/rooms/[slug]. Room info is all stored in src/assets/resources/map.json
      return $http.get(current, {cache: true});
    },
    initialiseVisitedRooms:
    function(){
      return visitedRooms;
    },
    addToVisitedRooms:
    function(room){
      visitedRooms.push(room);
    },
    checkIfRoomHasBeenVisited:
    function(room){
      var hasBeenVisited = false;
      angular.forEach(visitedRooms, function(roomThatHasBeenVisited){
        if(roomThatHasBeenVisited.name == room.name){
          hasBeenVisited = true;
        }
      });
      return hasBeenVisited
    },
    initialiseUnlockedRooms:
    function(){
      return unlockedRooms;
    },
    addToUnlockedRooms:
    function(room){
      unlockedRooms.push(room);
    },
    checkIfSurroundingsAreUnlocked:
    function(surroundings){
      var unlockedSurroundings = [];
      if(unlockedRooms.length != 0){
        angular.forEach(surroundings, function(direction){
          angular.forEach(unlockedRooms, function(room){
            if(direction.link == room){
              unlockedSurroundings.push(direction.link);
              // if a previously used item has unlocked a direction in this room, it should still be unlocked
            } 
          });
        });
      }
      return unlockedSurroundings;
    }
  }
}]);

app.factory('GameItemFactory', [function() {
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
      // If there's a sound effect associated with this item, add the 'Audio' functionality to the item to allow it to play
      if(item.soundWhenUsed != 'undefined'){
        item.soundEffect = new Audio(item.soundWhenUsed);
      }
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
    function(){
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
      // If this is still false then item has not been used; play error chime
      if(!itemHasBeenUsed && soundEnabled){
        errorSound.play();
      }
      // Return true or false so we know if we need to discard the current item
      return itemHasBeenUsed;
    },
  }
}]);

// Just gets the credits from /credits - nothing fancy here
app.factory('CreditsFactory', ['$http', function($http){
  return{
    getCredits: 
      function(){
        return $http.get('/credits');
      }
  }
}]);

// Settings panel directive
app.directive('settingsPanel', function(){
  return {
    templateUrl: 'directive-templates/settings-panel.html'
  }
})

// The main controller
app.controller('MainCtrl', ['$rootScope', '$scope', 'GameMapFactory', 'GameItemFactory', 'CreditsFactory', function($rootScope, $scope, GameMapFactory, GameItemFactory, CreditsFactory) {
  // Assign $scope to a 'view model' variable to save my poor fingers
  var vm = $scope;
  // Set-up stuff, probably needs to be more sensible
  vm.inventoryOpen = false;
  vm.inventory = GameItemFactory.getInventory();
  vm.itemOptionsOpen = false;
  vm.showDescription = false;
  vm.additionalMessage = '';
  vm.itemMessage = '';
  vm.visitedRooms = GameMapFactory.initialiseVisitedRooms();
  vm.unlockedRooms = GameMapFactory.initialiseUnlockedRooms();
  vm.credits = [];
  // Should this be a separate factory? I'm not 100% convinced either way
  vm.settings = {
    'open' : false,
    'backgroundColourOpen' : false,
    'menuColourOpen' : false,
    'textColourOpen' : false,
    'menuTextColourOpen' : false,
    'optionsOpen' : false,
    'soundEnabled' : true
  };
  
  // Set background music
  var backgroundMusic = new Audio('../assets/sounds/backgroundMusic.flac');
  backgroundMusic.playbackRate = .8;
  
  // Toggle the settings menu - should probably be moved to be part of a function that takes in what you want to toggle, as it repeats code from the "toggleInventory" function at present. Easily done, sort it out future me. :) 
  vm.toggleSettings = function(){
    vm.settings.open = !vm.settings.open;
  }
  
  vm.settings.individual = function(setting){
    if(setting == 'default'){
      // Reset settings to defaults
      vm.settings.backgroundColour = '';
      vm.settings.textColour = '';
      vm.settings.menuColour = '';
      vm.settings.menuTextColour = '';
      vm.settings.soundEnabled = true;
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
  
  // Initialise the game from /rooms/start
  GameMapFactory.init()
    .then(function(response){
      // Set starting info
      vm.current = response.data;
    });
  
  vm.playerName;
  
  vm.toggleInventory = function(){
    vm.additionalMessage = '';
    vm.inventoryOpen = !vm.inventoryOpen;
  }
  
  vm.update = function(roomToMoveTo){
    // GameMapFactory.checkLocation returns a promise which then returns the data for the current room
    GameMapFactory.checkLocation(roomToMoveTo).then(function(response){
    // Assign promise response to vm.current
    vm.current = response.data;
    if(vm.current.gameOver){
      return;
    }
    // Check to see if a locked area in this room has been previously unlocked
    var unlockedDirections = GameMapFactory.checkIfSurroundingsAreUnlocked(vm.current.directions);
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
      var itemAlreadyUsed = GameItemFactory.checkIfItemHasAlreadyBeenUsed(vm.current.newItem, vm.unlockedRooms);
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
  
  // Register player - currently only used in credits
  vm.registerPlayer = function(name){
    vm.playerName = name;
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
      // Keep a record of the rooms that have been unlocked so far so we know which items have been used
      GameMapFactory.addToUnlockedRooms(vm.selectedItem.unlocks);
      // Clear the current selected item (which no longer exists anyway)
      vm.clearSelectedItem();
      // Close inventory
      vm.toggleInventory();
  }
  
  vm.use = function(){
    vm.additionalMessage = '';
    // checkItemResult returns true if the item can be used, and false if it can't
    var checkItemResult = GameItemFactory.use(vm.selectedItem.unlocks, vm.current.directions, vm.settings.soundEnabled);
    // Unlock any rooms associated with this item with the result from GameItemFactory.use
    if(checkItemResult){
      // Play audio (if there is an audio file associated with this item)
      if(vm.selectedItem.soundEffect != 'undefined' && vm.settings.soundEnabled){
        vm.selectedItem.soundEffect.play();
      }
      // Display message to say that item has been used
      vm.itemMessage = '== "' + vm.selectedItem.name + '" used ==';
      // Update text displayed if necessary
      vm.updateSurroundings('used');
      // Discard item
      vm.discardItem();
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