coldWeb.controller('spiderConfig', function ($rootScope, $scope, $state, $cookies, $http, Upload) {
	
	$scope.load = function(){
		$scope.vm = {}
		$scope.handItem = {columnkey:"handWrite",columnvalue:"手动输入..."}
		$scope.storageEntity = {}
		$scope.doorEntity = {}
		$scope.blowerEntity = {}
		$scope.compressGroupEntity = {}
		$scope.devices = [{id:0,name:"添加冷库"},{id:1,name:"添加冷库门"},{id:2,name:"添加风机"},{id:3,name:"添加压缩机组"}]
		$scope.choseDevice = $scope.devices[0];
		$http.get('/i/rdc/findRdcList').success(function(data,status,config,headers){
			$scope.rdclist = data;
			$scope.vm.choseRdc = data[0];
			$scope.rdclist[0].isOn = true;
			$scope.changeRdc();
		});
	}
	
	function getDistinctColumnKey(data){
		keys = [];
		angular.forEach(data,function(item){
			keys.indexOf(item.columnkey) == -1? keys.push(item.columnkey):'';
		})
		return keys;
	}
	
	
	$scope.changeRdc = function(){
		$scope.vm.choseRdc = $scope.vm.choseRdcs?$scope.vm.choseRdcs[0]:$scope.vm.choseRdc;
		$scope.vm.choseRdc.mapping = typeof($scope.vm.choseRdc.mapping) == "string"?
				JSON.parse($scope.vm.choseRdc.mapping):
					$scope.vm.choseRdc.mapping;
		$http.get('/i/coldStorage/getColdStorageByRdcId?rdcId=' + $scope.vm.choseRdc.id).success(function(data,status,config,headers){
			angular.forEach(data,function(item,index){
				data[index].mapping = JSON.parse(data[index].mapping)
			})
			$scope.storages = data;
			$scope.vm.choseStorage = data[0];
			$scope.vm.warnings = $scope.vm.choseRdc.mapping.hasOwnProperty("warnings")?$scope.vm.choseRdc.mapping.warnings:[];
			$scope.vm.warning = "";
			$scope.vm.choseStorage?$scope.changeStorage():"";
		})
		$http.get('/i/rdc/findSpiderConfig?rdcId=' + $scope.vm.choseRdc.id
				).success(function(data,status,config,headers){
					$scope.vm.username = data?data.username:'';
					$scope.vm.password = data?data.password:'';
				})
		$http.get('/i/coldStorage/findItem').success(function(data,status,config,headers){
			$scope.storageItem = data;
			$scope.vm.choseItem = data[0];
			$scope.storageItemKeys = getDistinctColumnKey($scope.storageItem);
			$scope.vm.choseItemKey = $scope.storageItemKeys[0];
			$scope.storageItem.push($scope.handItem);
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
			$scope.compressGroupItemKeys = getDistinctColumnKey($scope.compressGroupItem);
			$scope.vm.choseCompressGroupItemKey = $scope.compressGroupItemKeys[0];
			$scope.compressGroupItem.push($scope.handItem);
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
		$http.get('/i/blower/getBlowerByColdStorageId?coldStorageId=' + $scope.vm.choseStorage.id
				).success(function(data,status,config,headers){
					angular.forEach(data,function(item,index){
						data[index].mapping = JSON.parse(data[index].mapping)
					})
					$scope.blowers = data;
					$scope.vm.choseBlower = data.length>0?data[0]:[];
				})
		$http.get('/i/blower/findItem').success(function(data,status,config,headers){
			$scope.blowerItem = data;
			$scope.vm.choseBlowerItem = data[0];
			$scope.blowerItemKeys = getDistinctColumnKey($scope.blowerItem);
			$scope.vm.choseBlowerItemKey = $scope.blowerItemKeys[0];
			$scope.blowerItem.push($scope.handItem);
		})
	}
	
	$scope.deleteKey = function(key){
		delete $scope.vm.choseStorage.mapping[key];
	}
	
	$scope.deleteDoorKey = function(key){
		delete $scope.vm.choseDoor.mapping[key];
	}
	
	$scope.deleteBlowerKey = function(key){
		delete $scope.vm.choseBlower.mapping[key];
	}
	
	$scope.deleteCompressGroupKey = function(key){
		delete $scope.vm.choseCompressGroup.mapping[key];
	}
	
	$scope.addKey = function(){
		if($scope.vm.choseItem == $scope.handItem){
			if(!$scope.vm.itemInput) return;
			$scope.vm.choseStorage.mapping[$scope.vm.choseItemKey] = $scope.vm.itemInput;
			$scope.vm.itemInput = "";
			$scope.vm.choseItem = $scope.storageItem[0];
		}else {			
			$scope.vm.choseStorage.mapping[$scope.vm.choseItem.columnkey]=$scope.vm.choseItem.columnvalue;
		}
		$scope.vm.addStorageItem=false;
	}
	
	$scope.addDoorKey = function(){
		if($scope.vm.choseItem == $scope.handItem){
			if(!$scope.vm.itemInput) return;
			$scope.vm.choseDoor.mapping[$scope.vm.choseItemKey] = $scope.vm.itemInput;
			$scope.vm.itemInput = "";
			$scope.vm.choseItem = $scope.storageItem[0];
		}else{			
			$scope.vm.choseDoor.mapping[$scope.vm.choseItem.columnkey]=$scope.vm.choseItem.columnvalue;
		}
		$scope.vm.addDoorItem=false;
	}
	
	$scope.addBlowerKey = function(){
		if($scope.vm.choseBlowerItem == $scope.handItem){
			if(!$scope.vm.itemInput) return;
			$scope.vm.choseBlower.mapping[$scope.vm.choseBlowerItemKey] = $scope.vm.itemInput;
			$scope.vm.itemInput = "";
			$scope.vm.choseBlowerItem = $scope.blowerItem[0];
		}else{			
			$scope.vm.choseBlower.mapping[$scope.vm.choseBlowerItem.columnkey]=$scope.vm.choseBlowerItem.columnvalue;
		}
		$scope.vm.addBlowerItem=false;
	}
	
	$scope.addCompressGroupKey = function(){
		if($scope.vm.choseCompressGroupItem == $scope.handItem){
			if(!$scope.vm.itemInput) return;
			$scope.vm.choseCompressGroup.mapping[$scope.vm.choseCompressGroupItemKey] = $scope.vm.itemInput;
			$scope.vm.itemInput = "";
			$scope.vm.choseCompressGroupItem = $scope.compressGroupItem[0];
		}else{			
			$scope.vm.choseCompressGroup.mapping[$scope.vm.choseCompressGroupItem.columnkey]=$scope.vm.choseCompressGroupItem.columnvalue;
		}
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
	
	$scope.realSaveBlower = function(){
		url = '/i/blower/updateMapping?id=' + $scope.vm.choseBlower.id 
		+ '&mapping=' + JSON.stringify($scope.vm.choseBlower.mapping);
		$http.post(url).success(function(data,status,config,headers){
			alert(data.message);
		})
	}
	
	$scope.realSaveCompressGroup = function(){
		url = '/i/compressorGroup/updateMapping?id=' + $scope.vm.choseCompressGroup.id 
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
	
	$scope.deleteAccount = function(){
		$http.post('/i/rdc/deleteSpiderConfig?rdcid=' + $scope.vm.choseRdc.id).success(function(data,status,config,headers){
			alert(data.message);
			$scope.vm.username = "";
			$scope.vm.password = "";
		})
	}
	
	$scope.addWaringValue = function(){
		if($scope.vm.warning.trim() && $scope.vm.warnings.indexOf($scope.vm.warning) == -1){
			$scope.vm.warnings.push($scope.vm.warning);
		}
		$scope.vm.warning = "";
		$scope.vm.addWarning=false;
	}
	
	$scope.deleteWarning = function(warning){
		if($scope.vm.warnings.indexOf(warning) > -1){
			$scope.vm.warnings.splice($scope.vm.warnings.indexOf(warning),1);
		}
	}
	
	$scope.realSaveWarning = function(){
		$scope.vm.choseRdc.mapping.warnings = $scope.vm.warnings;
		url = '/i/rdc/updateMapping?rdcId=' + $scope.vm.choseRdc.id 
		+ '&mapping=' + JSON.stringify($scope.vm.choseRdc.mapping);
		$http.post(url).success(function(data,status,config,headers){
			alert(data.message);
		})
	}
	
	$scope.addStorage = function(){
		$scope.storageEntity.rdcId = $scope.vm.choseRdc.id;
		$http.post("/i/coldStorage/insertStorage",$scope.storageEntity).success(function(data,status,config,headers){
			alert(data.message);
			$scope.storageEntity = {};
			$scope.changeRdc();
		})
	}
	
	$scope.addDoor = function(){
		$scope.doorEntity.rdcId = $scope.vm.choseRdc.id;
		$scope.doorEntity.coldStorageId = $scope.vm.choseStorage.id;
		$http.post("/i/coldStorageDoor/insertDoor",$scope.doorEntity).success(function(data,status,config,headers){
			alert(data.message);
			$scope.doorEntity = {};
			$scope.changeStorage();
		})
	}
	
	$scope.addBlower = function(){
		$scope.blowerEntity.coldStorageId = $scope.vm.choseStorage.id;
		$http.post("/i/blower/insertBlower",$scope.blowerEntity).success(function(data,status,config,headers){
			alert(data.message);
			$scope.blowerEntity = {};
			$scope.changeStorage()
		})
	}
	
	$scope.addCompress = function(){
		$scope.compressGroupEntity.rdcId = $scope.vm.choseRdc.id;
		$http.post("/i/compressorGroup/insertCompressGroup",$scope.compressGroupEntity).success(function(data,status,config,headers){
			alert(data.message);
			$scope.compressGroupEntity = {};
			$scope.changeRdc();
		})
	}
	
	$scope.deleteStorage = function(id){
		if(confirm("确定删除?")){
			url = '/i/coldStorage/deleteStorage?id=' + id;
			$http.post(url).success(function(data,status,headers,config){
				alert(data.message);
				$scope.changeRdc();
			});
		}
	}
	
	$scope.deleteBlower = function(id){
		if(confirm("确定删除?")){
			url = '/i/blower/deleteBlower?id=' + id;
			$http.post(url).success(function(data,status,headers,config){
				alert(data.message);
				$scope.changeStorage();
			});
		}
	}
	
	$scope.deleteDoor = function(id){
		if(confirm("确定删除?")){
			url = '/i/coldStorageDoor/deleteDoor?id=' + id;
			$http.post(url).success(function(data,status,headers,config){
				alert(data.message);
				$scope.changeStorage();
			});
		}		
	}
	
	$scope.deleteCompressGroup = function(id){
		if(confirm("确定删除?")){
			url = '/i/compressorGroup/deleteCompressGroup?id=' + id;
			$http.post(url).success(function(data,status,headers,config){
				alert(data.message);
				$scope.changeRdc();
			});
		}		
	}
	
	$scope.load();
	
});