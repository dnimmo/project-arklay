describe('Project Arklay', function () {
  
  beforeEach(module('projectArklay'))
  
  describe('Game Item Factory', function(){
    var GameItemFactory;
    var inventory;
    // window.Audio is mocked here as a function that doesn't do anything, because PhantomJS doesn't support HTML5's Audio API, so without mocking this here, the tests will fall over because it Audio won't be defined.
    window.Audio = function(){};
    
    beforeEach(inject(function(_GameItemFactory_){
      // Inject GameItemFactory into the test suite.
      GameItemFactory = _GameItemFactory_;
      // Make sure the inventory is empty for every test.
      inventory = '';
    }))
    
    it('should be able to initialise the player\'s inventory', function(){
      // getInventory returns the player's inventory. Inventory is initialised in GameItemFactory as an array, so calling getInventory without adding anything to the inventory first should return an empty array.
      inventory = GameItemFactory.getInventory();
      expect(inventory).toEqual([]);
    })
    
    it('should be able to add an item to the player\'s inventory', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not 
      GameItemFactory.add({name : 'test-item'}, false);
      expect(inventory.length).toBe(1);
    })
    
    it('should not be able to add an item to the player\'s inventory if it is already in the inventory', function(){
      // This is currently handled in the logic for the controller. It needs to be moved to the GameItemFactory, and then this test needs to be filled in
    })
    
    it('should be able to remove an item from the player\'s inventory', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory so that we can remove it again for the test. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not 
      GameItemFactory.add({name : 'test-item'}, false);
      // Remove the item we've just added, and expect the inventory to be empty
      GameItemFactory.remove({name : 'test-item'});
      expect(inventory).toEqual([]);
    })
    
    it('should be able to use an item in the player\'s inventory', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory so that we can use it in the test. The value of 'unlocks' is the room that is unlocked by this item. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not. 
      GameItemFactory.add({name : 'test-item', unlocks : 'test-room'}, false);
      // Set up the room that our test is in, with 'test-room' as a blocked direction 
      var testRoom = {name : 'current-test-room', directions : [{rel : 'North', link : 'test-room', blocked : true}]}
      // GameItemFactory.use takes the value of 'unlocks' from the current item, the directions available from the current location, and a true/false flag to say whether sound is enabled or not
      var testResult = GameItemFactory.use(inventory[0].unlocks, testRoom.directions, false);
      // GameItemFactory.use returns true if the item has been successfully used
      expect(testResult).toBe(true); 
    })

    it('should not allow an item to be used if it doesn\'t unlock any rooms surrounding the current room', function(){
      // Instantiate inventory
      inventory = GameItemFactory.getInventory();
      // Add an item to the inventory so that we can attempt to use it in the test. The value of 'unlocks' is the room that is unlocked by this item. The 'false' is passed because GameItemFactory.add takes a second parameter to say whether sound is enabled or not. 
      GameItemFactory.add({name : 'test-item', unlocks : 'test-room'}, false);
      // Set up the room that our test is in, with 'test-room' as a blocked direction 
      var testRoom = {name : 'current-test-room', directions : [{rel : 'North', link : 'test-room-2', blocked : true}]}
      // GameItemFactory.use takes the value of 'unlocks' from the current item, the directions available from the current location, and a true/false flag to say whether sound is enabled or not
      var testResult = GameItemFactory.use(inventory[0].unlocks, testRoom.directions, false);
      // GameItemFactory.use returns false if the item has not been successfully used
      expect(testResult).toBe(false);
    })
  })
});