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
		$http.get('/i/rdc/findSpiderConfig?rdcId=' + $scope.vm.choseRdc.id
				).success(function(data,status,config,headers){
					$scope.vm.username = data?data.username:'';
					$scope.vm.password = data?data.password:'';
				})
		$http.get('/i/coldStorage/findItem').success(function(data,status,config,headers){
			$scope.storageItem = data;
			$scope.vm.choseItem = data[0];
		})
		$http.get('/i/compressorGroup/getCompressGroupByRdcId?rdcId=' + $scope.vm.choseRdc.id
				).success(function(data,status,config,headers){
			angular.forEach(data,function(item,index){
				data[index].mapping = JSON.parse(data[index].mapping)
			})
			$scope.compressGroups = data;
			$scope.vm.choseCompressGroup = data[0];
		})
		$http.get('/i/compressorGroup/findItem').success(function(data,status,config,headers){
			$scope.compressGroupItem = data;
			$scope.vm.choseCompressGroupItem = data[0];
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
	
	$scope.deleteCompressGroupKey = function(key){
		delete $scope.vm.choseCompressGroup.mapping[key];
	}
	
	$scope.addKey = function(){
		$scope.vm.choseStorage.mapping[$scope.vm.choseItem.columnkey]=$scope.vm.choseItem.columnvalue;
		$scope.vm.addStorageItem=false;
	}
	
	$scope.addDoorKey = function(){
		$scope.vm.choseDoor.mapping[$scope.vm.choseItem.columnkey]=$scope.vm.choseItem.columnvalue;
		$scope.vm.addDoorItem=false;
	}
	
	$scope.addCompressGroupKey = function(){
		$scope.vm.choseCompressGroup.mapping[$scope.vm.choseCompressGroupItem.columnkey]=$scope.vm.choseCompressGroupItem.columnvalue;
		$scope.vm.addCompressGroupItem=false;
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
	
	$scope.realSaveCompressGroup = function(){
		url = '/i/compressorGroup/updateMapping?groupdId=' + $scope.vm.choseCompressGroup.groupId 
		+ '&mapping=' + JSON.stringify($scope.vm.choseCompressGroup.mapping);
		$http.post(url).success(function(data,status,config,headers){
			alert(data.message);
		})
	}
	
	$scope.saveAccount = function(){
		$http.post('/i/rdc/updateSpiderConfig',{
			rdcid: $scope.vm.choseRdc.id,
			username: $scope.vm.username,
			password: $scope.vm.password}).success(function(data,status,config,headers){
				alert(data.message);
			})
	}
	
	$scope.load();
	
});