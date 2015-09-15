describe('Project Arklay', function () {
  
  beforeEach(module('projectArklay'))
  
  describe('Game Item Factory', function(){
    var GameItemFactory;
    var inventory;
    var testItem;
    // window.Audio is mocked here as a function that doesn't do anything, because PhantomJS doesn't support HTML5's Audio API, so without mocking this here, the tests will fall over because Audio won't be defined.
    window.Audio = function(){};
    
    beforeEach(inject(function(_GameItemFactory_){
      // Inject GameItemFactory into the test suite.
      GameItemFactory = _GameItemFactory_;
      // Make sure the inventory is empty for every test.
      inventory = '';
      testItem = {name : 'test-item', unlocks : 'test-room'};
    }))
    
    it('should be able to initialise the player\'s inventory', function(){
      // getInventory returns the player's inventory. Inventory is initialised in GameItemFactory as an array, so calling getInventory without adding anything to the inventory first should return an empty array.
      inventory = GameItemFactory.getInventory();
      expect(inventory).toEqual([]);
    })
    
    it('should be able to add an item to the player\'s inventory', function(){
      // Initialise inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not 
      GameItemFactory.add(testItem, false);
      expect(inventory.length).toEqual(1);
    })
    
    it('should be able to add an item to the player\'s inventory', function(){
      // Initialise inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not 
      GameItemFactory.add(testItem, false);
      expect(inventory.length).toBe(1);
    })
    
    it('should be able to tell if an item is already in the inventory', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not 
      GameItemFactory.add(testItem, false);
      var testResult = GameItemFactory.checkIfItemAlreadyHeld(testItem);
      expect(testResult).toEqual(true);
    })
    
    it('should be able to remove an item from the player\'s inventory', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory so that we can remove it again for the test. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not 
      GameItemFactory.add(testItem, false);
      // Remove the item we've just added, and expect the inventory to be empty
      GameItemFactory.remove(testItem);
      expect(inventory).toEqual([]);
    })
    
    it('should be able to use an item in the player\'s inventory', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory so that we can use it in the test. The value of 'unlocks' is the room that is unlocked by this item. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not. 
      GameItemFactory.add(testItem, false);
      // Set up the room that our test is in, with 'test-room' as a blocked direction 
      var testRoom = {name : 'current-test-room', directions : [{rel : 'North', link : 'test-room', blocked : true}]}
      // GameItemFactory.use takes the value of 'unlocks' from the current item, the directions available from the current location, and a true/false flag to say whether sound is enabled or not
      var testResult = GameItemFactory.use(inventory[0].unlocks, testRoom.directions, false);
      // GameItemFactory.use returns true if the item has been successfully used
      expect(testResult).toEqual(true); 
    })
    
    it('should be able to tell if an item has not yet been used', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // GameItemFactory.checkIfItemHasAlreadyBeenUsed checks the value of item.unlocks against an array of rooms that have been unlocked, and returns false if there is no match, indicating that the item has not been used
      var unlockedRooms = [];
      var testResult = GameItemFactory.checkIfItemHasAlreadyBeenUsed(testItem, unlockedRooms);
      expect(testResult).toEqual(false);
    })
    
    it('should be able to tell if an item has already been used', function(){
      // There are two reasons it may need to know this: One being that you don't want the game to give the player an item that they've already used (as it would no longer be in their inventory, the game would attempt to do this), and the other being that if an item has already been used, you want any effect it had to remain active
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // GameItemFactory.checkIfItemHasAlreadyBeenUsed checks the value of item.unlocks against an array of rooms that have been unlocked, and returns true if it finds a match
      var unlockedRooms = ['test-room'];
      var testResult = GameItemFactory.checkIfItemHasAlreadyBeenUsed(testItem, unlockedRooms);
      expect(testResult).toEqual(true);
    })

    it('should not allow an item to be used if it doesn\'t unlock any rooms surrounding the current room', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory so that we can attempt to use it in the test. The value of 'unlocks' is the room that is unlocked by this item. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not. 
      GameItemFactory.add(testItem, false);
      // Set up the room that our test is in, with 'test-room' as a blocked direction 
      var testRoom = {name : 'current-test-room', directions : [{rel : 'North', link : 'test-room-2', blocked : true}]}
      // GameItemFactory.use takes the value of 'unlocks' from the current item, the directions available from the current location, and a true/false flag to say whether sound is enabled or not
      var testResult = GameItemFactory.use(testItem.unlocks, testRoom.directions, false);
      // GameItemFactory.use returns false if the item has not been successfully used
      expect(testResult).toEqual(false);
    })
  })
});