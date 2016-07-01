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
    $scope.Alladmins = [];
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
    
    $scope.deleteAdmins = function(){
    	var adminIDs = [];
    	for(i in $scope.selected){
    		adminIDs.push($scope.selected[i].id);
    	}
    	if(adminIDs.length >0 ){
    		$http({
    			method:'DELETE',
    			url:'/i/admin/deleteByAdminIDs',
    			params:{
    				'adminIDs': adminIDs
    			}
    		}).success(function (data) {
            });
    	}
    	window.location.reload(); 
    }
    
    $scope.selected = [];
    $scope.toggle = function (admin, list) {
		  var idx = list.indexOf(admin);
		  if (idx > -1) {
		    list.splice(idx, 1);
		  }
		  else {
		    list.push(admin);
		  }
    };
    $scope.exists = function (admin, list) {
    	return list.indexOf(admin) > -1;
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.Alladmins.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.Alladmins.length) {
        	$scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        	$scope.selected = $scope.Alladmins.slice(0);
        }
    };
    
    function checkInput(){
        var flag = true;
        // 检查必须填写项
        if ($scope.adminname == undefined || $scope.adminname == '') {
            flag = false;
        }
        if ($scope.adminpwd == undefined || $scope.adminpwd == '') {
            flag = false;
        }
        return flag;
    }

    
    
    $scope.submit = function(){
        if (checkInput()){
            $http({
            	method : 'GET', 
    			url:'/i/admin/addAdmin',
    			params:{
    				'adminname':  $scope.adminname,
    				'adminpwd': $scope.adminpwd,
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
