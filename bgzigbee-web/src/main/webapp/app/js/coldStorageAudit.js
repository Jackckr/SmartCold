/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageAudit', function ($rootScope, $scope, $state, $cookies, $http, Upload, $stateParams) {

    $scope.editable = true;
    $scope.totalfiles = [];
    $scope.totalhonorfiles = [];

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

    // 获取冷库温度类型
    $http.get('/i/rdc/findAllStorageType').success(function (data) {
        $scope.storageTypes = data;
        $scope.storageType = data[0].id;
    });

    $scope.StorageTypeSelected = function () {
    }

    $scope.moreInfos = true;

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
        $scope.tonnage = data[0].tonnage;
        $scope.structure = data[0].structure;
        $scope.companyDevice = data[0].companyDevice;
        $scope.platform = data[0].platform;
        $scope.lihuoRoom = data[0].lihuoRoom;
        $scope.arrangePicShow = data[0].arrangePic;
        $scope.storagePicShow = data[0].storagePics;
        $scope.honorPicShow = data[0].honorPics;
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

    $scope.submit = function(){
        $scope.submitButtonDisable = true;
        var r=confirm("通过审核？");
        var audit = r?1:-1;
        $http({
            'method':'POST',
            'url':'/i/rdc/changeAudit',
            'params':{
                'rdcID':$stateParams.rdcID,
                'audit':audit
            }
        })
        $state.go('coldStoragelist', {});
    }

    $scope.honorAudit = function(rdcId){
        $state.go('coldStorageHonorAudit', {"rdcId": rdcId});
    }

    $rootScope.person = {
        pingpong: true,
        football: true,
        basketball: false
    };
});