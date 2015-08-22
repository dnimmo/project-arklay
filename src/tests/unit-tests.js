describe('Testing Project Arklay', function () {
  // Load the projectArklay module before each test
  beforeEach(module('projectArklay'));
  beforeEach(module(function($provide){
               GameMapFactory = _GameMapFactory_;
             }));
  
  it('Should probably do something', function() {
    expect(true).toBe(true);
  });
});