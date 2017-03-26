/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageAdd', function ($rootScope, $scope, $state, $cookies, $http, Upload,$location) {
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
    $scope.editable = false;
    $scope.isDisabled = false;
    $scope.phoneNum = user.telephone;
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
    
 // 获取冷库结构类型
    $http.get('/i/rdc/findAllStorageStructureType').success(function (data) {
        $scope.structures = data;
        $scope.structure = data[0].id;
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
    $scope.honorfiles;

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
    	for(var j=0,fileLen=files.length;j<fileLen;j++){
    		var _file=files[j].name;
    		var i=_file.lastIndexOf('.');
    		var len=_file.length;
    		var extEndName=_file.substring(i+1, len);
    		var extName="GIF,BMP,JPG,JPEG,PNG";
        	//首先对格式进行验证
        	if(extName.indexOf(extEndName.toUpperCase())==-1) {
        		alert("只能上传"+extName+"格式的文件");
        		return false
        	}
    	}
    	if($scope.totalfiles.length + files.length > 5){
            alert("最多上传五张图片");
            return;
        }
        $scope.totalfiles = $scope.totalfiles.concat(files);
    }
    $scope.addHonorFiles = function (files) {
    	for(var j=0,fileLen=files.length;j<fileLen;j++){
    		var _file=files[j].name;
    		var i=_file.lastIndexOf('.');
    		var len=_file.length;
    		var extEndName=_file.substring(i+1, len);
    		var extName="GIF,BMP,JPG,JPEG,PNG";
        	//首先对格式进行验证
        	if(extName.indexOf(extEndName.toUpperCase())==-1) {
        		alert("只能上传"+extName+"格式的文件");
        		return false
        	}
    	}
    	if($scope.totalhonorfiles.length + files.length > 8){
            alert("最多上传八张图片");
            return;
        }
        $scope.totalhonorfiles = $scope.totalhonorfiles.concat(files);
        
    }
    $scope.addArrangePic = function (files) {
    	for(var j=0,fileLen=files.length;j<fileLen;j++){
    		var _file=files[j].name;
    		var i=_file.lastIndexOf('.');
    		var len=_file.length;
    		var extEndName=_file.substring(i+1, len);
    		var extName="GIF,BMP,JPG,JPEG,PNG";
        	//首先对格式进行验证
        	if(extName.indexOf(extEndName.toUpperCase())==-1) {
        		alert("只能上传"+extName+"格式的文件");
        		return false
        	}
    	}
    	angular.forEach($scope.arrangePics,function(item, key){
            if(item == file){
                $scope.arrangePics.splice(key,1);
            }
        })
        $scope.arrangePics = $scope.arrangePics.concat(files);
    	
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
    	if(checkMobile($scope.phoneNum.toString().trim()) == false){
    		alert("请输入正确的手机号码或者座机号码~");
    		return false
		}
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
                url: '/i/rdc/addRdc',
                headers :{ 'Content-Transfer-Encoding': 'utf-8' },
                data: data
            }).then(function (resp) {
                $scope.isDisabled = false;
                alert("添加成功");
                $state.go('coldStoragelist', {});
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        } else {
            alert("请填写标记<em>*</em>的必选项在提交!");
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
/*上传图片格式校验    2017 -3 -20*/
function getImageType(obj) {
	var _file=$(obj)[0];
	var i=_file.value.lastIndexOf('.');
	var len=_file.value.length;
	var extEndName=_file.value.substring(i+1, len);
	var extName="GIF,BMP,JPG,JPEG,PNG";
	
	//首先对格式进行验证
	if(extName.indexOf(extEndName.toUpperCase())==-1) {
		//filemessage.innerHTML="*您只能输入"+extName+"格式的文件"
		alert("只能上传"+extName+"格式的文件");
		//$(".mybtn").attr('disabled',true)
		return false
	}else{
//   			$(".mybtn").attr('disabled',false);
		return true;
	}
}