coldWeb.controller('adminlist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/admin/findAdmin'}).success(function(data){
				$rootScope.admin = data.entity;
				if($rootScope.admin == null || $rootScope.admin.id == 0){
					url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
					window.location.href = url;
				}
		});
	};
	$scope.load();
    $scope.Alladmins = [];
    $scope.admin = "";
    // 显示最大页数
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    
    
    $scope.getAdmins = function() {
		$http({
			method : 'POST',
			url : '/i/admin/findAdminList',
			params : {
				pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize,
				keyword : $scope.keyword
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
	    	$scope.Alladmins = data.list;
		});
	}

	$scope.pageChanged = function() {
		$scope.getAdmins();
	}
	$scope.getAdmins();
    
	$scope.goSearch = function () {
		$scope.getAdmins();
    }
	
	 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/admin/findAdmin'}).success(function(data){
    	$scope.admin = data.entity;
    });
    
	function delcfm() {
        if (!confirm("确认要删除？")) {
            return false;
        }
        return true;
    }
    $scope.goDeleteAdmin = function (adminID) {
    	if(delcfm()){
    	$http.get('/i/admin/deleteAdmin', {
            params: {
                "adminID": adminID
            }
        }).success(function (data) {
        });
    	$state.reload();
    	}
    }
    
    $scope.deleteAdmins = function(){
    	if(delcfm()){
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

	    
    $scope.submit = function() {
		if (checkInput()) {
			if ($scope.adminpwd == $scope.password1) {
				$http({
					method : 'GET',
					url : '/i/admin/addAdmin',
					params : {
						'adminname' : encodeURI($scope.adminname, "UTF-8"),
						'adminpwd' : $scope.adminpwd,
						'email' : $scope.email,
						'telephone' : $scope.telephone
					}
				}).then(
						function(resp) {
							alert("添加成功");
							window.location.reload();
						},
						function(resp) {
							console.log('Error status: ' + resp.status);
						},
						function(evt) {
							var progressPercentage = parseInt(100.0
									* evt.loaded / evt.total);
							console.log('progress: ' + progressPercentage
									+ '% ' + evt.name);
						});
			} else {
				alert("两次密码不一致!");
			}
		} else {
			alert("请填写用户名或密码!");
		}
	}
    
});
