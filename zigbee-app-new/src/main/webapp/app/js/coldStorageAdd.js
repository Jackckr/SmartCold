localStorage.oURL=document.URL;
checkLogin();
angular.module('rdcadd', ['remoteValidation','ngFileUpload']).controller('coldStorageAdd', function($scope,$http, Upload){
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	$scope.phoneNum = parseFloat(window.user.telephone);
	$scope.haveOrNots = [{id: 1,name: "有"},{ id: 2,name: "无"}];
    $scope.selected = [];
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
    //获取商品品类
    $http.get(ER.root + "/i/ShareRdcController/getGDFilterData").success(function (data) {
        $scope.productCategorys = data.entity.gt;
    });

    var updateSelected = function (action, id, name) {
        id = "" + id + "";
        if (action == 'add' && $scope.selected.indexOf(id) == -1) {
            $scope.selected.push(id);
        }
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
        }
        //alert($scope.selected);
    }
    //判断是在集合$scope.selected里去掉此id，还是加上id
    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, checkbox.name);
    }
    //设置复选框的选中状态
    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    }
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
       // $scope.storageRefreg = data[0].id;
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
    $scope.tempStandPic = [];
    $scope.auditPic = [];
    $scope.buildtype=1;
    $scope.capacityunit=$scope.rentcapacityunit="m³";
    $scope.addFiles = function (files) {
    	for(var j=0,fileLen=files.length;j<fileLen;j++){
    		var _file=files[j].name;
    		var i=_file.lastIndexOf('.');
    		var len=_file.length;
    		var extEndName=_file.substring(i+1, len);
    		var extName="GIF,BMP,JPG,JPEG,PNG";
        	//首先对格式进行验证
        	if(extName.indexOf(extEndName.toUpperCase())==-1) {
        		layer.open({content: "只能上传"+extName+"格式的文件",btn: '确定'});
        		return false
        	}else if(files[j].size > 10485760){
        		layer.open({content: "最大只能上传10M的图片",btn: '确定'});
        		return false
        	}
    	}
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
    $scope.addTempStandPic= function (files) {
    	for(var j=0,fileLen=files.length;j<fileLen;j++){
    		var _file=files[j].name;
    		var i=_file.lastIndexOf('.');
    		var len=_file.length;
    		var extEndName=_file.substring(i+1, len);
    		var extName="GIF,BMP,JPG,JPEG,PNG";
        	//首先对格式进行验证
        	if(extName.indexOf(extEndName.toUpperCase())==-1) {
        		layer.open({content: "只能上传"+extName+"格式的文件",btn: '确定'});
        		return false
        	}else if(files[j].size > 10485760){
        		layer.open({content: "最大只能上传10M的图片",btn: '确定'});
        		return false
        	}
    	}
    	if($scope.tempStandPic.length + files.length > 1){
            //alert("最多上传八张图片");
        	layer.open({
                content: '只能上传一张图片哦'
                ,btn: '确定'
              });
            return;
        }
        $scope.tempStandPic = $scope.tempStandPic.concat(files);
    }
    $scope.addAuditPic= function (files) {
        for(var j=0,fileLen=files.length;j<fileLen;j++){
            var _file=files[j].name;
            var i=_file.lastIndexOf('.');
            var len=_file.length;
            var extEndName=_file.substring(i+1, len);
            var extName="GIF,BMP,JPG,JPEG,PNG";
            //首先对格式进行验证
            if(extName.indexOf(extEndName.toUpperCase())==-1) {
                layer.open({content: "只能上传"+extName+"格式的文件",btn: '确定'});
                return false
            }else if(files[j].size > 10485760){
                layer.open({content: "最大只能上传10M的图片",btn: '确定'});
                return false
            }
        }
        if($scope.auditPic.length + files.length > 1){
            //alert("最多上传八张图片");
            layer.open({
                content: '只能上传一张图片哦'
                ,btn: '确定'
            });
            return;
        }
        $scope.auditPic = $scope.auditPic.concat(files);
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
        		layer.open({content: "只能上传"+extName+"格式的文件",btn: '确定'});
        		return false
        	}else if(files[j].size > 10485760){
        		layer.open({content: "最大只能上传10M的图片",btn: '确定'});
        		return false
        	}
    	}
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
    $scope.dropAuditPic = function(){
        $scope.auditPic.splice(0,1);
    }
    $scope.droptempStandPic = function(){
        $scope.tempStandPic.splice(0,1);
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
        if ($scope.totalcapacity == undefined || $scope.totalcapacity == '') {
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
        if ($scope.structure == undefined || $scope.structure == "") {
            flag = false;
        }
        if ($scope.platform == undefined || $scope.platform == "") {
            flag = false;
        }
        if ($scope.phoneNum == undefined || $scope.phoneNum == '') {
            flag = false;
        }
        if ($scope.height == undefined || $scope.height == '') {
            flag = false;
        }
        if ($scope.rentSqm == undefined || $scope.rentSqm == '') {
            flag = false;
        }
        if ($scope.capacityunit == undefined || $scope.capacityunit == "") {
            flag = false;
        }
        if ($scope.rentcapacityunit == undefined || $scope.rentcapacityunit == "") {
            flag = false;
        }
        if ($scope.buildtype == undefined || $scope.buildtype == "") {
            flag = false;
        }
        if ($scope.selected == undefined || $scope.selected == "" ||$scope.selected.length==0) {
            flag = false;
        }
        return flag;
    }
    $scope.ChangLihuoState=function (val) {
        if(val==2){
            $scope.islihuoRoom=false;
        }else {
            $scope.islihuoRoom=true;
        }
    }
    $scope.changeBuildType=function () {
        $scope.isBuildFloors=$scope.buildtype==2?true:false;
    }
    $scope.submit = function(){
        if($scope.rdcForm.name.$error.ngRemoteValidate){
            layer.open({content:'该冷库名已被占用，请重新输入~',btn: '确定'});
            return false
        }
        if($scope.height<=0){
            layer.open({content:'冷库高度不合法，请重新输入~',btn: '确定'});
            return false
        }
    	if(checkMobile($scope.phoneNum.toString().trim()) == false){
			layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
			return false
		}
		if($scope.totalfiles.length<3){
            layer.open({content:'冷库图片至少上传3张！',btn: '确定'});
            return false
        }
        if (checkInput()){
            /*if($scope.area-$scope.rentSqm<0){
                layer.open({content:'总面积不能小于可出租面积！',btn: '确定'});
                return false
            }*/
            if($scope.isJoinStand==1&&$scope.tempStandPic.length<1){
                layer.open({content:'请上传冷库温度达标认证图！',btn: '确定'});
                return false;
            }
            if($scope.phoneNum.toString().trim().length != 11){
	        	layer.open({content:'手机号码有误哦~',btn: '确定'});return;
	        }
            var areaRex = /^[0-9]{1}[\d]{0,10}\.*[\d]{0,2}$/;
            var countRex = /^[0-9]\d*$/;
            var urlRegex=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (($scope.website!=undefined&&$scope.website!='')&&!urlRegex.test($scope.website)) {
                layer.open({content: '企业网址输入有误！(如：http://liankur.com)', btn: '确定'});
                return false;
            }
            if ($scope.area!=undefined&&$scope.area!=""&&!areaRex.test($scope.area)) {
                layer.open({content:'面积输入有误！(小数点后最多保留两位，如：15.28)',btn: '确定'});
                return false;
            }
            if (!areaRex.test($scope.rentSqm)) {
                layer.open({content:'可出租面积输入有误！(小数点后最多保留两位，如：15.28)',btn: '确定'});
                return false;
            }
            if ($scope.totalcapacity<10) {
                layer.open({content:'总容量不能小于10',btn: '确定'});
                return false;
            }
            if ($scope.height<3||$scope.height>40) {
                layer.open({content:'冷库净高度输入已超出（3m~40m）范围',btn: '确定'});
                return false;
            }
            if (!areaRex.test($scope.height)) {
                layer.open({content:'冷库净高度输入有误！(小数点后最多保留两位，如：15.28)',btn: '确定'});
                return false;
            }
            if($scope.buildtype==2&&!countRex.test($scope.buildfloors)&&$scope.buildfloors<2){
                layer.open({content: '请填写正确的库层高度！', btn: '确定'});
                return false;
            }
            if ($scope.capacity1 != undefined && $scope.capacity1 != "" && !areaRex.test($scope.capacity1) ||
                $scope.capacity2 != undefined && $scope.capacity2 != "" && !areaRex.test($scope.capacity2) ||
                $scope.capacity3 != undefined && $scope.capacity3 != "" && !areaRex.test($scope.capacity3) ||
                $scope.capacity4 != undefined && $scope.capacity4 != "" && !areaRex.test($scope.capacity4)) {
                layer.open({content: '冷库分库容积输入有误！(小数点后最多保留两位，如：15.28)', btn: '确定'});
                return false;
            }
            if((($scope.capacity1 != ""&& $scope.capacity1!=0) && ($scope.height1==""||$scope.height1==undefined)) ||
                (($scope.capacity2 != ""&&$scope.capacity2!=0) && ($scope.height2==""||$scope.height2==undefined)) ||
                (($scope.capacity3 != ""&&$scope.capacity3!=0) && ($scope.height3==""||$scope.height3==undefined))||
                (($scope.capacity4 != ""&&$scope.capacity4!=0) && ($scope.height4==""||$scope.height4==undefined))){
                layer.open({content: '冷库分库容积中，单位未填写！', btn: '确定'});
                return false;
            }
            if((( $scope.capacity1 == "" ||$scope.capacity1==0) && ($scope.height1!=""&&$scope.height1!=undefined)) ||
                (($scope.capacity2 == "" ||$scope.capacity2==0) && ($scope.height2!=""&&$scope.height2!=undefined)) ||
                (($scope.capacity3 == "" ||$scope.capacity3==0) && ($scope.height3!=""&&$scope.height3!=undefined))||
                (($scope.capacity4 == "" ||$scope.capacity4==0) && ($scope.height4!=""&&$scope.height4!=undefined))){
                layer.open({content: '冷库分库容积中，容积未填写！', btn: '确定'});
                return false;
            }
            if ($scope.coldTruck1!=undefined&&$scope.coldTruck1 != "" && !countRex.test($scope.coldTruck1) ||$scope.coldTruck2!=undefined&& $scope.coldTruck2 != "" && !countRex.test($scope.coldTruck2) ||
                $scope.coldTruck3!=undefined&&$scope.coldTruck3 != "" && !countRex.test($scope.coldTruck3) ||$scope.coldTruck4!=undefined&& $scope.coldTruck4 != "" && !countRex.test($scope.coldTruck4)) {
                layer.open({content:'冷藏车数量输入有误！',btn: '确定'});
                return false;
            }
            if ($scope.lihuoArea != undefined &&$scope.lihuoArea != "" && !areaRex.test($scope.lihuoArea)) {
                layer.open({content:'理货区面积输入有误！(小数点后最多保留两位，如：15.28)',btn: '确定'});
                return false;
            }
        	layer.open({
        		type: 2
        		,content: '努力加载中~~~'
        		,shadeClose:false
		    });
            $scope.isDisabled = true;
            if($scope.buildtype!=2){
                $scope.buildfloors=1;
            }
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
                rentSqm:$scope.rentSqm,
                height:$scope.height,
                openLIne:$scope.openLIne,
                isJoinStand:$scope.isJoinStand,
                manageType : $scope.manageType,
                storageType : $scope.storageType,
                temperType : $scope.temperType,
                coldTruck1 : $scope.coldTruck1,
                coldTruck2 : $scope.coldTruck2,
                coldTruck3 : $scope.coldTruck3,
                coldTruck4 : $scope.coldTruck4,
                phoneNum : $scope.phoneNum.toString().trim(),
                remark: $scope.remark == undefined ? '' : encodeURI($scope.remark, "UTF-8"),
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
                totalcapacity: $scope.totalcapacity,
                capacityunit: $scope.capacityunit,
                rentcapacityunit: $scope.rentcapacityunit,
                productcategory: $scope.selected.join(),
                buildtype: $scope.buildtype,
                website: $scope.website,
                buildfloors: $scope.buildfloors,
                standPic:null,
                auditPic:null
            }
            for(var i = 0; i < $scope.totalfiles.length; i++){
                data["file" + i] = $scope.totalfiles[i];
            }
            for(var j = 0; j < $scope.totalhonorfiles.length; j++){
                data["honor" + j] = $scope.totalhonorfiles[j];
            }
            data["standPic"]=$scope.tempStandPic[0];
            data["auditPic"]=$scope.auditPic[0];
            Upload.upload({
                url: ER.root+'/i/rdc/newAddRdc',
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