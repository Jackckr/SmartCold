/**
 * 发布货品车
 */
var coldSharePage= coldWeb.controller('releaseItem', function ($rootScope, $scope,$stateParams, $state, $cookies, $http, $location) {
	alert($stateParams.data);
	alert($stateParams.dataid);
	alert($stateParams._cuttid);
	if($stateParams.data){
		$scope.rdcinfo=$stateParams.data;
	}else if($stateParams.dataid){//根据名称查找
		 $http({method:'POST',url:'/i/ShareRdcController/getRDCinfo',params:{rid:$stateParams.dataid}}).success(function (data) {
			 $scope.rdcinfo = data.data;//
		       
		  });
	}else {
		
	}
	
	
	
});
