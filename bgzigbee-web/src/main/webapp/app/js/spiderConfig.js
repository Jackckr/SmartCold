coldWeb.controller('spiderConfig', function ($rootScope, $scope, $state, $cookies, $http, Upload) {
	
	$scope.load = function(){
		$http.get('/i/rdc/findRdcList').success(function(data,status,config,headers){
			$scope.rdclist = data;
			$scope.choseRdc = data[0];
		});
	}
	
	$scope.changeRdc = function(){
		$http.get('/i/coldStorage/getColdStorageByRdcId?rdcId=' + $scope.choseRdc.id).success(function(data,status,config,headers){
			angular.forEach(data,function(item,index){
				data[index].mapping = JSON.parse(data[index].mapping)
			})
			$scope.storages = data;
		})
		$http.get('/i/coldStorage/findItem').success(function(data,status,config,headers){
			$scope.storageItem = data;
		})
	}
	
	$scope.load();
	
});