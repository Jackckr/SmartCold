coldWeb.controller('spiderConfig', function ($rootScope, $scope, $state, $cookies, $http, Upload) {
	
	$scope.load = function(){
		$scope.vm = {}
		$http.get('/i/rdc/findRdcList').success(function(data,status,config,headers){
			$scope.rdclist = data;
			$scope.vm.choseRdc = data[1036];
			$scope.changeRdc();
		});
	}
	
	$scope.changeRdc = function(){
		$http.get('/i/coldStorage/getColdStorageByRdcId?rdcId=' + $scope.vm.choseRdc.id).success(function(data,status,config,headers){
			angular.forEach(data,function(item,index){
				data[index].mapping = JSON.parse(data[index].mapping)
			})
			$scope.storages = data;
			$scope.vm.choseStorage = data[0];
			$scope.changeStorage();
		})
		$http.get('/i/coldStorage/findItem').success(function(data,status,config,headers){
			$scope.storageItem = data;
			$scope.vm.choseItem = data[0];
		})
	}
	
	$scope.changeStorage = function(){
		$http.get('/i/coldStorageDoor/getcoldStorageDoorByStorageId?coldStorageId=' + $scope.vm.choseStorage.id
				).success(function(data,status,config,headers){
					angular.forEach(data,function(item,index){
						data[index].mapping = JSON.parse(data[index].mapping)
					})
					$scope.doors = data;
					$scope.vm.choseDoor = data.length>0?data[0]:[];
				})
	}
	
	$scope.deleteKey = function(key){
		delete $scope.vm.choseStorage.mapping[key];
	}
	
	$scope.deleteDoorKey = function(key){
		delete $scope.vm.choseDoor.mapping[key];
	}
	
	$scope.addKey = function(){
		$scope.vm.choseStorage.mapping[$scope.vm.choseItem.columnkey]=$scope.vm.choseItem.columnvalue;
		$scope.vm.addStorageItem=false;
	}
	
	$scope.addDoorKey = function(){
		$scope.vm.choseDoor.mapping[$scope.vm.choseItem.columnkey]=$scope.vm.choseItem.columnvalue;
		$scope.vm.addDoorItem=false;
	}
	
	$scope.realSaveStorage = function(){
		url = '/i/coldStorage/updateMapping?coldStorageId=' + $scope.vm.choseStorage.id 
		+ '&mapping=' + JSON.stringify($scope.vm.choseStorage.mapping);
		$http.post(url).success(function(data,status,config,headers){
			alert(data.message);
		})
	}
	
	$scope.realSaveDoor = function(){
		url = '/i/coldStorageDoor/updateMapping?id=' + $scope.vm.choseDoor.id 
		+ '&mapping=' + JSON.stringify($scope.vm.choseDoor.mapping);
		$http.post(url).success(function(data,status,config,headers){
			alert(data.message);
		})
	}
	
	$scope.load();
	
});