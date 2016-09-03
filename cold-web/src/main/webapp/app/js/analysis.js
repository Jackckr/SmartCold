zebraWeb.controller('overTemperature', function($rootScope, $scope, $location, $http,$stateParams,baseTools){
	$scope.load = function(){
		$scope.rdcId = $stateParams.rdcId;
		$http.get('/i/coldStorage/findAnalysisByRdcidKeyDate')
	}
})