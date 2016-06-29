coldWeb.controller('home', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.load = function(){
		$http.get('/i/admin/findAdmin').success(function(data){
			$rootScope.admin = data;
			if($rootScope.admin == null || $rootScope.admin.id == 0){
				url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
				window.location.href = url;
			}
	})
}
	$scope.load();
	$scope.Allusers = "";
    // 获取当前冷库的列表
    $http.get('/i/user/findUserList').success(function (data) {
        $scope.Allusers = data;
    });
    $scope.logout = function () {
    	$http.get('/i/admin/logout');
    	$scope.admin = null;
    	url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
		window.location.href = url;
    };
    $scope.goDeleteUser = function (userID) {
    	
        $state.go('home');
    }
});
