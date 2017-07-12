localStorage.oURL=document.URL;
checkLogin();
angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) {
	$http.defaults.withCredentials=true;  $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	var id=getUrlParam("id");
	var onoff = true;
	$scope.totalfiles = [];
	$scope.unit = "元/天·平方米"; 
	$scope.telephone =  window.user.telephone.trim();
	if(id){
		$http.get(ER.root+'/i/ShareRdcController/getRdcByUid', { params: {  "rdcId": id,uid:window.user.id } }).success(function (data) {
	    	if(data.success){ $scope.rdcdto = data.data[0];}
		});
	};
	
	$scope.goaddrdcpag=function(){  $location.path("/coldStorageAdd");  };
	     // 获取省列表
    $http.get(ER.root+'/i/city/findProvinceList').success(function (data) { 
    	$scope.provinces = data;  
    	
    });
    //租期类型
    $scope.rentDateTypes = [{id:1,type:"1个月以下"},{id:2,type:"1~3个月"},{id:3,type:"3~6个月"},{id:4,type:"6~9个月"},{id:5,type:"1年以上"},{id:6,type:"两年以上"},{id:7,type:"三年以上"},{id:8,type:"五年以上"}];
    $scope.rentdate=$scope.rentDateTypes[0].id;
    // 根据省ID查询城市列表
    $scope.provinceSelected = function () {
        $http.get(ER.root+'/i/city/findCitysByProvinceId', {  params: {  "provinceID": $scope.provinceId }  }).success(function (data) {
            $scope.citys = data;
            $scope.cityId = data[0].cityID;
        });
    };
    // 根据出发地省ID查询城市列表
    $scope.stprovinceSelected = function () {
        $http.get(ER.root+'/i/city/findCitysByProvinceId', {  params: { "provinceID": $scope.stprovinceID  } }).success(function (data) {
            $scope.stcitys = data;
            $scope.stcityId = data[0].cityID;
        });
    };
    // 根据目的地省ID查询城市列表
    $scope.toprovinceSelected = function () {
        $http.get(ER.root+'/i/city/findCitysByProvinceId', { params: {  "provinceID": $scope.toprovinceID  }  }).success(function (data) {
            $scope.tocitys = data;
            $scope.tocityId = data[0].cityID;
        });
    };
 
    // 获取商品温度类型
    $http.get(ER.root+'/i/rdc/findAllTemperType').success(function (data) {
        $scope.temperTypes = data;
        $scope.temperType = data[0].id;
    });
    $scope.citySelected = function () {  };
    $scope.TemperTypeSelected = function () {   };
   // $scope.StorageTypeSelected = function () {   };
	// 获取冷库经营类型
     $http.get(ER.root+'/i/rdc/findAllManageType').success(function (data) {
	        $scope.storageTypes = data;
	        $scope.storageType = data[0].id;
	 });
     $http.get(ER.root+'/i/ShareRdcController/getPSFilterData').success(function(data) {
    	$scope.codeLave1 = data.entity.fm;
    	$scope.codeLave2 = data.entity.cl;
    	$scope.ps_cr_type = data.entity.sk;
     }); //
	 $http.get(ER.root+'/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据
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
			if(files.length==0){return;};
			var allfiles = $scope.totalfiles.concat(files);
			if(allfiles.length>10){/*alert("最多选择10张！")*/ layer.open({content: '最多选择10张哦',btn: '确定'});return;}
	        $scope.totalfiles=allfiles; 
	    };
	    $scope.drophonor = function(honorfile){
	        angular.forEach($scope.totalfiles,function(item, key){  if(item == honorfile){  $scope.totalfiles.splice(key,1);  return false; }  });
	    };
		$scope.typeCode = document.getElementById('typeCode').value;
		$scope.typeText = document.getElementById('typeText').value;
	    $scope.rdcflag= document.getElementById('rdcflag').value;
	    
    function checkStorageSubmit(){ // 检查必须填写项   仓库
        if ($scope.title == undefined || $scope.title == '' ) {  return false; }
        if ($scope.rdcAddress == undefined || $scope.rdcAddress == ''||$scope.rdcAddress == '-') {  return false; }
        if ($scope.temperType == undefined || $scope.temperType == '') {  return false;  }
       	if ($scope.unitprice == undefined) {  return false; }
        if ($scope.sqm == undefined || $scope.sqm == '') { return false;  }
        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') { return false;  }
        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {  return false;  }
        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {  return false;  }
        if ($scope.rentdate == undefined || $scope.rentdate == '') {return false;}
        return true;
    }

		$scope.submit = function(){
			$scope.rdcID = '';
			$scope.validStartTime = $("#sttime").val();
			$scope.validEndTime = $("#endtime").val();
			$scope.rdcAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if($(".coldlist").is(":visible")){//出租
				$scope.typeCode = 1;
				$scope.typeText = "出租";
				$scope.rdcID = $scope.rdcdto.rdcID;
				$scope.rdcAddress = $scope.rdcdto.address;
				$scope.storageType = $scope.rdcdto.codeLave1;
			}else{
				 //$scope.storageType =$("#ls_storageType").val();
			}
			if(Date.parse($('#sttime').val().replace(/-/g,"/")) > Date.parse($('#endtime').val().replace(/-/g,"/"))){
				layer.open({content:'开始时间和结束时间冲突，请更改~',btn: '确定'});
				return false
			}
			if(checkMobile($scope.telephone.trim()) == false){
				layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
				return false
			}
			if(checkStorageSubmit()){
				if($scope.sqm.toString().length > 11){
		        	layer.open({content:'数量不合法哦~',btn: '确定'});return;
		        }else if(parseFloat($scope.unitprice).length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
		        }
	        	layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });
			var simdata = {
					title:$scope.title,
					uid:window.user.id,
					provinceid : $scope.provinceId,
					cityid : $scope.cityId,
                    rentdate:$scope.rentdate,
                    publishunit:3,
                    username:window.user.username,
					codeLave2 : $scope.temperType,
					codeLave1:$("#storageType").attr('val'),
					unit : $scope.unit,
					sqm:$scope.sqm,
					unitPrice : $scope.unitprice,
					validStartTime : $scope.validStartTime,
					validEndTime : $scope.validEndTime,
					telephone:$scope.telephone.trim(),
					note : $scope.note,
					dataType : 3,
					typeCode : $scope.typeCode,
					typeText : $scope.typeText,
					rdcID : $scope.rdcID,
					detlAddress:$scope.rdcAddress
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({ url: ER.root+"/i/ShareRdcController/shareFreeRelease", headers :{ 'Content-Transfer-Encoding': 'utf-8' }, data: data  }).then(function (resp) {
		    	layer.closeAll();
		    	layer.open({ content: resp.data.message ,btn: '确定' ,shadeClose:false  ,yes:function(){ window.location.href ="releasesuccess.html?id=1";   } });
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            layer.open({content: '请填写标记<em>*</em>的必选项再提交哦~',btn: '确定'});
	        }
		};
});
