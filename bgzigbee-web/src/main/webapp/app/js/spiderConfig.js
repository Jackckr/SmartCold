coldWeb.controller('spiderConfig', function ($rootScope, $scope, $state, $cookies, $http, Upload, coldWebUrl) {

	$http.get(coldWebUrl+"storageKeys/getStorageType").success(function(data,status,config,headers){
		$scope.storageTypes = data;
		$scope.devices = [];
		angular.forEach(data, function (item) {
			item.name = '添加'+item.desc;
			$scope.devices.push(item);
		})
		$scope.choseDevice = $scope.devices[0];
	});

	$scope.load = function(){
		$scope.vm = {}
		$scope.handItem = {columnkey:"handWrite",columnvalue:"手动输入..."};
		$scope.storageEntity = {};
		$scope.doorEntity = {}
		$scope.blowerEntity = {}
		$scope.compressGroupEntity = {}

		$http.get('/i/rdc/findRdcList').success(function(data,status,config,headers){
			$scope.rdclist = data;
			$scope.vm.choseRdc = data[0];
			$scope.rdclist[0].isOn = true;
			$scope.changeRdc();
		});
	}
	
	$scope.objectLength = function(obj){
		return Object.keys(obj).length;
	}
	
	function getDistinctColumnKey(data){
		keys = [];
		angular.forEach(data,function(item){
			keys.indexOf(item.columnkey) == -1? keys.push(item.columnkey):'';
		})
		return keys;
	}

	$scope.coldStorageKeys = [];
	$scope.doorKeys = [];
	$scope.compressorGroupKeys = [];
	$scope.blowerKeys = [];
	$scope.compressorKeys = [];
	$scope.windscreenKeys = [];
	$scope.evaporativeKeys = [];
	$scope.evaporativewaterKeys = [];
	$scope.evaporativeblowerKeys = [];
	$scope.powerKeys = [];
	$scope.platformdoorKeys = [];
	$scope.pressureplatformKeys = [];
	$scope.chargingpileKeys = [];
	$scope.forkliftKeys = [];
	$scope.coldstoragelightKeys = [];
	$scope.circulatingpumpKeys = [];

	$scope.vm = {};
	$scope.vm.choseStorage = {};
	$scope.vm.choseStorage.mapping = [];
	
	$scope.type2Keys = function(type){
		switch(type){
		case 1:
			return $scope.coldStorageKeys;
		case 2:
			return $scope.doorKeys;
		case 3:
			return $scope.compressorGroupKeys;
		case 4:
			return $scope.blowerKeys;
		case 5:
			return $scope.compressorKeys;
		case 6:
			return $scope.windscreenKeys;
		case 7:
			return $scope.evaporativeKeys;
		case 8:
			return $scope.evaporativewaterKeys;
		case 9:
			return $scope.evaporativeblowerKeys;
		case 10:
			return $scope.powerKeys;
		case 11:
			return $scope.platformdoorKeys;
		case 12:
			return $scope.pressureplatformKeys;
		case 13:
			return $scope.chargingpileKeys;
		case 14:
			return $scope.forkliftKeys;
		case 15:
			return $scope.coldstoragelightKeys;
		case 16:
			return $scope.circulatingpumpKeys;
		default:
			return [];
		}
	}
	
	$scope.typeChanged = function(item){
		$scope.keysData = $scope.type2Keys(item.type);
	}
	
	$http.get(coldWebUrl+'storageKeys/getAllKeys').success(function(data,status,config,headers){
		angular.forEach(data,function(item,index){
			$scope.type2Keys(item.type).push(item);
		})
	})
	

	
	$scope.getDescByType = function(type){
		for(var i=0; i<$scope.storageTypes.length; i++){
			if($scope.storageTypes[i].type==type){
				return $scope.storageTypes[i].desc;
			}
		}
		return 'not correct type';
	}
	$scope.newKey = {};
	$scope.saveNewKey = function(){
		var newKey = $scope.newKey;
		if(newKey.key && newKey.type && newKey.desc){
			var params ={
				key:newKey.key,
				type:newKey.type.type,
				desc:newKey.desc,
				unit:newKey.unit
			}
			var req = {
				method:'post',
				url:"/i/coldStorage/addStorageKey",
				data:$.param(params),
				headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
			}
			$http(req).then(function(resp){
				$scope.newKey = {};
				params.id = resp.data;
				$scope.type2Keys(params.type).push(params);
			})
		}else{
			alert("输入不完整");
		}
	}
	
	$scope.delStorageKey = function(item){
		var req = {
			method:'delete',
			url:"/i/coldStorage/delStorageKey?id="+item.id
//			data:'id='+id,
//			headers:{'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
		}
		$http(req).then(function(resp){
			var i = $scope.keysData.indexOf(item);
			$scope.keysData.splice(i,1);
		})
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
			$scope.vm.choseStorage?$scope.changeStorage():$scope.blowers=[],$scope.doors=[];
		})
		$http.get('/i/rdc/findSpiderConfig?rdcId=' + $scope.vm.choseRdc.id
				).success(function(data,status,config,headers){
					$scope.vm.username = data?data.username:'';
					$scope.vm.password = data?data.password:'';
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

        $http.get('/i/spiderConfig/find/evaporativeSet?rdcId='+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.evaporativeSets = resp.data;
            $scope.vm.choseEvaporative = resp.data[0];
        })

        $http.get("/i/spiderConfig/findByRdcid?table=powerset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.powerSets = resp.data;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=platformdoorset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.platformDoorSets = resp.data;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=pressureplatformset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.pressurePlatformSets = resp.data;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=chargingpileset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.chargingpileSets = resp.data;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=forkliftset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.forkliftSets = resp.data;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=coldstoragelightset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.coldStorageLightSets = resp.data;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=circulatingpumpset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.circulatingPumpSets = resp.data;
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
        // find windscreen
        $http.get('/i/spiderConfig/find/windscreenSet?storageId='+$scope.vm.choseStorage.id).then(function (resp) {
            $scope.windScreenSets = resp.data;

            console.log($scope.vm.choseStorage.name);
        })
	}

	$scope.changeCompressGroup = function () {
		$http.get('i/compressorGroup/findCompressorByGid?groupId='+$scope.vm.choseCompressGroup.id)
			.then(function (resp) {
				 $scope.compressorSets = resp.data;
			});
	}
	$scope.compressorSet={};
	$scope.addCompress = function () {
		var object = $scope.compressorSet;
		object.compressorgroupid=$scope.vm.choseCompressGroup.id;
		$http.post("/i/compressorGroup/saveCompressor", object).then(function (resp) {
			alert(resp.data.message);
			$scope.compressorSet = {};
			$scope.changeCompressGroup();
		});
	}

	$scope.windScreenSet = {}
	$scope.addWindScreen = function () {
		var object = $scope.windscreenSet;
		object.coldStorageId = $scope.vm.choseStorage.id;
		$http.post("/i/spiderConfig/add/windscreenset", object).then(function (resp) {
			alert(resp.data.message);
			$scope.changeStorage();
			$scope.windScreenSet = {};
		})
	}
    $scope.evaporativeSet = {};
	$scope.addEvaporativeSet = function () {
        var object = $scope.evaporativeSet;
        object.rdcid = $scope.vm.choseRdc.id;
        $http.post("/i/spiderConfig/add/evaporativeSet", object).then(function (resp) {
            alert(resp.data.message);
            $scope.changeRdc();
            $scope.evaporativeSet = {};
        })
    }
    $scope.changeEvaporative = function () {
        $http.get("/i/spiderConfig/find/evaporativeWaterSet?evaporativeid="+$scope.vm.choseEvaporative.id).then(function (resp) {
            $scope.evaporativeWaterSets = resp.data;
        })
        $http.get("/i/spiderConfig/find/evaporativeBlowerSet?evaporativeid="+$scope.vm.choseEvaporative.id).then(function (resp) {
            $scope.evaporativeBlowerSets = resp.data;
        })
    }
    $scope.evaporativeWaterSet = {};
    $scope.addEvaporativeWaterSet = function () {
        var object = $scope.evaporativeWaterSet;
        object.evaporativeid = $scope.vm.choseEvaporative.id;
        $http.post("/i/spiderConfig/add/evaporativeWaterSet", object).then(function (resp) {
            alert(resp.data.message);
            $scope.changeEvaporative();
            $scope.evaporativeWaterSet = {};
        })
    }

    $scope.evaporativeBlowerSet = {}
    $scope.addEvaporativeBlowerSet = function () {
        var obj = $scope.evaporativeBlowerSet;
        obj.evaporativeid = $scope.vm.choseEvaporative.id;
        $http.post("/i/spiderConfig/add/evaporativeBlowerSet", obj).then(function (resp) {
            alert(resp.data.message);
            $scope.changeEvaporative();
            $scope.evaporativeBlowerSet = {};
        })
    }

    $scope.platformDoorSet = {}
    $scope.addplatformDoorSet = function () {
        var obj = $scope.platformDoorSet;
        obj.rdcid = $scope.vm.choseRdc.id;
        $http.post("/i/spiderConfig/add/platformDoorSet", obj).then(function (resp) {
            alert(resp.data.message);
            $scope.changeRdc();
            $scope.platformDoorSet = {};
        })
    }

    $scope.coldStorageLightSet = {}
    $scope.addColdStorageLightSet = function () {
        var obj = $scope.coldStorageLightSet;
        obj.rdcid = $scope.vm.choseRdc.id;
        $http.post("/i/spiderConfig/add/coldStorageLightSet", obj).then(function (resp) {
            alert(resp.data.message);
            $scope.changeRdc();
            $scope.coldStorageLightSet = {};
        })
    }

    $scope.addRdcIdAndName = function (obj, table) {
        obj.rdcid = $scope.vm.choseRdc.id;
        obj.table = table+'set';
        $http.post("/i/spiderConfig/add/rdcidAndName", obj).then(function (resp) {
            alert(resp.data.message);
            obj.name = '';
            $scope.changeRdc();
        })
    }

    $scope.delById = function(table,item, arrayData){
		var flag = confirm("确认删除？");
		if (flag) {
			$http.delete("/i/spiderConfig/delete/id", {
				params: {"table": table + "set", "id": item.id}
			}).then(function (resp) {
				alert(resp.data.message);
				var index =  arrayData.indexOf(item);
				arrayData.splice(index, 1);
			})
		}
	}

	$scope.saveObjectToUrl = function(url, object, callback){
		if(callback){
			$http.post(url,object).then(callback);
		}else {
			$http.post(url,object).then(function (resp) {
				alert(resp.data.message);
			})
		}

	}
	
	$scope.deviceChange = function (choseDevice) {
		console.log(choseDevice.name);
        switch(choseDevice.type) {
            // case 1:
            //     return $scope.coldStorageKeys;
            // case 2:
            //     return $scope.doorKeys;
            // case 3:
            //     return $scope.compressorGroupKeys;
            // case 4:
            //     return $scope.blowerKeys;
            case 5:
                $scope.changeCompressGroup();
                break;
            case 6:
                return $scope.windscreenKeys;
            case 7:
                return $scope.evaporativeKeys;
            case 8:
                //return $scope.evaporativewaterKeys;
            case 9:
                return $scope.changeEvaporative();
            case 10:
                return $scope.powerKeys;
            case 11:
                return $scope.platformdoorKeys;
            case 12:
                return $scope.pressureplatformKeys;
            case 13:
                return $scope.chargingpileKeys;
            case 14:
                return $scope.forkliftKeys;
            case 15:
                return $scope.coldstoragelightKeys;
            case 16:
                return $scope.circulatingpumpKeys;
            default:
        }
	}
	
	$scope.deleteKey = function(object,key){
		delete object[key];
	}
	
	
	$scope.addKey = function(object,key,value){
		object[key] = value;
	}
	
	$scope.resetItem = function(item,obj){
		$scope.vm[item] = "";
		$scope.vm.itemInput = "";
		obj.addItem = false;
	}
	
	$scope.realSaveStorage = function(){
		url = '/i/coldStorage/updateMapping?coldStorageId=' + $scope.vm.choseStorage.id 
		+ '&mapping=' + JSON.stringify($scope.vm.choseStorage.mapping);
		$http.post(url).success(function(data,status,config,headers){
			alert(data.message);
		})
		angular.forEach($scope.doors,function(item){
			$scope.realSaveDoor(item);
		})
		angular.forEach($scope.blowers,function(item){
			$scope.realSaveBlower(item);
		})
	}
	
	$scope.realSaveDoor = function(door){
		url = '/i/coldStorageDoor/updateMapping?id=' + door.id 
		+ '&mapping=' + JSON.stringify(door.mapping);
		$http.post(url).success(function(data,status,config,headers){
		})
	}
	
	$scope.realSaveBlower = function(blower){
		url = '/i/blower/updateMapping?id=' + blower.id 
		+ '&mapping=' + JSON.stringify(blower.mapping);
		$http.post(url).success(function(data,status,config,headers){
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
	
	$scope.addCompressGroup = function(){
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
// coldWeb.directive("setTable", function ($templateCache) {
//
// 	var defaults = {
// 		templateUrl: 'ng-gallery.html'
// 	};
//
//
// 	var template_url = defaults.templateUrl;
// 	// Set the default template
// 	$templateCache.put(template_url,
// 		'<div class="{{ baseClass }}">' +
// 		'  <div ng-repeat="i in images">' +
// 		'    <img ng-src="{{ i.thumb }}" class="{{ thumbClass }}" ng-click="openGallery($index)" alt="Image {{ $index + 1 }}" />' +
// 		'  </div>' +
// 		'</div>' +
// 		'<div class="ng-overlay" ng-show="opened">' +
// 		'</div>' +
// 		'<div class="ng-gallery-content" unselectable="on" ng-show="opened" ng-swipe-left="nextImage()" ng-swipe-right="prevImage()">' +
// 		'  <div class="uil-ring-css" ng-show="loading"><div></div></div>' +
// 		'<a href="{{getImageDownloadSrc()}}" target="_blank" ng-show="showImageDownloadButton()" class="download-image"><i class="fa fa-download"></i></a>' +
// 		'  <a class="close-popup" ng-click="closeGallery()"><i class="fa fa-close"></i></a>' +
// 		'  <a class="nav-left" ng-click="prevImage()"><i class="fa fa-angle-left"></i></a>' +
// 		'  <img ondragstart="return false;" draggable="false" ng-src="{{ img }}" ng-click="nextImage()" ng-show="!loading" class="effect" />' +
// 		'  <a class="nav-right" ng-click="nextImage()"><i class="fa fa-angle-right"></i></a>' +
// 		'  <span class="info-text">{{ index + 1 }}/{{ images.length }} - {{ description }}</span>' +
// 		'  <div class="ng-thumbnails-wrapper">' +
// 		'    <div class="ng-thumbnails slide-left">' +
// 		'      <div ng-repeat="i in images">' +
// 		'        <img ng-src="{{ i.thumb }}" ng-class="{\'active\': index === $index}" ng-click="changeImage($index)" />' +
// 		'      </div>' +
// 		'    </div>' +
// 		'  </div>' +
// 		'</div>'
// 	);
//
// 	return {
// 		restrict: 'E',
// 		scope: {
// 			notShow:"id",
// 		},
// 		templateUrl: function (element, attrs) {
// 			return attrs.templateUrl || defaults.templateUrl;
// 		},
// 		link: function (scope, element, attrs) {
//
// 		}
// 	}
// });