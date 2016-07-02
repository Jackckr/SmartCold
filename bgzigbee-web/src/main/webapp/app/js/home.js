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
	$scope.optAudit = '8';
	 // 获取当前冷库的列表
	$scope.initTable = function(pageNum,pageSize){
	    $http({method:'GET',url:'/i/user/findUserList',params:{pageNum : pageNum,pageSize : pageSize, audit:$scope.optAudit}}).success(function (data) {
	    	$scope.Allusers = data;
	    });
    }
    // 显示最大页数
    $scope.maxSize = 8;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.pageChanged = function () {
    	 $scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    }
    $scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    
    $scope.auditChanged = function(optAudiet){
    	$scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    }
    
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
    
    
    function checkInput(){
        var flag = true;
        // 检查必须填写项
        if ($scope.username == undefined || $scope.username == '') {
            flag = false;
        }
        if ($scope.password == undefined || $scope.password == '') {
            flag = false;
        }
        return flag;
    }

    
    
    $scope.submit = function(){
        if (checkInput()){
            $http({
            	method : 'GET', 
    			url:'/i/user/addUser',
    			params:{
    				'username':  $scope.username,
    				'password': $scope.password,
    				'email' : $scope.email,
    				'telephone' : $scope.telephone
    			}
    		}).then(function (resp) {
                alert("添加成功");
                window.location.reload(); 
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        } else {
            alert("请填写用户名或密码!");
        }
    }
});
