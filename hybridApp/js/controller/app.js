var app = angular.module('app', ['ui.router']);

app.service('userService', function($rootScope,$http) {
	$rootScope.tab=1;
})

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/monitor");
    
    $stateProvider
    .state('monitor', {
        url: '/monitor',
        controller: 'monitor',
        templateUrl: 'view/monitor.html'
    })
    .state('monitor_electric', {
        url: '/monitor_electric',
        controller: 'monitor_electric',
        templateUrl: 'view/monitor_electric.html'
    })
    .state('monitor_water', {
        url: '/monitor_water',
        controller: 'monitor_water',
        templateUrl: 'view/monitor_water.html'
    })
    .state('query', {
        url: '/query',
        controller: 'query',
        templateUrl: 'view/query.html'
    })
    .state('analysis', {
        url: '/analysis',
        controller: 'analysis',
        templateUrl: 'view/analysis.html'
    })
    .state('warning', {
        url: '/warning',
        controller: 'warning',
        templateUrl: 'view/warning.html'
    })
    .state('maintain', {
        url: '/maintain',
        controller: 'maintain',
        templateUrl: 'view/maintain.html'
    })
});
