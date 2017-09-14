/*
* store 360 system
* date:2017-09-13
* */
var storeWeb = angular.module('storeWeb', ['ui.bootstrap', 'ui.router']);

storeWeb.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/blank");
    storeWeb.stateProvider = $stateProvider;

    $stateProvider.state('blank', {
        url: '/blank',
        controller: 'blank',
        templateUrl: 'dist/view/blank.html'
    }).state('humiture', {
        url: '/humiture',
        controller: 'humiture',
        templateUrl: 'dist/view/humiture.html'
    })
});

