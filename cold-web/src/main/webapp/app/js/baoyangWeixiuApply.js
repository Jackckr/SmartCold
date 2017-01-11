coldWeb.controller('baoyangWeixiuApply', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	function checkInput() {
		var flag = true;
		// 检查必须填写项
		if ($scope.unitname == undefined || $scope.unitname == '') {
			flag = false;
		}
		return flag;
	}
	
	$scope.addMaintenance = function() {
		if (checkInput()) {
			if($scope.reason=='undefined')
				$scope.reason = '';
			$http({
	            method: 'POST',
	            url: '/i/maintenance/addMaintenance',
	            params: {
	            	rdcId:$rootScope.rdcId ,
	            	unitname : encodeURI($scope.unitname,"UTF-8"),
					reason : encodeURI($scope.reason,"UTF-8"),
					ordertime : $scope.ordertime
	            }
	        }).success(function (data) {
	            if(data){
	            	alert("添加成功");
	            	$state.reload();
	            }
	            else{
	            	alert("添加失败");
	            }
	        });
			
		} else {
			alert("机组名称不允许为空!");
		}
	};

});
