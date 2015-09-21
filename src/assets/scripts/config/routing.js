angular.module('projectArklay').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  // Default state
  $urlRouterProvider.otherwise("/start");
  
  // State Provider may not be necessary
  $stateProvider 
    .state('start', {
      url: '/start',
      templateUrl: 'views/start.html'
    })
    .state('inventory', {
      templateUrl: 'views/inventory.html'
    })
    .state('setup', {
      url: '/setup',
      templateUrl: 'views/setup.html'
    })
    .state('game', {
    url: '/game',
    templateUrl: 'views/game.html'
    })
    .state('credits', {
    url: '/credits',
    templateUrl: 'views/credits.html'
    })
  }
]);