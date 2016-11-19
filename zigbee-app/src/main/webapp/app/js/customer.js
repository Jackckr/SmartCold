var app = angular.module('app', []);
 app.controller('ctrl', function($http, $location,$scope) {
	 $scope.msgTotalNum = window.localStorage.msgTotalNum;
 });
	



