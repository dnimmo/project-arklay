describe('Credits Factory', function () {
  var $httpBackend
  var CreditsFactory
  
  beforeEach(module('projectArklay'))
  
  beforeEach(inject(function(_$httpBackend_, _CreditsFactory_){
    $httpBackend = _$httpBackend_
    CreditsFactory = _CreditsFactory_
  }))
  
  it('should return the credits when requested with /credits', function(){
    var mockResponse
    var stubbedResponse = [
      {
        "credits" : "credits"
      }
    ]
    // Stubbing my expected response response here
    $httpBackend.whenGET('/credits')
      .respond(stubbedResponse)

    // CreditsFactory.getCredits calls /credits to return...well, the credits. :P
    CreditsFactory.getCredits().then(function(response){
      mockResponse = response.data
    })
    // Fire any pending requests
    $httpBackend.flush()

    expect(mockResponse).toEqual(stubbedResponse)
  })
  
})