describe('Unlocked Rooms Service', function(){
  var UnlockedRoomsService;
  
  beforeEach(module('projectArklay'));
  
  beforeEach(inject(function(_UnlockedRoomsService_){
    UnlockedRoomsService = _UnlockedRoomsService_;
  }));
  
  it('should be able to return a list of unlocked rooms', function(){
    UnlockedRoomsService('test-room');
    var unlockedRooms = UnlockedRoomsService();
    expect(unlockedRooms).toEqual(['test-room']);
  });
});