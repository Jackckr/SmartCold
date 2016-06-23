coldWeb.controller('adminlist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.load = function(){
			$http.get('/i/admin/findAdmin').success(function(data,status,config,headers){
				$rootScope.admin = data;
				if($rootScope.admin == null || $rootScope.admin.id == 0){
					url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
					window.location.href = url;
				}
		})
	}
	$scope.load();
    $scope.Alladmins = "";
    $scope.admin = "";
    // 获取当前冷库的列表
    $http.get('/i/admin/findAdminList').success(function (data) {
        $scope.Alladmins = data;
    });
    $http.get('/i/admin/findAdmin').success(function(data){
    	$scope.admin = data;
    });
    $scope.logout = function () {
    	$http.get('/i/admin/logout');
    	$scope.admin = null;
    	url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
		window.location.href = url;
    };
});
