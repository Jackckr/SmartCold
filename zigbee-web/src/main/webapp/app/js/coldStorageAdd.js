/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageAdd', function ($rootScope, $scope, $state, $cookies, $http, Upload,$location) {
	$scope.load = function(){
		$http.get('/i/user/findUser').success(function(data,status,config,headers){
			$rootScope.user = data;
			if($rootScope.user == undefined || $rootScope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    })
    }
    $scope.load();
    $scope.editable = false;

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

    $scope.citySelected = function () {
       //alert($scope.cityId);
    }

    // 获取冷库经营类型
    $http.get('/i/rdc/findAllManageType').success(function (data) {
        $scope.manageTypes = data;
        //console.log(data.length + ":" + data[0].id);
        $scope.manageType = data[0].id;
    });

    $scope.ManageTypeSelected = function () {
        //alert($scope.manageType);
    }

    // 获取商品存放类型
    $http.get('/i/rdc/findAllTemperType').success(function (data) {
        $scope.temperTypes = data;
        //console.log(data.length + ":" + data[0].id);
        $scope.temperType = data[0].id;
    });

    $scope.TemperTypeSelected = function () {
        //alert($scope.temperType);
    }

    // 获取冷库温度类型
    $http.get('/i/rdc/findAllStorageType').success(function (data) {
        $scope.storageTypes = data;
        //console.log(data.length + ":" + data[0].id);
        $scope.storageType = data[0].id;
    });

    $scope.StorageTypeSelected = function () {
        //alert($scope.storageType);
    }

    $scope.moreInfos = true;
    // 检查输入的参数

    $scope.addMore = function () {
        $scope.moreInfos = !$scope.moreInfos;
    }

    // 获取冷链设施类型
    $http.get('/i/rdc/findAllCompanyDevice').success(function (data) {
        $scope.companyDevices = data;
        //console.log(data.length + ":" + data[0].id);
        $scope.companyDevice = data[0].id;
    });

    $scope.CompanyDeviceSelected = function () {
        //alert($scope.companyDevice);
    }


    // 制冷剂类型
    $http.get('/i/rdc/findAllStorageRefreg').success(function (data) {
        $scope.storageRefregs = data;
        //console.log(data.length + ":" + data[0].id);
        $scope.storageRefreg = data[0].id;
    });

    $scope.StorageRefregSelected = function () {
        //alert($scope.storageRefreg);
    }

    $scope.hasLihuoRoom = true;
    $scope.lihuoRoom = 0;

    $scope.ChangLihuoState = function () {
        $scope.hasLihuoRoom = !$scope.hasLihuoRoom;
    }

    $scope.files;

    $scope.coldTruck1 = 0;
    $scope.coldTruck2 = 0;
    $scope.coldTruck3 = 0;
    $scope.coldTruck4 = 0;
    $scope.capacity1 = 0;
    $scope.capacity2 = 0;
    $scope.capacity3 = 0;
    $scope.capacity4 = 0;
    $scope.capacity5 = 0;
    $scope.totalfiles = [];

    $scope.addFiles = function (files) {
        if($scope.totalfiles.length + files.length > 5){
            alert("最多上传五张图片");
            return;
        }
        $scope.totalfiles = $scope.totalfiles.concat(files);
    }
    $scope.addArrangePic = function (arrangePic) {
        //$scope.arrangePic = $scope.totalfiles.concat(arrangePic);
    }
/*    $scope.addHonorPic = function (honorPic) {
        //$scope.honorPic = $scope.totalfiles.concat(honorPic);
    }*/

    $scope.drop = function(file){
        angular.forEach($scope.totalfiles,function(item, key){
            if(item == file){
                $scope.totalfiles.splice(key,1);
            }
        })
    }
    function checkInput(){
        var flag = true;
        // 检查必须填写项
        if ($scope.name == undefined || $scope.name == '' || $scope.rdcForm.name.$error.ngRemoteValidate) {
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

//        if ($scope.coldTruck1 === 0 && $scope.coldTruck2 === 0 &&$scope.coldTruck3 === 0 &&$scope.coldTruck4 === 0) {
//            flag = false;
//        }

        if ($scope.phoneNum == undefined || $scope.phoneNum == '') {
            flag = false;
        }

/*        if ($scope.telphoneNum == undefined || $scope.telphoneNum == '') {
            flag = false;
        }*/
        return flag;
    }

    $scope.submit = function(){
        if (checkInput()){
            data = {
                file0: null,
                file1: null,
                file2: null,
                file3: null,
                file4: null,
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
                //telphoneNum : $scope.telphoneNum,
                remark: $scope.structure == undefined ? '' : encodeURI($scope.remark, "UTF-8"),

                tonnage : $scope.tonnage,
                structure: $scope.structure == undefined ? '' : encodeURI($scope.structure, "UTF-8"),
                companyDevice : $scope.companyDevice,
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
                facility: $scope.structure == undefined ? '' : encodeURI($scope.facility, "UTF-8"),
                //honorPic : $scope.honorPic,
                arrangePics : $scope.arrangePic,
            }
            for(i = 0; i < $scope.totalfiles.length; i++){
                data["file" + i] = $scope.totalfiles[i];
            }

/*            console.log("name: " + data.name);
            console.log("provinceId: " + data.provinceId);
            console.log("cityId: " + data.cityId);
            console.log("address: " + data.address);
            console.log("area: " + data.area);
            console.log("manageType: " + data.manageType);
            console.log("storageType: " + data.storageType);
            console.log("temperType: " + data.temperType);
            console.log("coldTruck1: " + data.coldTruck1);
            console.log("coldTruck2: " + data.coldTruck2);
            console.log("coldTruck3: " + data.coldTruck3);
            console.log("coldTruck4: " + data.coldTruck4);
            console.log("phoneNum: " + data.phoneNum);
            //console.log("telphoneNum: " + data.telphoneNum);
            console.log("remark: " + data.remark);

            console.log("tonnage: " + data.tonnage);
            console.log("structure: " + data.structure);
            console.log("companyDevice: " + data.companyDevice);
            console.log("platform: " + data.platform);
            console.log("lihuoRoom: " + data.lihuoRoom);
            console.log("lihuoArea: " + data.lihuoArea);
            console.log("lihuoTemperCtr: " + data.lihuoTemperCtr);
            console.log("storageRefreg: " + data.storageRefreg);
            console.log("temperRecord: " + data.temperRecord);
            console.log("capacity1: " + data.capacity1);
            console.log("capacity2: " + data.capacity2);
            console.log("capacity3: " + data.capacity3);
            console.log("capacity4: " + data.capacity4);
            console.log("capacity5: " + data.capacity5);
            console.log("facility: " + data.facility);
            //console.log("honorPic: " + data.honorPic);
            console.log("arrangePic: " + data.arrangePic);
            console.log("file0: " + data.file0);
            console.log("file1: " + data.file1);*/

            Upload.upload({
                url: '/i/rdc/addRdc',
                headers :{ 'Content-Transfer-Encoding': 'utf-8' },
                data: data
            }).then(function (resp) {
                alert("添加成功");
                $state.go('coldStoragelist', {});
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        } else {
            alert("请填写标记*的必选项在提交!");
        }


    }
});
