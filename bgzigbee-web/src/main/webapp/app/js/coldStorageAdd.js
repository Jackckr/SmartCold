/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageAdd', function ($rootScope, $scope, $state, $cookies, $http, Upload) {

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
        //alert($scope.temperType);
    }
 // 获取冷库结构类型
    $http.get('/i/rdc/findAllStorageStructureType').success(function (data) {
        $scope.structures = data;
        $scope.structure = data[0].id;
    });

    $scope.ManageTypeSelected = function () {
    }
    // 获取冷库温度类型
    $http.get('/i/rdc/findAllStorageType').success(function (data) {
        $scope.storageTypes = data;
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
        $scope.companyDevice = data[0].id;
    });

    $scope.CompanyDeviceSelected = function () {
    }


    // 制冷剂类型
    $http.get('/i/rdc/findAllStorageRefreg').success(function (data) {
        $scope.storageRefregs = data;
        $scope.storageRefreg = data[0].id;
    });

    $scope.StorageRefregSelected = function () {
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
    $scope.totalhonorfiles = [];

    $scope.addFiles = function (files) {
        if($scope.totalfiles.length + files.length > 5){
            alert("最多上传五张图片");
            return;
        }
        $scope.totalfiles = $scope.totalfiles.concat(files);
    }
    $scope.addHonorFiles = function (files) {
        if($scope.totalhonorfiles.length + files.length > 8){
            alert("最多上传八张图片");
            return;
        }
        $scope.totalhonorfiles = $scope.totalhonorfiles.concat(files);
    }
    $scope.addArrangePic = function (arrangePic) {
    }

    $scope.drop = function(file){
        angular.forEach($scope.totalfiles,function(item, key){
            if(item == file){
                $scope.totalfiles.splice(key,1);
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

        if ($scope.phoneNum == undefined || $scope.phoneNum == '') {
            flag = false;
        }

        return flag;
    }

    $scope.submit = function(){
        if (checkInput()){
        	$scope.submitButtonDisable = true;
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
                remark: $scope.structure == undefined ? '' : encodeURI($scope.remark, "UTF-8"),

                //tonnage : $scope.tonnage,
                structure: $scope.structure == undefined ? '' : encodeURI($scope.structure, "UTF-8"),
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
                facility: $scope.structure == undefined ? '' : encodeURI($scope.facility, "UTF-8"),
                arrangePics : $scope.arrangePic,
            }
            for(i = 0; i < $scope.totalfiles.length; i++){
                data["file" + i] = $scope.totalfiles[i];
            }


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
            alert("请填写标记<em>*<em>的必选项在提交!");
        }


    }
});
