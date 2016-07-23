describe('MainCtrl', function(){
  var $controller;
  var $rootScope;
  var $scope;
  
  beforeEach(module('projectArklay'))
  
  beforeEach(inject(function(_$controller_, _$rootScope_){
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    
    $controller('MainCtrl', {'$rootScope' : $rootScope, '$scope' : $scope})
    
  }))
  
  // Make sure that all of the default values are set up correctly
  describe('by default', function(){
    it('inventory should not be open', function(){
      expect($scope.inventoryOpen).toEqual(false);
    })
    
    it('item options should not be open', function(){
      expect($scope.itemOptionsOpen).toEqual(false);
    })
    
    it('show description should not be open', function(){
      expect($scope.showDescription).toEqual(false);
    })
    
    it('additional message should be empty', function(){
      expect($scope.additionalMessage).toEqual('');
    })
    
    it('item message should be empty', function(){
      expect($scope.itemMessage).toEqual('');
    })
    
    it('visited rooms should be an empty array', function(){
      expect($scope.visitedRooms).toEqual([]);
    })
    
    it('unlocked rooms should be an empty array', function(){
      expect($scope.unlockedRooms).toEqual([]);
    })
    
    it('credits should be an empty array', function(){
      expect($scope.credits).toEqual([]);
    })
  })
})