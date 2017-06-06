checkLogin();
function initdata() {
}
angular.module('message', []).controller('message', function($scope,$http, $timeout){
    $http.defaults.withCredentials=true;
    $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	$.ajax({ url: ER.root+"/i/UtilController/setVisited",type: "POST",data:{type:6}});



});