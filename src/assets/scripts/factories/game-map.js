angular.module('projectArklay').factory('GameMapFactory', ['$http', function($http) {
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