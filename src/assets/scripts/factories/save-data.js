angular.module('projectArklay').factory('SaveDataFactory', function(){
  // Handle save data through local storage
  return{
    save:
    (currentRoom, inventory, map) => {
      if(typeof(localStorage) !== 'undefined'){
        localStorage.setItem('currentRoom', JSON.stringify(currentRoom))
        localStorage.setItem('inventory', JSON.stringify(inventory))
        localStorage.setItem('map', JSON.stringify(map))
        return true
      } else {
        // Can't save
        return false
      }
    },
    load:
    () => {
      if(typeof(localStorage) !== 'undefined'){
        let saveData = {}
        let currentRoom = localStorage.getItem('currentRoom')
        let inventory = localStorage.getItem('inventory')
        let map = localStorage.getItem('map')
        saveData.currentRoom = JSON.parse(currentRoom)
        saveData.inventory = JSON.parse(inventory)
        saveData.map = JSON.parse(map)
        // if currentRoom is null, then there is no save data held
        if(saveData.currentRoom !== null){
          return saveData
        } else {
          // No save data available
          return false
        }
      } else {
        // Can't load
        return false
      }
    }
  }
})
