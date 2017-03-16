checkLogin();
angular.module('rdcadd', ['remoteValidation','ngFileUpload']).controller('coldStorageAdd', function($scope,$http, Upload){
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	$scope.phoneNum = parseFloat(window.user.telephone.trim());
	$scope.haveOrNots = [{id: 1,name: "有"},{ id: 0,name: "无"}];
    // 获取省列表
	$.ajax({ url: ER.root+"/i/UtilController/setVisited",type: "POST",data:{type:6}});
    $http.get(ER.root+'/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });
    // 根据省ID查询城市列表
    $scope.provinceSelected = function () {
        $http.get(ER.root+'/i/city/findCitysByProvinceId', {
            params: {
                "provinceID": $scope.provinceId
            }
        }).success(function (data) {
            $scope.citys = data;
            $scope.cityId = data[0].cityID;
        });
    }
    // 获取冷库经营类型
    $http.get(ER.root+'/i/rdc/findAllManageType').success(function (data) {
        $scope.manageTypes = data;
        $scope.manageType = data[0].id;
    });
    // 获取冷库结构类型
    $http.get(ER.root+"/i/rdc/findAllStorageStructureType").success(function (data) {
        $scope.structures = data;
        $scope.structure = data[0].id;
    });
    // 获取商品存放类型
    $http.get(ER.root+'/i/rdc/findAllTemperType').success(function (data) {
        $scope.temperTypes = data;
        $scope.temperType = data[0].id;
    });
    // 获取冷库温度类型
    $http.get(ER.root+'/i/rdc/findAllStorageType').success(function (data) {
        $scope.storageTypes = data;
        $scope.storageType = data[0].id;
    });
    // 获取冷链设施类型
    $http.get(ER.root+'/i/rdc/findAllCompanyDevice').success(function (data) {
        $scope.companyDevices = data;
        $scope.companyDevice = data[0].id;
    });
    // 制冷剂类型
    $http.get(ER.root+'/i/rdc/findAllStorageRefreg').success(function (data) {
        $scope.storageRefregs = data;
        $scope.storageRefreg = data[0].id;
    });
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
    $scope.arrangePics = [];
    $scope.addFiles = function (files) {
        if($scope.totalfiles.length + files.length > 5){
           // alert("最多上传五张图片");
            layer.open({
                content: '最多上传五张图片哦'
                ,btn: '确定'
              });
            return;
        }
        $scope.totalfiles = $scope.totalfiles.concat(files);
    }
    $scope.addArrangePic= function (files) {
    	if($scope.arrangePics.length + files.length > 1){
            //alert("最多上传八张图片");
        	layer.open({
                content: '只能上传一张图片哦'
                ,btn: '确定'
              });
            return;
        }
        $scope.arrangePics = $scope.arrangePics.concat(files);
    }
    $scope.addHonorFiles = function (files) {
        if($scope.totalhonorfiles.length + files.length > 8){
            //alert("最多上传八张图片");
        	layer.open({
                content: '最多上传八张图片哦'
                ,btn: '确定'
              });
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
        	if(parseFloat($scope.area).toFixed(2).length>11){
				layer.open({content:'面积不合法哦~',btn: '确定'});return;
	        }else if($scope.phoneNum.toString().trim().length != 11){
	        	layer.open({content:'手机号码有误哦~',btn: '确定'});return;
	        }
        	layer.open({
        		type: 2
        		,content: '努力加载中~~~'
        		,shadeClose:false
		    });
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
                phoneNum : $scope.phoneNum.toString().trim(),
                remark: $scope.structure == undefined ? '' : encodeURI($scope.remark, "UTF-8"),
               // tonnage : $scope.tonnage,
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
                userid : window.user.id,
                arrangePics : $scope.arrangePic,
            }
            for(var i = 0; i < $scope.totalfiles.length; i++){
                data["file" + i] = $scope.totalfiles[i];
            }
            for(var j = 0; j < $scope.totalhonorfiles.length; j++){
                data["honor" + j] = $scope.totalhonorfiles[j];
            }
            Upload.upload({
                url: ER.root+'/i/rdc/addRdc',
                headers :{ 'Content-Transfer-Encoding': 'utf-8' },
                withCredentials : true,
                data: data
            }).then(function (resp) {
                $scope.isDisabled = false;
                //alert("添加成功");
                $('.mybtn').attr('disabled',true);
            	$('.mybtn').css('backgroundColor','gray');
            	layer.closeAll();
                layer.open({
	                content: '添加成功'
	                ,btn: '确定' 
	            	,shadeClose:false
	                ,yes:function(){
	                	window.location.href='releasesuccess.html?id=0';
	                }
	              });               
                
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        } else {        	
            //alert("请填写标记*的必选项在提交!");
            layer.open({
                content: '请填写标记<em>*</em>的必选项再提交哦'
                ,btn: '确定'
              });
        }
    }
});