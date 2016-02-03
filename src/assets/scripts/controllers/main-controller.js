angular.module('projectArklay').controller('MainCtrl', ['$http', '$scope', 'CreditsFactory', 'SaveDataFactory', function($http, $scope, CreditsFactory, SaveDataFactory) {
  
  // ========================================================== //
  // ===================== Classes ============================ //
  // ========================================================== //
  
  class Map {
    constructor(rooms = []) {
      this.rooms = rooms
    }
    
    addRoom(newRoom){
      let roomIsInMap = false
      angular.forEach(this.rooms, (room) =>{
        if(room.data.slug == newRoom.slug){
          roomIsInMap = true
        }              
      })
      if(!roomIsInMap){
        newRoom = new Room(newRoom)
        this.rooms.push(newRoom)
      }
    }
    
    getNewRoom(newRoomSlug){
      vm.current.visit()
      vm.current.clearMessage()
      angular.forEach(this.rooms, (room) =>{
        if(newRoomSlug == '/rooms/'+room.data.slug){
          vm.current = room
          this.prepareSurroundingRooms()
          vm.current.checkForDescriptionUpdates()
          vm.current.checkForItems()
          SaveDataFactory.save(vm.current, vm.inventory, vm.map)
          return
        }
      })
    }
    
    getStartingRoom(){
      return $http.get('/rooms/start', {cache:true})
    }
    
    loadMap(){
      angular.forEach(vm.saveData.map.rooms, (room) =>{
        this.addRoom(room.data)
      })
    }
    
    prepareSurroundingRooms(){
      vm.current.availableDirections = []
      // Get rooms to add to the map
      angular.forEach(vm.current.data.directions, (direction) => {
        vm.current.availableDirections.push(direction)
        $http.get(direction.link, {cache: true}).then((response) =>{
          this.addRoom(response.data)
        })
      })
    }
  }
  
  class Room {
    // "data" contains the room object which can be found in src/assets/resources/map.json
    constructor(data){
      this.data = data
      this.visited = false
      this.message = ''
    }
    
    checkForItems(){
      if(this.data.newItem){
        const newItem = new Item(this.data.newItem.name, this.data.newItem.image, this.data.newItem.description, this.data.newItem.messageWhenUsed, this.data.newItem.canBeUsedIn, this.data.newItem.unlocks, this.data.newItem.soundWhenUsed, this.data.newItem.messageWhenNotUsed)
        vm.inventory.add(newItem)
      }
    }
    
    checkNeighbouringLocks(){
      // Checks to see if any neighbouring rooms have been unlocked based on the items that have been used
      angular.forEach(this.data.directions, (direction) => {
        if(direction.blocked){
          let unlockRequirementsMet = 0
          // Check used items in inventory to see if direction has been unlocked
          // Doors can require more than one item to be unlocked, hence the additional loop
          angular.forEach(vm.inventory.itemsUsed, (itemName) => {
            if(itemName.name == direction.unlockedWith){
              if(direction.unlockedWith.length == 1){
                this.unlockNeighbour(direction)
                return
              } else {
                unlockRequirementsMet += 1
                if(unlockRequirementsMet == direction.unlockedWith.length){
                  this.unlockNeighbour(direction)
                  return
                }      
              }  
            }
          })
        }
      })
    }
    
    checkForDescriptionUpdates(){
      if(this.visited && this.data.canChange && this.data.surroundingsWhenItemPickedUp){
        this.updateDescriptionForItemPickedUp()
      }
    }
    
    clearMessage(){
      this.message = ''
    }
    
    displayMessage(message){
      this.message = '== '+message+' =='
    }
    
    loadRoom(){
      this.data = vm.saveData.currentRoom.data
    }
    
    unlockNeighbour(direction){
      direction.blocked = false
    }
    
    // Room descriptions change when an item is picked up or used
    updateDescriptionForItemPickedUp(){
      this.data.surroundings = this.data.surroundingsWhenItemPickedUp
    }
    
    updateDescriptionForItemUsed(){
      this.data.surroundings = this.data.surroundingsWhenItemUsed
    }
    
    visit(){
      this.visited = true
    }
  }
  
  class Inventory {
    constructor(usableItems = []){
      this.itemsUsed = []
      this.newItemSound = new Audio('../assets/sounds/newItemChime.mp3')
      this.open = false
      this.usableItems = []
      this.selectedItem = {}
      this.itemOptionsOpen = false
      this.message = ''
    }
    
    add(item){
      const newItem = new Item(item.name, item.image, item.description, item.messageWhenUsed, item.canBeUsedIn, item.unlocks, item.soundWhenUsed, item.messageWhenNotUsed, item.hasBeenUsed)
      this.usableItems.push(newItem)
      // If vm.current doesn't exist at this point, save data has just been loaded, so we don't want to display messages or play any sounds
      if(vm.current){
        this.newItemSound.play()
        vm.current.displayMessage('"'+ newItem.name + '" picked up')
        // Remove the item from the current room
        vm.current.data.newItem = false
      }
    }
    
    addToItemsUsed(item){
      this.itemsUsed.push(item)
    }
    
    clearMessage(){
      this.message = ''
    }
    
    clearSelectedItem(){
      this.toggleItemOptionsOpen()
      this.selectedItem = {}
    }
    
    displayMessage(message){
      this.message = '== '+message+' =='
    }
    
    loadInventory(){
      angular.forEach(vm.saveData.inventory.items, (loadedItem) =>{
        this.add(loadedItem)
      })
      angular.forEach(vm.saveData.inventory.itemsUsed, (itemUsed) =>{
        this.processItemUsed(itemUsed)
      })
    }
    
    updateSelectedItem(item){
      this.selectedItem = item
    }
    
    processItemUsed(item, message){
      this.clearSelectedItem()
      this.addToItemsUsed(item)
      this.updateUsableItems(item)
      this.itemOptionsOpen = false
      this.open = false
      // If vm.current doesn't exist here, data has just been loaded: don't amend current room details
      if(vm.current){
        vm.current.updateDescriptionForItemUsed()
        vm.current.displayMessage(message)
      }
    }
    
    selectItem(item){
      this.selectedItem = item
      this.toggleItemOptionsOpen()
    }
    
    toggleItemOptionsOpen(){
      // Open or close the the options panel for a single item
      this.itemOptionsOpen = !this.itemOptionsOpen
      this.clearMessage()
    }
    
    toggleOpen(){
      // Open or close the inventory panel
      this.open = !this.open
    }
    
    updateUsableItems(item){
      this.usableItems.splice(this.usableItems.indexOf(item), 1)
    }
  }
  
  class Item {
    constructor(name, image, description, messageWhenUsed, canBeUsedIn, unlocks, soundWhenUsed, messageWhenNotUsed, hasBeenUsed = false){
      this.name = name
      this.image = image
      this.description = description
      this.highlighted = false
      this.messageWhenUsed = messageWhenUsed
      this.canBeUsedIn = canBeUsedIn
      this.unlocks = unlocks
      this.soundWhenUsed = soundWhenUsed
      this.messageWhenNotUsed = messageWhenNotUsed
      this.hasBeenUsed = hasBeenUsed
      this.errorSound = new Audio('../assets/sounds/error.mp3')
    }
    
    checkIfUsableInCurrentRoom(){
      // Hand off to either use() or denyUse() depending on whether the item is usable or not
      if(this.canBeUsedIn == vm.current.data.slug){
        this.use()
        vm.current.checkNeighbouringLocks()
      } else {
        this.denyUse()
      }
    }
    
    denyUse(){
      // Notify the player that they can't use the item in the current room
      this.errorSound.play()
      vm.inventory.displayMessage(this.messageWhenNotUsed)
    }
    
    loadItemUsed(){
      this.hasBeenUsed = true
      vm.inventory.processItemUsed(this, '')
    }
    
    playSoundEffect(){
      const soundEffect = new Audio(this.soundWhenUsed)
      soundEffect.play()
    }
    
    use(){
      this.playSoundEffect()
      this.hasBeenUsed = true
      vm.inventory.processItemUsed(this, this.messageWhenUsed)
    }
  }
  
  // ========================================================== //
  // ================== View Model ============================ //
  // ========================================================== //

  const vm = $scope
  vm.credits = []
  vm.inventory = new Inventory()
  vm.itemOptionsOpen = false
  vm.localStorageEnabled
  vm.map = new Map()
  vm.saveData = SaveDataFactory.load()
  vm.showDescription = false
  let selectedItemNumber = 0

  if(typeof(localStorage) !== 'undefined'){
    vm.localStorageEnabled = true
  }
  
  // Set background music
  const backgroundMusic = new Audio('../assets/sounds/backgroundMusic.mp3')
  backgroundMusic.playbackRate = .8
  
  // Load an existing saved game
  vm.loadGame = () => {
    vm.map.loadMap()
    // Load the inventory before the current room, to make it easier to tell if a game has just been loaded or not
    vm.inventory.loadInventory()
    vm.current = new Room(vm.saveData.currentRoom.data)
    vm.map.prepareSurroundingRooms()
  }
  
  // Start a new game
  vm.newGame = () => {
    // Initialise the game from /rooms/start
    // This creates the first room, and then creates all of the surrounding rooms so that they're available for the player to move in to
    vm.map.getStartingRoom().then((response) =>{
      vm.current = new Room(response.data)
      vm.map.prepareSurroundingRooms()
    })
  }
  
  // If vm.current doesn't exist by this point force a hard refresh - something's gone wrong.
  if(!vm.current){
    window.location = window.location.origin+'#'
  }

  vm.getCredits = CreditsFactory.getCredits().then(function(response){
    vm.credits = response.data.credits
  })
  
  vm.handleBackgroundMusic = () => {
    backgroundMusic.loop = true
    backgroundMusic.volume = 0.6
    backgroundMusic.play()
  }() // Invoke this immediately - unfortunately Android won't allow it to be invoked without a button press, so it's also called when the game starts
  
  vm.handleKeyboard = (event) => {
    // @TODO: Tidy all this up
    if(vm.current){
      if(vm.inventory.usableItems.length !== 0 && event.keyCode === 73) {
        // Open/Close inventory when the user presses 'i'
        vm.inventory.toggleOpen()
        vm.inventory.updateSelectedItem(vm.inventory.usableItems[selectedItemNumber])
      } 
        
      if(vm.inventory.open && !vm.inventory.itemOptionsOpen) {
        vm.inventory.clearMessage()
        // Inventory controls
        switch(event.keyCode) {
          case 27:
            // 'esc' key
            vm.inventory.clearSelectedItem()
            vm.inventory.toggleOpen()
            vm.inventory.toggleItemOptionsOpen()
            break
          case 13:
            // 'enter' key
            vm.inventory.usableItems[selectedItemNumber].checkIfUsableInCurrentRoom()
            break
          case 37:
            // 'left arrow' key
            if(selectedItemNumber === 0) {
              selectedItemNumber = vm.inventory.usableItems.length-1
            } else {
              selectedItemNumber -= 1
            }
            vm.inventory.updateSelectedItem(vm.inventory.usableItems[selectedItemNumber])
            break
          case 39:
            // 'right arrow' key
            if(selectedItemNumber === vm.inventory.usableItems.length-1) {
              selectedItemNumber = 0
            } else {
              selectedItemNumber += 1
            }
            vm.inventory.updateSelectedItem(vm.inventory.usableItems[selectedItemNumber])
            break
        }
      } else if (vm.inventory.itemOptionsOpen) {
        switch (event.keyCode) {
          case 27:
            // 'esc' key
            vm.inventory.itemOptionsOpen = false
            break
          case 13:
            // 'enter' key
            vm.inventory.selectedItem.checkIfUsableInCurrentRoom()
            break
        }
      } else {
        // Handle movement
        const north = {}, 
              east = {}, 
              west = {}, 
              south = {},
              credits = {}
        angular.forEach(vm.current.availableDirections, function(direction) {
          switch(direction.rel) {
            case 'north':
              if (!direction.blocked) north.available = true
              north.link = direction.link
              break
            case 'upstairs':
              if (!direction.blocked) north.available = true
              north.link = direction.link
              break
            case 'east':
              if (!direction.blocked) east.available = true
              east.link = direction.link
              break
            case 'west':
              if (!direction.blocked) west.available = true
              west.link = direction.link
              break
            case 'south':
              if (!direction.blocked) south.available = true
              south.link = direction.link
              break
            case 'downstairs':
              if (!direction.blocked) south.available = true
              south.link = direction.link
              break
            case 'Roll credits':
              credits.available = true
              credits.link = direction.link
          }
        })
        switch(event.keyCode) {
          case 38:
            // 'Up' arrow key
            if(north.available) {
              vm.map.getNewRoom(north.link)
            }
            break
          case 39:
            // 'Right' arrow key
            if(east.available) {
              vm.map.getNewRoom(east.link)
            }
            break
          case 37:
            // 'Left' arrow key
            if(west.available) {
              vm.map.getNewRoom(west.link)
            }
            break
          case 40:
            // 'Down' arrow key
            if(south.available) {
              vm.map.getNewRoom(south.link)
            }
            break
          case 13:
            // 'Enter' key
            if(credits.available) {
              window.location.href='/#/credits'
              vm.playCreditsSound()
            }
        }
      }
    }
  }
  
  vm.playCreditsSound = () => {
    const creditsMusic = new Audio('../assets/sounds/credits.mp3')
    const creditsSound = new Audio('../assets/sounds/radioChatter.mp3')
    creditsSound.playbackRate = 1
    backgroundMusic.volume = 0
    creditsMusic.play()
    creditsSound.play()
  }
}])
