coldWeb.controller('baoyangWeixiuRecords', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	// 显示最大页数
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.bigCurrentPage1 = 1;
	$scope.Maintenances0 = [];
	$scope.Maintenances1 = [];
	$scope.updateMaintenance0 = {};
	$scope.getMaintenances0 = function() {
		$http({
			method : 'POST',
			url : '/i/maintenance/findMaintenanceList',
			params : {
				pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize,
				rdcId:$rootScope.rdcId,
				audit : 0,
				keyword : encodeURI($scope.keyword,"UTF-8"),
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
			$scope.Maintenances0 = data.list;
		});
	};

    $scope.getMaintenances1 = function() {
		$http({
			method : 'POST',
			url : '/i/maintenance/findMaintenanceList',
			params : {
				pageNum : $scope.bigCurrentPage1,
				pageSize : $scope.maxSize,
				rdcId:$rootScope.rdcId,
				audit : 1,
				keyword : encodeURI($scope.keyword,"UTF-8"),
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
			$scope.Maintenances1 = data.list;
		});
	};
    
	$scope.getMaintenances0();
	$scope.getMaintenances1();
    
	$scope.pageChanged0 = function() {
		$scope.getMaintenances0();
	};
	$scope.pageChanged1 = function() {
		$scope.getMaintenances1();
	};
	
	$scope.auditChanged = function(optAudiet) {
		$scope.getMaintenances0();
		$scope.getMaintenances1();
	};
	$scope.goSearch0 = function () {
		$scope.getMaintenances0();
    };
	$scope.goSearch1 = function () {
		$scope.getMaintenances1();
    };
	
	function delcfm() {
	        if (!confirm("确认要删除？")) {
	            return false;
	        }
	        return true;
	}
	
    $scope.goDeleteMaintenance = function (id) {
    	if(delcfm()){
    	$http.get('/i/maintenance/deleteMaintenance', {
            params: {
                "id": id
            }
        }).success(function (data) {
        });
    	$state.reload();
    	}
    };
    
    
    
    
    $scope.weixiuapply = function (id) {
    	$http.get('/i/maintenance/findMaintenanceByID', {
            params: {
                "id": id
            }
        }).success(function (data) {
        	$scope.updateMaintenance0 = data;
        });
    };
    
    
    $scope.submitfix = function(){
    	$scope.updateMaintenance0.audit = 1;
    	$http({
    		'method':'POST',	
    		'url':'/i/maintenance/updateMaintenance',
    		'params':{
    			"id":$scope.updateMaintenance0.id,
    			 "detail"  :encodeURI($scope.updateMaintenance0.detail,"UTF-8"),
    			   "fixtime" :$scope.updateMaintenance0.fixtime,
    			   "note" :encodeURI($scope.updateMaintenance0.note,"UTF-8"),
    			   "audit":1
    		}
    	}).success(function (data) {
        	if(data){
        		alert("提交成功");
        		//window.location.reload();
        		 $scope.getMaintenances0();
                 $scope.getMaintenances1();
        	}
        	else{
        		alert("提交失败");
        	}
        });
    };
  
    $scope.change = function(id,appraise){
    	$http({
    		'method':'POST',	
    		'url':'/i/maintenance/updateMaintenanceAppraise',
    		'params':{
    			'id':id,
    			'appraise':appraise
    		}
    	});
	};
	
    
});
