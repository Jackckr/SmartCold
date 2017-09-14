/*
* store 360 system
* date:2017-09-13
* */
var storeWeb = angular.module('storeWeb', ['ui.bootstrap', 'ui.router', 'ngCookies']);
angular.element(document).ready(function() {
    $.ajax({
        url: '',
        type: 'GET',
        dataType: 'json',
        cache: false,
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).done(function(data) {
        user = data;
        if(user.username == null){document.location.href = "/login.html";return; }
        angular.bootstrap(document, ['storeWeb']);
    });
});


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

