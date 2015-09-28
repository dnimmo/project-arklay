angular.module('projectArklay').service('UnlockedRoomsService', [function() {
  // Keep a record of all rooms that have been unlocked.
  // This is only really required to give a sensible mechanism for allowing rooms that need more than one item to unlock.
  var unlockedRooms = [];
  
  return function(unlockedRoom){
    if(unlockedRoom){
      var roomAlreadyRegistered = false;
      angular.forEach(unlockedRooms, function(room){
        if(room == unlockedRoom){
          roomAlreadyRegistered = false; 
        }
      })
      unlockedRooms.push(unlockedRoom); 
    }
    return unlockedRooms;
  }
}]);