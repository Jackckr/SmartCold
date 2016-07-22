coldWeb.controller('storageConfig', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/admin/findAdmin'}).success(function(data){
				$rootScope.admin = data.entity;
				if($rootScope.admin == null || $rootScope.admin.id == 0){
					url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
					window.location.href = url;
				}
		})
	}
	$scope.load();
	$scope.optAudit = '0';
	$scope.configs = [];
	$scope.initTable = function(){
	    $http({method:'POST',url:'/i/storage/findRdcConfig',params:{audit:$scope.optAudit}}).success(function (data) {
	          $scope.configs = data;
        });
	}
	$scope.initTable();
	$scope.auditChanged = function(optAudiet){
		$scope.initTable();
    }
	
	
	function delcfm() {
        if (!confirm("确认要删除？")) {
            return false;
        }
        return true;
    }
	$scope.deleteConfig = function (configID) {
		if(delcfm()){
    	$http.get('/i/storage/deleteConfig', {
            params: {
                "configID": configID,
                'audit': $scope.optAudit,
            }
        }).success(function (data) {  
        	for(var i=0;i<$scope.configs.length;i++)  
        	{  
        	    if($scope.configs[i].id==configID)  
        	    {  
        	    	$scope.configs.splice(i,2);  
        	    }  
        	}  
        });
	  }
    }
	
	function checkInput(){
        var flag = true;
        // 检查必须填写项
        if ($scope.config == undefined || $scope.config == '') {
            flag = false;
        }
        return flag;
    }
	
	$scope.submit = function(){
	        if (checkInput()){
	            $http({
	            	method : 'GET', 
	    			url:'/i/storage/addConfig',
	    			params:{
	    				'config': encodeURI($scope.config,"UTF-8"),
	    				'audit': $scope.optAudit,
	    			}
	    		}).success(function (data) {  
	                alert("添加成功");
	                $scope.configs.push({id: data,type: $scope.config, addTime: new Date()});
	            });
	        } else {
	            alert("请填写需要添加的类型!");
	        }
	    }
});
