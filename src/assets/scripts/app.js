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

// Service to wrap socket.io in Angular
app.service('socket', function($rootScope){
	var socket = io.connect(null); //paramater is for address and port - passing in 'null' ensures that the browser's current address and port are used
	return{
		// socket.on
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args = arguments;
				// Bind to root scope and apply any changes on change
				$rootScope.$apply(function(){
					callback.apply(socket, args);
				});
			});
		},
		// socket.emit
		emit: function(eventName, data, callback){
			socket.emit(eventName, data, function(){
				var args = arguments;
				$rootScope.$apply(function(){
					if(callback){
						callback.apply(socket, args);
					}
				});
			})
		}
	};
})


app.factory('GameMapFactory', ['$http', function($http) {
  socket.emit('setup', 'start');
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
    checkForOtherPlayers:
      function(currentRoom, previousRoom){
        // Display a message if someone else is in the same room
        socket.emit('checkForOtherPeople', currentRoom, previousRoom.slug);
      }
  }
}]);

app.factory('GameItemFactory', [function() {
  var inventory = [];
  return {
    getInventory: 
      function(){
        return inventory;
      },
    add:
      function(item){
        inventory.push(item);
        return inventory;
      },
    remove:
      function(item){
        var itemPosition = inventory.indexOf(item);
        inventory.splice(itemPosition, 1);
        return inventory;
      },
    use:
      function(unlocks, currentRoomSurroundings){
        var itemHasBeenUsed = false;
        // For each direction available in the current room, check to see if the link to the room matches the link in selectedItem.unlocks
        angular.forEach(currentRoomSurroundings, function(direction){
          
          // If the item being used unlocks a direction in the current room, set itemHasBeenUsed to true and unblock the relevant direction
          if(direction.link == unlocks){
            direction.blocked = false;
            itemHasBeenUsed = true;
          }
        });
        // Return true or false so we know if we need to discard the current item
        return itemHasBeenUsed;
    }
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

app.controller('MainCtrl', ['$scope', 'GameMapFactory', 'GameItemFactory', 'CreditsFactory', function($scope, GameMapFactory, GameItemFactory, CreditsFactory) {
  // Assign $scope to a 'view model' variable to save my poor fingers
  var vm = $scope;
  // Set-up stuff, probably needs to be more sensible
  vm.inventoryOpen = false;
  vm.inventory = GameItemFactory.getInventory();
  vm.itemOptionsOpen = false;
  vm.showDescription = false;
  vm.additionalMessage = '';
  vm.itemMessage = '';
  vm.otherPlayerInRoom = '';
  vm.visitedRooms = [{}];
  vm.unlockedRooms = [];
  vm.credits = [];
  // Should this be a separate factory? I'm not 100% convinced either way
  vm.settings = {
    'open' : false,
    'backgroundColourOpen' : false,
    'menuColourOpen' : false,
    'textColourOpen' : false,
    'menuTextColourOpen' : false,
    'optionsOpen' : false
  };
  
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
    }
  }
  
  // Initialise the game from /rooms/start
  GameMapFactory.init()
    .then(function(response){
      // Set starting info
      vm.current = response.data;
    });
  
  vm.playerName;
  // GameMapFactory.checkLocation returns a promise which then returns the data for the current room
  
  vm.toggleInventory = function(){
    vm.additionalMessage = '';
    vm.inventoryOpen = !vm.inventoryOpen;
  }
  
  vm.update = function(roomToMoveTo){
    GameMapFactory.checkLocation(roomToMoveTo).then(function(response){
    // Assign promise response to vm.current
    vm.current = response.data;
    // Check to see if there's anyone else in the room
    GameMapFactory.checkForOtherPlayers(vm.current.slug, vm.visitedRooms[vm.visitedRooms.length-1]);
    if(vm.current.gameOver){
      return;
    }
    // Check to see if a locked area in this room has been previously unlocked
    if(vm.unlockedRooms.length != 0){
      angular.forEach(vm.current.directions, function(direction){
        angular.forEach(vm.unlockedRooms, function(room){
          if(direction.link == room){
            // if a previously used item has unlocked a direction in this room, it should still be unlocked
            direction.blocked = false;
            vm.updateSurroundings('used');
          } 
        });
      });
    }
      
    // Check to see if there's a new item here
    if (typeof vm.current.newItem === 'object'){
      var itemAlreadyPickedUp = false;
      // Check to make sure we don't already have this item in the inventory
      angular.forEach(vm.inventory, function(item){
        if(vm.current.newItem.name == item.name){
          itemAlreadyPickedUp = true;
          // Update text displayed if necessary
          vm.updateSurroundings('picked up');
        }
      });
      // Check to make sure any items picked up in this area haven't already been used
      angular.forEach(vm.unlockedRooms, function(room){
        if(vm.current.newItem.unlocks == room){
          itemAlreadyPickedUp = true;
         }
      });
      // If item has never been picked up or used
      if(!itemAlreadyPickedUp){
        // Add the new item to the inventory
        GameItemFactory.add(vm.current.newItem);
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
    // Reset any additional message on the screen
    vm.checkIfVisitedRoom();
    vm.itemMessage= '';
    vm.additionalMessage = '';
    vm.otherPlayerInRoom = '';
  }
  
  // Check if room has been visited
  vm.checkIfVisitedRoom = function(){
      var hasBeenVisited = false;
      angular.forEach(vm.visitedRooms, function(room){
        if(room.name == vm.current.name){
          hasBeenVisited = true;
        }
      });
      if(!hasBeenVisited){
        // Add current room to visited rooms if not previously visited
        vm.visitedRooms.push({"name" : vm.current.name, "slug" : vm.current.slug});  
      }
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
      // Keep a record of the items used so far
      vm.unlockedRooms.push(vm.selectedItem.unlocks);
      // Clear the current selected item (which no longer exists anyway)
      vm.clearSelectedItem();
      // Close inventory
      vm.toggleInventory();
  }
  
  vm.use = function(){
    vm.additionalMessage = '';
    // checkItemResult returns true if the item can be used, and false if it can't
    var checkItemResult = GameItemFactory.use(vm.selectedItem.unlocks, vm.current.directions);
    // Unlock any rooms associated with this item with the result from GameItemFactory.use
    if(checkItemResult){
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

  // ============
  // Socket stuff
  // ============
  
  // When two players are in the same room, display a message to let them know they are not alone
  // This is handled in server.js
  socket.on('someoneElseIsHere', function(data){
    vm.otherPlayerInRoom = data;
    vm.$apply();
  });
}]);