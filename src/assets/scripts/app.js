var app = angular.module('projectMud', ['ui.router']);

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
  return{    
    init:
      function(){
        return $http.get('/rooms/start');
      },
    checkLocation: 
      function(current){
        // Get info from [url]/rooms/[slug]. Room info is all stored in src/assets/resources/map.json 
        return $http.get(current);
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
  $scope.visitedRooms = [];
  $scope.unlockedRooms = [];
  $scope.credits = [];
  
  GameMapFactory.init()
    .then(function(response){
      // Set starting info
      $scope.current = response.data;
    });
  
  $scope.playerName;
  // GameMapFactory.checkLocation returns a promise which then returns the data for the current room
  $scope.update = function(roomToMoveTo){
    GameMapFactory.checkLocation(roomToMoveTo).then(function(response){
    // Assign promise response to $scope.current
    $scope.current = response.data;
      
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
      }
    }
      
  });
  }
  
  // Register player - currently only used in credits
  $scope.registerPlayer = function(name){
    $scope.playerName = name;
  }
  
  // Move in a given direction
  $scope.move = function(roomToMoveTo){
    $scope.update(roomToMoveTo);
    // reset any additional message on the screen
    $scope.checkIfVisitedRoom();
    $scope.additionalMessage = '';
  }
  
  // Check if room has been visited
  $scope.checkIfVisitedRoom = function(){
      var hasBeenVisited = false;
      angular.forEach($scope.visitedRooms, function(room){
        if(room == $scope.current.name){
          hasBeenVisited = true;
        }
      });
      if(!hasBeenVisited){
        // Add current room to visited rooms if not previously visited
        $scope.visitedRooms.push($scope.current.name);  
      }
      console.log($scope.visitedRooms);
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
  }
  
  $scope.use = function(){
    $scope.additionalMessage = '';
    // checkItemResult returns true if the item can be used, and false if it can't
    var checkItemResult = GameItemFactory.use($scope.selectedItem.unlocks, $scope.current.directions);
    // Unlock any rooms associated with this item with the result from GameItemFactory.use
    if(checkItemResult){
      // Discard item
      $scope.discardItem();
    } else {
      // Item can't be used in this room
      $scope.additionalMessage = "You can't do that here"; 
    }
  }
  
  $scope.getCredits = CreditsFactory.getCredits().then(function(response){
    $scope.credits = response.data.credits;
  });
}]);