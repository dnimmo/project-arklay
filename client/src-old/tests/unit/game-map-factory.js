describe('Game Map Factory', function(){
  var $httpBackend
  var GameMapFactory
  var UnlockedRoomsService
  var mockResponse
  var mockRoom
  var stubbedRoom = { 'slug' : 'start', 'name' : 'Foyer' }

  beforeEach(module('projectArklay'))

  beforeEach(inject(function(_$httpBackend_, _GameMapFactory_, _UnlockedRoomsService_){
    $httpBackend = _$httpBackend_
    GameMapFactory = _GameMapFactory_
    UnlockedRoomsService = _UnlockedRoomsService_
  }))

  it('should make a GET request for the starting room', function(){
    // Stubbing my expected response response here
    $httpBackend.whenGET('/rooms/start')
      .respond(stubbedRoom)

    // GameMapFactory.Init calls /rooms/start to set up the player's starting position
    GameMapFactory.init().then(function(response){
      mockResponse = response.data
    })
    // Fire any pending requests
    $httpBackend.flush()

    expect(mockResponse).toEqual(stubbedRoom)
  })

  it('should make a GET request for the correct room data', function(){
    $httpBackend.whenGET('/rooms/test')
      .respond(stubbedRoom)

    // GameMapFactory.checkLocation takes in a url to perform a GET request on
    GameMapFactory.checkLocation('/rooms/test').then(function(response){
      mockResponse = response.data
    })

    // Fire any pending requests
    $httpBackend.flush()

    // If checkLocation worked correctly, 
    // then the response should be the one defined at the top of this test
    expect(mockResponse).toEqual(stubbedRoom)
  })
  
  it('should be able to initialise an array of visited rooms', function(){
    var visitedRooms = GameMapFactory.initialiseVisitedRooms()
    expect(visitedRooms).toEqual([])
  })
  
  it('should be able to add rooms to the array of visited rooms', function(){
    var visitedRooms = GameMapFactory.initialiseVisitedRooms()
    GameMapFactory.addToVisitedRooms(stubbedRoom)
    expect(visitedRooms).toContain(stubbedRoom)
  })
  
  it('should be able to check if a room has been visited', function(){
    var result
    GameMapFactory.addToVisitedRooms(stubbedRoom)
    result = GameMapFactory.checkIfRoomHasBeenVisited(stubbedRoom)
    expect(result).toEqual(true)
  })
})