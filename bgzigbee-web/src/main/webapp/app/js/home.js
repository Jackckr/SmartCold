coldWeb.controller('home', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	// 显示最大页数
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
	$scope.Allusers = [];
	$scope.optAudit = '8';
	 // 获取当前冷库的列表

	  
    $scope.getUsers = function() {
		$http({
			method : 'POST',
			url : '/i/user/findUserList',
			params : {
				pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize,
				audit : $scope.optAudit,
				keyword : encodeURI($scope.keyword,"UTF-8"),
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
			$scope.Allusers = data.list;
		});
	}

	$scope.pageChanged = function() {
		$scope.getUsers();
	}
	$scope.getUsers();
	// 获取当前冷库的列表
	$scope.auditChanged = function(optAudiet) {
		$scope.getUsers();
	}
    
	$scope.goSearch = function () {
		$scope.getUsers();
    }
	
	function delcfm() {
	        if (!confirm("确认要删除？")) {
	            return false;
	        }
	        return true;
	}
	
    $scope.goDeleteUser = function (userID) {
    	if(delcfm()){
    	$http.get('/i/user/deleteUser', {
            params: {
                "userID": userID
            }
        }).success(function (data) {
        });
    	$state.reload();
    	}
    }
    $scope.deleteUsers = function(){
    	if(delcfm()){
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
    
    $scope.getUserIDsFromSelected = function(audit){
    	var userIDs = [];
    	for(i in $scope.selected){
    		if(audit != undefined)
    			$scope.selected[i].audit = audit;
    		userIDs.push($scope.selected[i].id);
    	}
    	return userIDs;
    }
    
    $scope.getAudit = function(i){
    	if(i==0)
    		return '待审核';
    	else if(i>0){
    		return '通过';
    	}else{
    		return '未通过';
    	}
    }
    
    $scope.changeAudit = function(user){
    	var r=confirm("通过审核？");
    	user.audit = r?1:-1;
    	$http({
    		'method':'POST',	
    		'url':'/i/user/changeAudit',
    		'params':{
    			'userID':user.id,
    			'audit':user.audit
    		}
    	})
    }
    $scope.changeAudits = function(){
    	var r=confirm("通过审核？");
    	var audit = r?1:-1
    	var userIDs = $scope.getUserIDsFromSelected(audit);
    	if(userIDs.length >0 ){
    		$http({
    			method:'POST',
    			url:'/i/user/changeAudits',
    			params:{
    				'userIDs': userIDs,
    				'audit':audit
    			}
    		});
    	}
    }
    
    
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
          if($scope.password==$scope.password1){
            $http({
            	method : 'GET', 
    			url:'/i/user/addUser',
    			params:{
    				'username': encodeURI($scope.username,"UTF-8"),
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
           }
          else{
        	  alert("两次密码不一致!");
           }
          } else {
            alert("请填写用户名或密码!");
        }
    }
});
