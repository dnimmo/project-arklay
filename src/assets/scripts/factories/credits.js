angular.module('projectArklay').factory('CreditsFactory', ['$http', function($http){
  // Just gets the credits from /credits - nothing fancy here
  return {
    getCredits: 
      function(){
        return $http.get('/credits')
      }
  }
}])
