angular.module('projectArklay').factory('GameMapFactory', ['$http', 'UnlockedRoomsService', function($http, UnlockedRoomsService) {
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
    function(saveData){
      if(saveData){
        unlockedRooms = saveData;
      }
      return unlockedRooms;
    },
    checkIfSurroundingsAreUnlocked:
    function(surroundings, itemsUsed){
      var unlockedSurroundings = [];
      if(itemsUsed.length != 0){
        
        angular.forEach(surroundings, function(direction){
          // Loop through the surroundings
          var unlockRequirementsMet = 0;
          
          angular.forEach(itemsUsed, function(item){
            // Loop through the items that have been used
            if(direction.unlockedWith && direction.unlockedWith.length > 1){
              // If you need multiple items for this room
              
              angular.forEach(direction.unlockedWith, function(unlockRequirement){
                // Loop through all the unlock requirements for this direction
                if(unlockRequirement == item){
                  unlockRequirementsMet += 1;
                }
                if(unlockRequirementsMet == direction.unlockedWith.length){
                  // If you only need one item for this room, then it's unlocked already
                  unlockedSurroundings.push(direction.link);
                }
              }); 
            } else if(direction.unlockedWith && item == direction.unlockedWith){
              unlockedSurroundings.push(direction.link);
            }
          });
        });
      }
      return unlockedSurroundings;
    }
  }
}]);