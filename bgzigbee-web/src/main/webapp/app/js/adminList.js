coldWeb.controller('adminlist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
    $scope.Alladmins = "";
    $scope.admin = "";
    // 获取当前冷库的列表
    $http.get('/i/admin/findAdminList').success(function (data) {
        $scope.Alladmins = data;
    });
    $http.get('/i/admin/findAdmin').success(function(data){
    	$scope.admin = data;
    });
    $scope.goDeleteAdmin = function (adminID) {
    	$http.get('/i/admin/deleteAdmin', {
            params: {
                "adminID": adminID
            }
        }).success(function (data) {
        });
    	$state.reload();
    }
});
