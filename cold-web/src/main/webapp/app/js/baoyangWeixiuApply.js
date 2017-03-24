coldWeb.controller('baoyangWeixiuApply', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	function checkInput() {
		var flag = true;
		// 检查必须填写项
		if ($scope.unitname == undefined || $scope.unitname == '') {flag = false;}
		if ($scope.reason == undefined || $scope.reason == '') {flag = false;}
		if ($scope.ordertime == undefined || $scope.ordertime == '') {flag = false;}
		return flag;
	}
	
	function checkTime(){
		var d = new Date();//Date.parse(date.replace(/-/g,"/"));
		var dp = (d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()).replace(/-/g,"/");
		var today = Date.parse(dp);//今天的毫秒数
		var orderDay = Date.parse($scope.ordertime.replace(/-/g,"/"));
		if(orderDay < today){
			alert("预约时间不能晚于今天哦~")
			return false
		}else{
			return true
		}
	}
	$scope.addMaintenance = function() {
		if(checkInput()){			
			if (checkTime()) {
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
				
			} 
		}else {
			alert("您有未填项哦!");
		}
	};

});
