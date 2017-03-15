/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageEdit', function ($rootScope, $scope, $state, $cookies, $http, Upload, $stateParams,$location, $uibModal, $log) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data,status,config,headers){
				$rootScope.user = data;
				if($rootScope.user == undefined || $rootScope.user.id == 0){
					url = "http://" + $location.host() + ":" + $location.port();
					window.location.href = url;
				}
		})
	}
	$scope.load();
    $scope.editable = true;
    $scope.isDisabled = false;
    $scope.totalfiles = [];
    $scope.totalhonorfiles = [];
    $scope.arrangePics = [];
    $scope.haveOrNots = [];
    $scope.haveOrNots.push({
        id: 0,
        name: "无",
    });
    $scope.haveOrNots.push({
        id: 1,
        name: "有",
    });

    // 获取省列表
    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });

    // 根据省ID查询城市列表
    $scope.provinceSelected = function () {
        $http.get('/i/city/findCitysByProvinceId', {
            params: {
                "provinceID": $scope.provinceId
            }
        }).success(function (data) {
            $scope.citys = data;
            $scope.cityId = data[0].cityID;
        });
    }
    
    // 获取冷库结构类型
    $http.get('/i/rdc/findAllStorageStructureType').success(function (data) {
        $scope.structures = data;
        $scope.structure = data[0].id;
    });

    $scope.citySelected = function () {
    }

    // 获取冷库经营类型
    $http.get('/i/rdc/findAllManageType').success(function (data) {
        $scope.manageTypes = data;
        $scope.manageType = data[0].id;
    });

    $scope.ManageTypeSelected = function () {
    }

    // 获取商品存放类型
    $http.get('/i/rdc/findAllTemperType').success(function (data) {
        $scope.temperTypes = data;
        $scope.temperType = data[0].id;
    });

    $scope.TemperTypeSelected = function () {
    }

    // 获取冷库温度类型
    $http.get('/i/rdc/findAllStorageType').success(function (data) {
        $scope.storageTypes = data;
        $scope.storageType = data[0].id;
    });

    $scope.StorageTypeSelected = function () {
    }

    $scope.moreInfos = true;

    $scope.addMore = function () {
        $scope.moreInfos = !$scope.moreInfos;
    }

    /*// 获取冷链设施类型
    $http.get('/i/rdc/findAllCompanyDevice').success(function (data) {
        $scope.companyDevices = data;
        $scope.companyDevice = data[0].id;
    });*/

    $scope.CompanyDeviceSelected = function () {
    }

    // 制冷剂类型
    $http.get('/i/rdc/findAllStorageRefreg').success(function (data) {
        $scope.storageRefregs = data;
        $scope.storageRefreg = data[0].id;
    });

    $scope.StorageRefregSelected = function () {
    }

    $scope.ChangLihuoState = function () {
        $scope.hasLihuoRoom = !$scope.hasLihuoRoom;
    }


    $scope.rdcId = $stateParams.rdcID;

    // 获取当前冷库的详情
    $http.get('/i/rdc/findRDCDTOByRDCId', {
        params: {
            "rdcID": $stateParams.rdcID
        }
    }).success(function (data) {
        $scope.name = data[0].name;
        $scope.address = data[0].address;
        $scope.provinceId = data[0].provinceId;
        $scope.cityId = data[0].cityId;
        $scope.area = data[0].area;
        $scope.manageType = data[0].manageType;
        $scope.storageType = data[0].storageType;
        $scope.temperType = data[0].temperType;
        $scope.phoneNum = data[0].phoneNum;
        $scope.remark = data[0].remark;
        //$scope.tonnage = data[0].tonnage;
        $scope.structure = data[0].structure;
        //$scope.companyDevice = data[0].companyDevice;
        $scope.platform = data[0].platform;
        $scope.lihuoRoom = data[0].lihuoRoom;
        $scope.arrangePic = data[0].arrangepiclocation;
        $scope.arrangePicShow = data[0].arrangePic;
        $scope.storagePicShow = data[0].storagePics;
        $scope.honorPicShow = data[0].honorPics;
        $scope.storagePic = angular.fromJson( data[0].storagePicLocation);
        if($scope.lihuoRoom === 0){
            $scope.hasLihuoRoom = true;
        } else {
            $scope.hasLihuoRoom = false;
        }

        $scope.lihuoArea = data[0].lihuoArea;
        $scope.lihuoTemperCtr = data[0].lihuoTemperCtr;
        $scope.storageRefreg = data[0].storageRefreg;
        $scope.temperRecord = data[0].temperRecord;
        $scope.capacity1 = data[0].capacity1;
        $scope.capacity2 = data[0].capacity2;
        $scope.capacity3 = data[0].capacity3;
        $scope.capacity4 = data[0].capacity4;
        $scope.capacity5 = data[0].capacity5;
        $scope.height1 = data[0].height1;
        $scope.height2 = data[0].height2;
        $scope.height3 = data[0].height3;
        $scope.height4 = data[0].height4;
        $scope.height5 = data[0].height5;
        $scope.coldTruck1 = data[0].coldTruck1;
        $scope.coldTruck2 = data[0].coldTruck2;
        $scope.coldTruck3 = data[0].coldTruck3;
        $scope.coldTruck4 = data[0].coldTruck4;
        $scope.facility = data[0].facility;

        // 根据省ID查询城市列表
        $http.get('/i/city/findCitysByProvinceId', {
            params: {
                "provinceID": $scope.provinceId
            }
        }).success(function (data) {
            $scope.citys = data;
            $scope.cityId = data[0].cityID;
        });
    });
    
    $scope.drop = function(file){
        angular.forEach($scope.totalfiles,function(item, key){
            if(item == file){
                $scope.totalfiles.splice(key,1);
            }
        })
    }
    $scope.dropArrangePic = function(file){
        angular.forEach($scope.arrangePics,function(item, key){
            if(item == file){
                $scope.arrangePics.splice(key,1);
            }
        })
    }
    $scope.drophonor = function(honorfile){
        angular.forEach($scope.totalhonorfiles,function(item, key){
            if(item == honorfile){
                $scope.totalhonorfiles.splice(key,1);
            }
        })
    }
    function checkCommit(){
    	if($scope.remark.length>250)
    		return false;
    	else
    		return true;
    }

    function checkInput(){
        var flag = true;
        // 检查必须填写项
        if ($scope.name == undefined || $scope.name == '') {
            flag = false;
        }
        if ($scope.provinceId == undefined || $scope.provinceId == '') {
            flag = false;
        }
        if ($scope.cityId == undefined || $scope.cityId == '') {
            flag = false;
        }
        if ($scope.address == undefined || $scope.address == '') {
            flag = false;
        }
        if ($scope.area == undefined || $scope.area == '') {
            flag = false;
        }

        if ($scope.manageType == undefined || $scope.manageType == '') {
            flag = false;
        }

        if ($scope.storageType == undefined || $scope.storageType == '') {
            flag = false;
        }

        if ($scope.temperType == undefined || $scope.temperType == '') {
            flag = false;
        }

        if ($scope.phoneNum == undefined || $scope.phoneNum == '') {
            flag = false;
        }
        return flag;
    }
    
    $scope.addFiles = function (files) {
        if($scope.totalfiles.length + files.length > 5){
            alert("最多上传五张图片");
            return;
        }
        $scope.totalfiles = $scope.totalfiles.concat(files);
    }
    $scope.addArrangePic = function (files) {
        $scope.arrangePics = $scope.arrangePics.concat(files);
    }
    $scope.addHonorFiles = function (files) {
        if($scope.totalhonorfiles.length + files.length > 8){
            alert("最多上传八张图片");
            return;
        }
        $scope.totalhonorfiles = $scope.totalhonorfiles.concat(files);
    }

    $scope.submit = function(){
    if(checkCommit()){
        if (checkInput()){
            $scope.isDisabled = true;
            data = {
                file0: null,
                file1: null,
                file2: null,
                file3: null,
                file4: null,
                honor0: null,
                honor1: null,
                honor2: null,
                honor3: null,
                honor4: null,
                honor5: null,
                honor6: null,
                honor7: null,
                name : encodeURI($scope.name,"UTF-8"),
                provinceId : $scope.provinceId,
                cityId : $scope.cityId,
                address : encodeURI($scope.address,"UTF-8"),
                area : $scope.area,
                manageType : $scope.manageType,
                storageType : $scope.storageType,
                temperType : $scope.temperType,
                coldTruck1 : $scope.coldTruck1,
                coldTruck2 : $scope.coldTruck2,
                coldTruck3 : $scope.coldTruck3,
                coldTruck4 : $scope.coldTruck4,
                phoneNum : $scope.phoneNum,
                remark : $scope.structure == undefined ? '' : encodeURI($scope.remark, "UTF-8"),

                //tonnage : $scope.tonnage,
                structure : $scope.structure == undefined ? '' : encodeURI($scope.structure, "UTF-8"),
                //companyDevice : $scope.companyDevice,
                platform : $scope.platform,
                lihuoRoom : $scope.lihuoRoom,
                lihuoArea : $scope.lihuoArea,
                lihuoTemperCtr : $scope.lihuoTemperCtr,
                storageRefreg : $scope.storageRefreg,
                temperRecord : $scope.temperRecord,
                capacity1 : $scope.capacity1,
                capacity2 : $scope.capacity2,
                capacity3 : $scope.capacity3,
                capacity4 : $scope.capacity4,
                capacity5 : $scope.capacity5,
                height1 : $scope.height1,
                height2 : $scope.height2,
                height3 : $scope.height3,
                height4 : $scope.height4,
                height5 : $scope.height5,
                facility : $scope.structure == undefined ? '' : encodeURI($scope.facility, "UTF-8"),
                arrangePics : $scope.arrangePic,
                rdcId: $stateParams.rdcID
            }
            for(var i = 0; i < $scope.totalfiles.length; i++){
                data["file" + i] = $scope.files[i];
            }
            for(var j = 0; j < $scope.totalhonorfiles.length; j++){
                data["honor" + j] = $scope.totalhonorfiles[j];
            }

            Upload.upload({
                url: '/i/rdc/updateRdc',
                headers :{ 'Content-Transfer-Encoding': 'utf-8' },
                data: data
            }).then(function (resp) {
                $scope.isDisabled = false;
                alert("修改成功");
                $state.go('coldStoragelist', {});
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        } else {
            alert("请填写标记<em>*</em>的必选项在提交!");
        }
    }
    else{
    	alert("备注长度不得250字符!");
    }
   }

    $scope.goPicDetail = function(item){
        var modalInstance = $uibModal.open({
            templateUrl: 'myModelContent.html',  //指向上面创建的视图
            controller: 'ModalInstanceCtrl',// 初始化模态范围
            resolve: {
                itemPic: function () {
                    return item;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date())
        })
    }

    $scope.deletePic = function(filedata){
        var r = confirm("删除图片?");
        if(r){
            $http({
                method:'DELETE',
                url:'i/rdc/deleteStoragePic',
                params:filedata
            }).success(function(){
                var index = $scope.storagePicShow.indexOf(filedata);
                if(index>=0)
                    $scope.storagePicShow.splice(index,1);
                else{
                    $scope.arrangePicShow = null;
                }
            })
        }
    }

    $scope.deleteHonorPic = function(filedata){
        var r = confirm("删除荣誉图片?");
        if(r){
            $http({
                method:'DELETE',
                url:'i/rdc/deleteStoragePic',
                params:filedata
            }).success(function(){
                var index = $scope.honorPicShow.indexOf(filedata);
                if(index>=0)
                    $scope.honorPicShow.splice(index,1);
                else{
                    $scope.arrangePicShow = null;
                }
            })
        }
    }
    /*检查输入的数字是否为》0   2017-3-13*/
   	function checkNum(){
   		var numLen = $("input[type='number']");
   		for(var i=0;i<numLen.length;i++){
   			if(numLen[i].value<0){
   				$(".mybtn").attr('disabled',true);
   				numLen[i].style.borderColor = "red";
   				return false
   			}else{
   				numLen[i].style.borderColor = "#ccc";
   			}
   		}
   	}
   	/*检查输入的数字是否为》0   2017-3-13*/
   	$("input[type='number']").blur(function(){
   		if($(this).val()<0){
   			alert('输入的数字不能为负数哦');//
   			$(this).css("borderColor","red")
   			$(".mybtn").attr('disabled',true)
   			return false
   		}else{
   			$(this).css("borderColor","#ccc");
   			if(checkNum()==false){
	   			alert('其他地方的输入数字也不能为负数哦，请检查');
	   		}else{
	   			$(".mybtn").attr('disabled',false);
	   			$("input[type='number']").css("borderColor","#ccc")
	   			return true;
	   		}
   		}
   	})
});


coldWeb.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, itemPic) { //依赖于modalInstance
    $scope.itemPic = itemPic;
    $scope.ok = function () {
        $uibModalInstance.close(); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel'); // 退出
    }
})
