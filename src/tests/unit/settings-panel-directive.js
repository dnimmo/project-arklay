describe('Settings Panel Directive', function(){
  var $compile;
  var $httpBackend;
  var $rootScope;
  var element;
  var scope;
  
  beforeEach(module('projectArklay'))
  
  beforeEach(inject(function(_$compile_, _$httpBackend_, _$rootScope_){
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    element = '<settings-panel></settings-panel>';
    scope = $rootScope.$new();
    
    // Since all http requests are processed locally, 
    // I need to tell it to actually do the http request for the directive template
    //$httpBackend.whenGET('directive-templates/settings-panel.html').passThrough();
    
    //element = $compile(element)(scope);
    scope.$digest();
  }))
  
  it('should have a scope.test for no reason', function(){
    //expect(scope.test).toEqual('test');
  });
})

// THIS IS UNFINISHED - YOU WERE TRYING TO FIGURE OUT HOW TO TEST ISOLATE SCOPE IN A DIRECTIVE BY PUTTING A FAKE SCOPE THING INTO THE SETTINGS PANEL DIRECTIVE. 