angular.module('projectArklay').factory('SaveDataFactory', function(){
  // Handle save data through local storage
  return{
    save:
    function(currentState, inventory, unlockedRooms){
      var unlockedRoomsObject = {unlocked : unlockedRooms}
      if(typeof(localStorage) !== 'undefined'){
        localStorage.setItem('currentState', '/rooms/'+currentState.slug);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('unlockedRooms', JSON.stringify(unlockedRoomsObject));
        return true;
      } else {
        // Can't save
        return false;
      }
    },
    load:
    function(){
      if(typeof(localStorage) !== 'undefined'){
        var saveData = {};
        var currentState = localStorage.getItem('currentState');
        var inventory = localStorage.getItem('inventory');
        var unlockedRooms = localStorage.getItem('unlockedRooms');
        saveData.currentState = currentState;
        saveData.inventory = JSON.parse(inventory);
        saveData.unlockedRooms = JSON.parse(unlockedRooms);
        // if currentState is null, then there is no save data held
        if(saveData.currentState !== null){
          return saveData; 
        } else {
          // No save data available
          return false;
        };
      } else {
        // Can't load
        return false;
      }
    }
  }
});
