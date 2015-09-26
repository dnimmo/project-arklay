describe('Save Data Factory', function(){
  var SaveDataFactory;
  
  beforeEach(module('projectArklay'))
  
  beforeEach(inject(function(_SaveDataFactory_){
    SaveDataFactory = _SaveDataFactory_;    
  }));
  
  it('should be able to save data', function(){
    // SaveDataFactory.save takes the current view-model, the inventory and the unlocked rooms.
    SaveDataFactory.save({slug : "current"}, "inventory", "unlocked");
    // Load the values we've just saved directly from local storage
    var testCurrent = localStorage.getItem('currentState');
    var testInventory = localStorage.getItem('inventory');
    var unlocked = localStorage.getItem('unlockedRooms');
    // SaveDataFactory.save prepends '/rooms/'
    expect(testCurrent).toEqual('/rooms/current');
    expect(testInventory).toEqual('"inventory"');
    expect(unlocked).toEqual('{"unlocked":"unlocked"}');
  });
  
  it('should be able to load existing data', function(){
    // SaveDataFactory.load returns an array of the state, inventory, and unlocked rooms.
    localStorage.setItem('currentState', '"test current state"');
    localStorage.setItem('inventory', '"test inventory"');
    localStorage.setItem('unlockedRooms', '"test unlocked rooms"');
    var test = SaveDataFactory.load();
    expect(test).toEqual({currentState: '"test current state"', inventory: 'test inventory', unlockedRooms: 'test unlocked rooms'});
  });
});
