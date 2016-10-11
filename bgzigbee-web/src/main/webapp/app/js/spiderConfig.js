coldWeb.controller('spiderConfig', function ($rootScope, $scope, $state, $cookies, $http, Upload, coldWebUrl) {
	$http.get("/i/spiderConfig/getSetTables").success(function(data,status,config,headers){
		$scope.storageTypes = data;
		$scope.devices = [];
		angular.forEach(data, function (item) {
			item.name = '添加'+item.desc;
			$scope.devices.push(item);
		})
		$scope.choseDevice = $scope.devices[0];
	});

    // $scope.getTypeObjectByType = function (type) {
    //     angular.forEach($scope.storageTypes, function (item) {
    //         if (item.type == type)
    //             return item;
    //     })
    // }

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
	

	
	$scope.typeChanged = function(item){
		$scope.keysData = $scope.type2Keys(item.type);
	}
	
	$http.get(coldWebUrl+'storageKeys/getAllKeys').success(function(data,status,config,headers){
	    $scope.allKeys = data;
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
			    if (resp.data.status > -1) {

                    $scope.newKey = {};
                    params.id = resp.data.status;
                    $scope.type2Keys(params.type).push(params);
                }
                alert(resp.data.message);
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
		    if (resp.data) {
                var i = $scope.keysData.indexOf(item);
                $scope.keysData.splice(i, 1);
            }else {
                alert("删除失败");
            }
		})
	}

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
    $scope.getmginf=function(){
		//获得冷库管理人员
		$http.get("/i/rdc/findrdcMaagerConfig?rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
			if(resp.data.length==0){resp.data[0]={aTelephone:""}};
			$scope.mg = resp.data[0];
			$scope.oldmg = resp.data[0];
		});
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
            $scope.vm.choseCompressGroup ? $scope.changeCompressGroup():null;
		})
		// $http.get('/i/compressorGroup/findItem').success(function(data,status,config,headers){
		// 	$scope.compressGroupItem = data;
		// 	$scope.vm.choseCompressGroupItem = data[0];
		// 	$scope.compressGroupItemKeys = getDistinctColumnKey($scope.compressGroupItem);
		// 	$scope.vm.choseCompressGroupItemKey = $scope.compressGroupItemKeys[0];
		// 	$scope.compressGroupItem.push($scope.handItem);
		// })


        $http.get('/i/spiderConfig/find/evaporativeSet?rdcId='+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.evaporativeSets = resp.data;
            angular.forEach($scope.evaporativeSets, function (item, index) {
                $scope.evaporativeSets[index].mapping = JSON.parse($scope.evaporativeSets[index].mapping);
            })
            $scope.vm.choseEvaporative = resp.data[0];
            $scope.vm.choseEvaporative?$scope.changeEvaporative():null;
        })

        $http.get("/i/spiderConfig/findByRdcid?table=powerset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.powerSets = resp.data;
            $scope.mapping2Object($scope.powerSets);
        })

        $http.get("/i/spiderConfig/findByRdcid?table=platformdoorset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.platformDoorSets = resp.data;
            $scope.mapping2Object($scope.platformDoorSets);
        })

        $http.get("/i/spiderConfig/findByRdcid?table=pressureplatformset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.pressurePlatformSets = resp.data;
            $scope.mapping2Object($scope.pressurePlatformSets);
        })

        $http.get("/i/spiderConfig/findByRdcid?table=chargingpileset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.chargingpileSets = resp.data;
            $scope.mapping2Object($scope.chargingpileSets);
        })

        $http.get("/i/spiderConfig/findByRdcid?table=forkliftset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.forkliftSets = resp.data;
            $scope.mapping2Object($scope.forkliftSets);
        })

        $http.get("/i/spiderConfig/findByRdcid?table=coldstoragelightset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.coldStorageLightSets = resp.data;
            $scope.mapping2Object($scope.coldStorageLightSets);
        })

        $http.get("/i/spiderConfig/findByRdcid?table=circulatingpumpset&rdcid="+$scope.vm.choseRdc.id).then(function (resp) {
            $scope.circulatingPumpSets = resp.data;
            $scope.mapping2Object($scope.circulatingPumpSets);
        });
		
		$scope.getmginf();
        $scope.tag.type = {};
        $scope.tagTypeChanged();
    }
	
	$scope.changeStorage = function(){
		if (!$scope.vm.choseStorage){
			return;
		}
		$http.get('/i/coldStorageDoor/getcoldStorageDoorByStorageId?coldStorageId=' + $scope.vm.choseStorage.id
				).success(function(data,status,config,headers){
					angular.forEach(data,function(item,index){
						data[index].mapping = JSON.parse(data[index].mapping)
					})
					$scope.doors = data;
					$scope.vm.choseDoor = data.length>0?data[0]:[];
                    $scope.tagTypeChanged();
				})
		$http.get('/i/blower/getBlowerByColdStorageId?coldStorageId=' + $scope.vm.choseStorage.id
				).success(function(data,status,config,headers){
					angular.forEach(data,function(item,index){
						data[index].mapping = JSON.parse(data[index].mapping)
					})
					$scope.blowers = data;
					$scope.vm.choseBlower = data.length>0?data[0]:[];
            $scope.tagTypeChanged();
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
            angular.forEach($scope.windScreenSets, function (item, index) {
                $scope.windScreenSets[index].mapping = JSON.parse($scope.windScreenSets[index].mapping);
            })
            $scope.tagTypeChanged();
        })
	}

	$scope.changeCompressGroup = function () {
		$http.get('i/compressorGroup/findCompressorByGid?groupId='+$scope.vm.choseCompressGroup.id)
			.then(function (resp) {
				$scope.compressorSets = resp.data;
                angular.forEach($scope.compressorSets, function (item,index) {
                    $scope.compressorSets[index].mapping = JSON.parse($scope.compressorSets[index].mapping);
                })
                $scope.vm.choseCompressor = $scope.compressorSets?$scope.compressorSets[0]:{};
                $scope.tagTypeChanged();
			});
		$http.get("/i/spiderConfig/find/evaporativeWaterSet?groupid="+$scope.vm.choseCompressGroup.id).then(function (resp) {
			$scope.evaporativeWaterSets = resp.data;
			angular.forEach($scope.evaporativeWaterSets, function (item, index) {
				$scope.evaporativeWaterSets[index].mapping = JSON.parse($scope.evaporativeWaterSets[index].mapping);
			})
			$scope.tagTypeChanged();
		})
		$http.get("/i/spiderConfig/find/evaporativeBlowerSet?groupid="+$scope.vm.choseCompressGroup.id).then(function (resp) {
			$scope.evaporativeBlowerSets = resp.data;
			angular.forEach($scope.evaporativeBlowerSets, function (item, index) {
				$scope.evaporativeBlowerSets[index].mapping = JSON.parse($scope.evaporativeBlowerSets[index].mapping);
			})
			$scope.tagTypeChanged();
		})
	}

	$scope.mapping2Object = function (sets) {
	    if (sets.length <1)
	        return;
        angular.forEach(sets, function (item, index) {
        	if(item.mapping!=""){
              sets[index].mapping = JSON.parse(item.mapping);
        	}
        })
    }

	$scope.compressorSet={};
	$scope.addCompress = function () {
		var object = $scope.compressorSet;
		if($scope.vm.choseCompressGroup==undefined){alert("请设置压缩机组对象！");return;}
		object.compressorgroupid=$scope.vm.choseCompressGroup.id;
		$http.post("/i/compressorGroup/saveCompressor", object).then(function (resp) {
			alert(resp.data.message);
			$scope.compressorSet = {};
			$scope.changeCompressGroup();
		});
	}

	$scope.windScreenSet = {}
	$scope.addWindScreen = function () {
		var object = $scope.windScreenSet;
		if( $scope.vm.choseStorage==undefined){alert("请设置冷库对象！");return;}
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

    }
    $scope.evaporativeWaterSet = {};
    $scope.addEvaporativeWaterSet = function () {
        var object = $scope.evaporativeWaterSet;
        object.groupid= $scope.vm.choseCompressGroup.id;
        $http.post("/i/spiderConfig/add/evaporativeWaterSet", object).then(function (resp) {
            alert(resp.data.message);
            $scope.changeCompressGroup();
            $scope.evaporativeWaterSet = {};
        })
    }

    $scope.evaporativeBlowerSet = {}
    $scope.addEvaporativeBlowerSet = function () {
        var obj = $scope.evaporativeBlowerSet;
        obj.groupid = $scope.vm.choseCompressGroup.id;
        $http.post("/i/spiderConfig/add/evaporativeBlowerSet", obj).then(function (resp) {
            alert(resp.data.message);
            $scope.changeCompressGroup();
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

    $scope.forkliftSet = {}
    $scope.addForklift = function () {
        var obj = $scope.forkliftSet;
        obj = $scope.vm.choseRdc.id;
        $http.post("/i/spiderConfig/add/forkliftSet", obj).then(function (resp) {
            alert(resp.data.message);
            $scope.changeRdc();
            $scope.forkliftSet= {};
        })
    }

    $scope.addRdcIdAndName = function (obj, table) {
        obj.rdcid = $scope.vm.choseRdc.id;
        obj.table = table;
        debugger;
        $http.post("/i/spiderConfig/add/rdcidAndName", obj).then(function (resp) {
            alert(resp.data.message);
            obj.name = '';
            obj.power = '';
            $scope.changeRdc();
        })
    }

    $scope.delById = function(table,item, arrayData){
		var flag = confirm("确认删除？");
		if (flag) {
			$http.delete("/i/spiderConfig/delete/id", {
				params: {"table": table, "id": item.id}
			}).then(function (resp) {
				alert(resp.data.message);
				var index =  arrayData.indexOf(item);
				arrayData.splice(index, 1);
			})
		}
	}

    $scope.delByTableId = function(table,item, arrayData){
        var flag = confirm("确认删除？");
        if (flag) {
            $http.delete("/i/spiderConfig/delete/id", {
                params: {"table": table, "id": item.id}
            }).then(function (resp) {
                alert(resp.data.message);
                var index =  arrayData.indexOf(item);
                arrayData.splice(index, 1);
            })
        }
    }


	$scope.deviceChanges = function (choseDevice) {
        switch(choseDevice.type) {
            case 1:
                return $scope.storages;
            case 2:
                return $scope.doors;
            case 3:
                return $scope.compressGroups;
            case 4:
                return $scope.blowers;
            case 5:
                return $scope.compressorSets;
            case 6:
                return $scope.windScreenSets;
            case 7:
                return $scope.evaporativeSets;
            case 8:
                return $scope.evaporativeWaterSets;
            case 9:
                return $scope.evaporativeBlowerSets;
            case 10:
                return $scope.powerSets;
            case 11:
                return $scope.platformDoorSets;
            case 12:
                return $scope.pressurePlatformSets;
            case 13:
                return $scope.chargingpileSets;
            case 14:
                return $scope.forkliftSets;
            case 15:
                return $scope.coldStorageLightSets;
            case 16:
                return $scope.circulatingPumpSets;
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

        angular.forEach($scope.windScreenSets, function (item) {
            $scope.updateMapping("windscreenset", item);
        })
	}

	$scope.updateMapping = function (table, obj) {
        $http.post("/i/spiderConfig/update/mapping", {
            table:table,
            id:obj.id,
            mapping:JSON.stringify(obj.mapping)
        }).then(function (resp) {
        })
    }

    $scope.realSaveRdc = function () {
		$http.post("/i/spiderConfig/update/mapping", {
			table:'rdc',
			id:$scope.vm.choseRdc.id,
			mapping:JSON.stringify($scope.vm.choseRdc.mapping)
		}).then(function (resp) {
			alert('保存成功');
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

        angular.forEach($scope.compressorSets, function (item) {
            $scope.updateMapping("compressorset", item);
        })
		// angular.forEach($scope.evaporativeSets, function (item) {
		// 	$scope.updateMapping("evaporativeset", item);
		// })
		angular.forEach($scope.evaporativeBlowerSets, function (item) {
			$scope.updateMapping("evaporativeblowerset", item);
		})
		angular.forEach($scope.evaporativeWaterSets, function (item) {
			$scope.updateMapping("evaporativewaterset", item);
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
	
	//验证电话号码
	$scope.vertelephone=function(telephone){//验证手机号码
		var length = (telephone+'').length; 
		var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;
		return telephone&&length == 11 && mobile.test(telephone);
	};
	$scope.vccheckalltp=function(){
		var em=$("#maintaincform input[name=aTelephone]");
		if($scope.checkalltp()){em.parent().removeClass("has-error");}else{em.parent().addClass("has-error");};
	};
	$scope.checkalltp=function(){//验证手机号码
		var isllok=true;
		var atphone=$("#maintaincform input[name=aTelephone]").val();
		if(atphone!=""){
			var newth= atphone.split(";");
			$.each(newth, function(index, item) {if(!$scope.vertelephone(item)){isllok=false;}});
			return isllok;
		}else{
			return isllok;
		}
	};
	var issavemg=false;
	$scope.savemg = function(){//保存rdcmanger配置
		if(issavemg){return;}issavemg=true;
		var ckisok=$scope.checkalltp();
		if(ckisok){
			$("#maintaincform input[name=aTelephone]").parent().removeClass("has-error");
			 $.ajax({ url: '/i/rdc/adupRdcMangConfig',type: 'POST',data :$("#maintaincform").serialize(), success: function(data){
				 $scope.getmginf();
				 alert(data.message);
				 issavemg=false;
			 }});
		}else{
			 issavemg=false;
			$("#maintaincform input[name=aTelephone]").parent().addClass("has-error");
		}
	}
	$scope.resetmg = function(){//保存rdcmanger配置
		$scope.mg = $scope.oldmg ;
	}
	
	$scope.deleteAccount = function(){
		$http.post('/i/rdc/deleteSpiderConfig?rdcid=' + $scope.vm.choseRdc.id).success(function(data,status,config,headers){
			alert(data.message);
			$scope.vm.username = "";
			$scope.vm.password = "";
		});
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
		if( $scope.vm.choseStorage==undefined){alert("请设置冷库对象！");return;}
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
    $scope.tag = {}
	$scope.tagTypeChanged = function () {
       $scope.objectsOid = $scope.deviceChanges($scope.tag.type);
        $scope.deviceObjectMapping = {};
    }

    $scope.addTag = function () {
        var obj = {
            deviceid:$scope.tag.deviceid,
            type:$scope.tag.type.type,
            oid:$scope.tag.oid.id,
            rdcid:$scope.vm.choseRdc.id
        }
        $http.post("/i/spiderConfig/add/deviceObjectMapping", obj).then(function (resp) {
            alert(resp.data.message)
            obj.id = resp.data.status;
            $scope.deviceObjectMapping.push(obj);
            $scope.tag.deviceid = '';
        })
    }

    $scope.changeOid = function () {
        if ($scope.tag.type && $scope.tag.oid) {
            $http.get(coldWebUrl+'deviceObjectMapping/findByTypeOid', {
                params: {
                    type: $scope.tag.type.type,
                    oid: $scope.tag.oid.id
                }
            }).then(function (resp) {
                $scope.deviceObjectMapping = resp.data?resp.data:[];
            })
        }
    }

    $scope.delDeviceObjectMapping = function (item, arrayData) {
        var flag = confirm("确认删除？");
        if (flag) {
            $http.delete("/i/spiderConfig/del/deviceObjectMapping", {
                params: {"id": item.id}
            }).then(function (resp) {
                alert(resp.data.message);
                var index =  arrayData.indexOf(item);
                arrayData.splice(index, 1);
            })
        }
    }



	$scope.load();
	
});

coldWeb.directive("mappingTable", function ($http) {

    var defaults = {
        templateUrl: 'app/template/mappingTable.html'
    };


    var template_url = defaults.templateUrl;


    return {
        restrict: 'E',
        templateUrl: function (element, attrs) {
            return attrs.templateUrl || defaults.templateUrl;
        },
        scope:{
            objectSets:'=',
            objectKeys:'='
        },
        link: function (scope, element, attrs) {
            scope.name = attrs.name;
            scope.table = attrs.table;

            scope.deleteKey = function(object,key){
                delete object[key];
            }
            scope.addKey = function(object,key,value){
                if (key && value)
                    object[key] = value;
            }

            scope.resetItem = function(item,obj){
                scope.choseKey = "";
                scope.itemInput = "";
                obj.addItem = false;
            }
            scope.objectLength = function(obj){
                return Object.keys(obj).length;
            }
            scope.save = function () {
               if (scope.table && scope.table.length){
                   angular.forEach(scope.objectSets, function (item) {
                       $http.post("/i/spiderConfig/update/mapping", {
                           table:scope.table,
                           id:item.id,
                           mapping:JSON.stringify(item.mapping)
                       }).then(function (resp) {

                       })
                   })
                   alert("保存成功");
               }
            }
        }
    }
});
/**
 * @Params
 *  array-objects: 数组对象。每个对象必须有一个id属性，不然无法更新和删除
 *  update-url,delete-url:更新和删除的url地址
 *  colums: 需要在table中显示的列,csv格式
 *  colums-th: table中的th，csv格式，与colums对应
 *
 */
coldWeb.directive("ajaxTable", function ($http) {
	var defaults = {
		deleteUrl : '/i/spiderConfig/delete/id'
	}
    return {
        restrict: 'E',
        templateUrl: 'app/template/ajax-table.html',
        scope: {
            arrayObjects: '='
        },
        link: function (scope, element, attrs) {
            scope.columsTh = attrs.columsTh.split(',');
			scope.colums = attrs.colums.split(',');

			var updateUrl = attrs.updateUrl;
			var deleteUrl = attrs.deleteUrl?attrs.deleteUrl:defaults.deleteUrl;
			var table = attrs.table;

            scope.update = function (obj) {

				if (updateUrl){
				    var params = {id:obj.id};
				    for(var i=0; i<scope.colums.length; i++){
				    	params[scope.colums[i]] = obj[scope.colums[i]];
					}
					$http.post(updateUrl, params).then(function (resp) {
						alert(resp.data.message);
					})
				}
                obj.editable = false;
            }

            scope.delete = function (obj) {
				if(confirm("确定删除?")){
					var params = {id:obj.id};
					if (table){
						params.table = table;
					}
					$http.delete(deleteUrl,{
						params:params
					}).success(function(data,status,headers,config){
						alert(data.message);
						var i = scope.arrayObjects.indexOf(obj);
						scope.arrayObjects.splice(i, 1);
					});
				}
            }
        }
    }
})
