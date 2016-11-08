coldWeb.controller('deviceConfig', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	$scope.AllDeviceObjectMappings = [];
	$scope.optAudit = '8';
	
	 // 获取当前设备的列表
    $scope.getDeviceObjectMappings = function() {
		$http({
			method : 'POST',
			url : '/i/device/findDeviceObjectMappingList',
			params : {
				pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize,
				audit : $scope.optAudit,
				keyword : encodeURI($scope.keyword,"UTF-8"),
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
			$scope.AllDeviceObjectMappings = data.list;
		});
	}

	$scope.pageChanged = function() {
		$scope.getDeviceObjectMappings();
	}
	$scope.getDeviceObjectMappings();
	// 获取当前冷库的列表
	$scope.auditChanged = function(optAudiet) {
		$scope.getDeviceObjectMappings();
	}
    
	$scope.goSearch = function () {
		$scope.getDeviceObjectMappings();
    }
	
	function delcfm() {
	        if (!confirm("确认要删除？")) {
	            return false;
	        }
	        return true;
	}
	
    $scope.goDeleteDeviceObjectMapping = function (deviceObjectMappingID) {
    	if(delcfm()){
    	$http.get('/i/device/deleteByDeviceObjectMappingID', {
            params: {
                "deviceObjectMappingID": deviceObjectMappingID
            }
        }).success(function (data) {
        });
    	$state.reload();
    	}
    }
    $scope.deleteDeviceObjectMappings = function(){
    	if(delcfm()){
    	var deviceObjectMappingIDs = [];
    	for(i in $scope.selected){
    		deviceObjectMappingIDs.push($scope.selected[i].id);
    	}
    	if(deviceObjectMappingIDs.length >0 ){
    		$http({
    			method:'DELETE',
    			url:'/i/device/deleteByDeviceObjectMappingIDs',
    			params:{
    				'deviceObjectMappingIDs': deviceObjectMappingIDs
    			}
    		}).success(function (data) {
            });
    	}
    	window.location.reload(); 
    	}
    }
   
    
    $scope.selected = [];
    $scope.toggle = function (deviceObjectMapping, list) {
		  var idx = list.indexOf(deviceObjectMapping);
		  if (idx > -1) {
		    list.splice(idx, 1);
		  }
		  else {
		    list.push(deviceObjectMapping);
		  }
    };
    $scope.exists = function (deviceObjectMapping, list) {
    	return list.indexOf(deviceObjectMapping) > -1;
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.AllDeviceObjectMappings.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.AllDeviceObjectMappings.length) {
        	$scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        	$scope.selected = $scope.AllDeviceObjectMappings.slice(0);
        }
    };
    
    $scope.getDeviceObjectMappingIDsFromSelected = function(audit){
    	var deviceObjectMappingIDs = [];
    	for(i in $scope.selected){
    		if(audit != undefined)
    			$scope.selected[i].audit = audit;
    		deviceObjectMappingIDs.push($scope.selected[i].id);
    	}
    	return deviceObjectMappingIDs;
    }
    
    $scope.getAudit = function(i){
    	if(i==0)
    		return '异常';
    	else if(i>0){
    		return '正常';
    	}
    }
    
    $scope.changeAudit = function(deviceObjectMapping){
    	var r=confirm("是否重置？");
    	deviceObjectMapping.status = r?1:0;
    	$http({
    		'method':'POST',	
    		'url':'/i/device/changeAudit',
    		'params':{
    			'deviceObjectMappingID':deviceObjectMapping.id,
    			'audit':deviceObjectMapping.status
    		}
    	})
    }
    $scope.changeAudits = function(){
    	var r=confirm("是否重置？");
    	var audit = r?1:0;
    	var deviceObjectMappingIDs = $scope.getDeviceObjectMappingIDsFromSelected(audit);
    	if(deviceObjectMappingIDs.length >0 ){
    		$http({
    			method:'POST',
    			url:'/i/device/changeAudits',
    			params:{
    				'deviceObjectMappingIDs': deviceObjectMappingIDs,
    				'audit':audit
    			}
    		});
    	}
    }
    
});
