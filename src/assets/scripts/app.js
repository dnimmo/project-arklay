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
        return $http.get('/rooms/start');
      },
    checkLocation: 
      function(current){
        // Get info from [url]/rooms/[slug]. Room info is all stored in src/assets/resources/map.json
        return $http.get(current);
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
  // Set-up stuff, probably needs to be more sensible
  $scope.inventoryOpen = false;
  $scope.inventory = GameItemFactory.getInventory();
  $scope.itemOptionsOpen = false;
  $scope.showDescription = false;
  $scope.additionalMessage = '';
  $scope.otherPlayerInRoom = '';
  $scope.visitedRooms = [{}];
  $scope.unlockedRooms = [];
  $scope.credits = [];
  
  GameMapFactory.init()
    .then(function(response){
      // Set starting info
      $scope.current = response.data;
    });
  
  $scope.playerName;
  // GameMapFactory.checkLocation returns a promise which then returns the data for the current room
  
  $scope.toggleInventory = function(){
    $scope.inventoryOpen = !$scope.inventoryOpen;
  }
  
  $scope.update = function(roomToMoveTo){
    GameMapFactory.checkLocation(roomToMoveTo).then(function(response){
    // Assign promise response to $scope.current
    $scope.current = response.data;
    // Check to see if there's anyone else in the room
    GameMapFactory.checkForOtherPlayers($scope.current.slug, $scope.visitedRooms[$scope.visitedRooms.length-1]);
    if($scope.current.gameOver){
      return;
    }
    // Check to see if a locked area in this room has been previously unlocked
    if($scope.unlockedRooms.length != 0){
      angular.forEach($scope.current.directions, function(direction){
        angular.forEach($scope.unlockedRooms, function(room){
          if(direction.link == room){
            // if a previously used item has unlocked a direction in this room, it should still be unlocked
            direction.blocked = false;
            $scope.updateSurroundings('used');
          } 
        });
      });
    }
      
    // Check to see if there's a new item here
    if (typeof $scope.current.newItem === 'object'){
      var itemAlreadyPickedUp = false;
      // Check to make sure we don't already have this item in the inventory
      angular.forEach($scope.inventory, function(item){
        if($scope.current.newItem.name == item.name){
          itemAlreadyPickedUp = true;
          // Update text displayed if necessary
          $scope.updateSurroundings('picked up');
        }
      });
      // Check to make sure any items picked up in this area haven't already been used
      angular.forEach($scope.unlockedRooms, function(room){
        if($scope.current.newItem.unlocks == room){
          itemAlreadyPickedUp = true;
         }
      });
      // If item has never been picked up or used
      if(!itemAlreadyPickedUp){
        // Add the new item to the inventory
        GameItemFactory.add($scope.current.newItem);
        // Update our inventory
        $scope.inventory = GameItemFactory.getInventory();
        // Display message to show item picked up
        $scope.additionalMessage = '== "' + $scope.current.newItem.name + '" picked up ==';
      }
    }
      
  });
  }
  
  $scope.updateSurroundings = function(usedOrPickedUp){
    // Update surroundings based on whether an item has been used or picked up
    if($scope.current.canChange){
      if(usedOrPickedUp == 'picked up'){
        $scope.current.surroundings = $scope.current.surroundingsWhenItemPickedUp;  
       } else if (usedOrPickedUp == 'used'){
         $scope.current.surroundings = $scope.current.surroundingsWhenItemUsed; 
       } 
    } else {
      // Nothing to see here
    }
  }
  
  // Register player - currently only used in credits
  $scope.registerPlayer = function(name){
    $scope.playerName = name;
  }
  
  // Move in a given direction
  $scope.move = function(roomToMoveTo){
    $scope.update(roomToMoveTo);
    // Reset any additional message on the screen
    $scope.checkIfVisitedRoom();
    $scope.additionalMessage = '';
    $scope.otherPlayerInRoom = '';
  }
  
  // Check if room has been visited
  $scope.checkIfVisitedRoom = function(){
      var hasBeenVisited = false;
      angular.forEach($scope.visitedRooms, function(room){
        if(room.name == $scope.current.name){
          hasBeenVisited = true;
        }
      });
      if(!hasBeenVisited){
        // Add current room to visited rooms if not previously visited
        $scope.visitedRooms.push({"name" : $scope.current.name, "slug" : $scope.current.slug});  
      }
    }
  
  // Show item options
  $scope.showOptions = function(item){
    $scope.itemOptionsOpen = true;
    $scope.selectedItem = item;
  }
  
  // Cancel selected item
  $scope.clearSelectedItem = function(){
    $scope.selectedItem = '';
    // Close the inventory
    $scope.itemOptionsOpen = false; 
  }
  
  // Handle items that have been used
  $scope.discardItem = function(){
      // Discard current item
      GameItemFactory.remove($scope.selectedItem);
      // Keep a record of the items used so far
      $scope.unlockedRooms.push($scope.selectedItem.unlocks);
      // Clear the current selected item (which no longer exists anyway)
      $scope.clearSelectedItem();
      // Close inventory
      $scope.toggleInventory();
  }
  
  $scope.use = function(){
    $scope.additionalMessage = '';
    // checkItemResult returns true if the item can be used, and false if it can't
    var checkItemResult = GameItemFactory.use($scope.selectedItem.unlocks, $scope.current.directions);
    // Unlock any rooms associated with this item with the result from GameItemFactory.use
    if(checkItemResult){
      // Display message to say that item has been used
      $scope.additionalMessage = '== "' + $scope.selectedItem.name + '" used ==';
      // Update text displayed if necessary
      $scope.updateSurroundings('used');
      // Discard item
      $scope.discardItem();
    } else {
      // Item can't be used in this room
      $scope.additionalMessage = "== You can't do that here =="; 
    }
  }
  
  $scope.getCredits = CreditsFactory.getCredits().then(function(response){
    $scope.credits = response.data.credits;
  });
  
  // ============
  // Socket stuff
  // ============
  
  // When two players are in the same room, display a message to let them know they are not alone
  // This is handled in server.js
  socket.on('someoneElseIsHere', function(data){
    $scope.otherPlayerInRoom = data;
    $scope.$apply();
  });
}]);