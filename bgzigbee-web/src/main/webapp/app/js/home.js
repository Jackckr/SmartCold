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
	$scope.Allusers = [];
    // 获取当前冷库的列表
    $http.get('/i/user/findUserList').success(function (data) {
        $scope.Allusers = data;
    });
    $scope.logout = function () {
    	$http.get('/i/admin/logout').success(function (data) {
        });
    	$scope.admin = null;
    	alert("注销成功");
    	url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
		window.location.href = url;
    };
    $scope.goDeleteUser = function (userID) {
    	$http.get('/i/user/deleteUser', {
            params: {
                "userID": userID
            }
        }).success(function (data) {
        });
    	$state.reload();
    }
    $scope.deleteUsers = function(){
    	var userIDs = [];
    	for(i in $scope.selected){
    		userIDs.push($scope.selected[i].id);
    	}
    	if(userIDs.length >0 ){
    		$http({
    			method:'DELETE',
    			url:'/i/user/deleteByUserIDs',
    			params:{
    				'userIDs': userIDs
    			}
    		}).success(function (data) {
            });
    	}
    	window.location.reload(); 
    }
   
    
    $scope.selected = [];
    $scope.toggle = function (user, list) {
		  var idx = list.indexOf(user);
		  if (idx > -1) {
		    list.splice(idx, 1);
		  }
		  else {
		    list.push(user);
		  }
    };
    $scope.exists = function (user, list) {
    	return list.indexOf(user) > -1;
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.Allusers.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.Allusers.length) {
        	$scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        	$scope.selected = $scope.Allusers.slice(0);
        }
    };
});
