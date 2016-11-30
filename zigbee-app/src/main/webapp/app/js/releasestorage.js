checkLogin();


angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	$http.defaults.withCredentials=true;  $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	var id=getUrlParam("id");
	$scope.totalfiles = [];
	$scope.unit = "元/天·平方米"; 
	$scope.telephone =  window.user.telephone;
	if(id){
		 $http.get(ER.root+'/i/rdc/findRDCEntityDtoByRdcId', { params: {  "rdcID": id } }).success(function (data) {
	    	 $scope.rdcdto = data;
	    	 $scope.star = [];
	    	 $scope.nostar = [];
	    	 $scope.star.length = $scope.rdcdto.score;
	    	 $scope.nostar.length = 5-$scope.rdcdto.score;
	    	 for(var i=0;i<$scope.star.length;i++){  $scope.star[i] = 1;  }
	     });
	};
	
	$scope.goaddrdcpag=function(){  $location.path("/coldStorageAdd");  };
	     // 获取省列表
    $http.get(ER.root+'/i/city/findProvinceList').success(function (data) {  $scope.provinces = data;    });
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
    $scope.StorageTypeSelected = function () {   };
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
	    
    function checkStorageSubmit(){ // 检查必须填写项
        if ($scope.title == undefined || $scope.title == '' ) {  return false; }
        if ($scope.rdcAddress == undefined || $scope.rdcAddress == ''||$scope.rdcAddress == '-') {  return false; }
        if ($scope.temperType == undefined || $scope.temperType == '') {  return false;  }
        if ($scope.storageType == undefined || $scope.storageType == '') {  return false; }
        if ($scope.sqm == undefined || $scope.sqm == '') { return false;  }
        if ($scope.telephone == undefined || $scope.telephone == '') { return false;  }
        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {  return false;  }
        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {  return false;  }
        return true;
    }
    function checkGoodsSubmit(){ // 检查必须填写项
        if ($scope.title == undefined || $scope.title == '' ) {  return false; }
        if ($scope.rdcAddress == undefined || $scope.rdcAddress == ''||$scope.rdcAddress == '-') { return false; }
        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') { return false; }
        if ($scope.sqm == undefined || $scope.sqm == '') {  return false;  }
        if ($scope.telephone == undefined || $scope.telephone == '') {  return false; }
        if ($scope.validStartTime == undefined || $scope.validStartTime == '') { return false; }
        if ($scope.validEndTime == undefined || $scope.validEndTime == '') { return false;  }
        return true;
    }
    function checkCarSubmit(){  // 检查必须填写项
        if ($scope.title == undefined || $scope.title == '' ) {   return false;  }
        if ($scope.stprovinceID == undefined || $scope.stprovinceID == '' ) { return false; }
        if ($scope.toprovinceID == undefined || $scope.toprovinceID == '' ) {  return false; }
        if ($scope.stcityID == undefined || $scope.stcityID == '' ) { return false; }
        if ($scope.tocityID == undefined || $scope.tocityID == '' ) {  return false;  }
        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {  return false; }
        if ($scope.codeLave22 == undefined || $scope.codeLave22 == '') {   return false;  }
        if ($scope.codeLave33 == undefined || $scope.codeLave33 == '') {  return false; }
        if ($scope.telephone == undefined || $scope.telephone == '') {   return false; }
        if ($scope.startTime == undefined || $scope.startTime == '') {  return false;   }
        if ($scope.arriveTime == undefined || $scope.arriveTime == '') {  return false;  }
        return true;
    }
    
	$scope.carSubmit = function(){
			$scope.rdcID = '';
			var attr1=$("#sl_attrvalue1").val(),attr2=$("#sl_attrvalue2").val(),sttime=$("#startTime").val(), edtime=$("#arriveTime").val();
	    	var sl1= $("#sl_attrvalue1").find("option:selected").text(),sl2= $("#sl_attrvalue2").find("option:selected").text();
	    	if(attr1==1){
	    		$scope.startTime =sl1+" "+sttime;
	    		$scope.arriveTime =sl2+" "+edtime;
	    	}else if(attr1==2){
	    		var spCodesTemp = "";
	    		 $('#ul_work li[class="active"]').each(function(i,em){  spCodesTemp += ($(em).attr("value")+",");  });
	    		 $scope.startTime =sl1+spCodesTemp.substr(0,spCodesTemp.length-1)+" "+sttime;
	    		 $scope.arriveTime =  sl2+" "+edtime;
	    	}else if(attr1==3){
	    		$scope.startTime =sttime;  $scope.arriveTime= edtime;
	    	} 
			$scope.rdcAddress = '';
			var stplace =toplace="";
			if($scope.staddress!=undefined){
			    stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text()+"-"+$scope.staddress;
			}else{
				  stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text();
			}
			if($scope.toaddress!=undefined){
			     toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text()+"-"+$scope.toaddress;
			}else{
				  toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text();
			}
			if(window.flag1==1){
				$scope.typeCode = 2;
				$scope.typeText = "找车";
			}
			if($scope.rdcflag==1)
			{
				$scope.rdcID = $scope.rdcdto.id;
				$scope.rdcAddress = $scope.rdcdto.address;
			}
			if(checkCarSubmit()){
	        	layer.open({ type: 2 ,content: '努力加载中~~~' ,shadeClose:false});
				var simdata = {
						title:$scope.title,
						uid:window.user.id,
						codeLave1:$scope.codeLave11,
						codeLave2:$scope.codeLave22,
						codeLave3:$scope.codeLave33,
						unitPrice : $scope.unitPrice,
			            stprovinceID:$scope.stprovinceID,
					    stcityID:$scope.stcityID,
					    toprovinceID:$scope.toprovinceID,
						tocityID:$scope.tocityID,
						unit1:stplace,
						unit2:toplace,
						validStartTime:$scope.startTime,
						validEndTime : $scope.arriveTime,
						telephone:$scope.telephone,
						note : $scope.note,
						dataType : 2,
						typeCode : $scope.typeCode,
						typeText : $scope.typeText,
						rdcID : $scope.rdcID,
						detlAddress:$scope.rdcAddress,
						attrvalue1:attr1,//设置时间类型  每天，每周，单次
						attrvalue2:attr2//设置到达时间类型
				};
				var sdata  = JSON.stringify(simdata);
				alert(sdata );
				var data = {data:sdata, "files":$scope.totalfiles};
				Upload.upload({url: ER.root+"/i/ShareRdcController/shareFreeRelease",  headers :{ 'Content-Transfer-Encoding': 'utf-8' },  data: data}).then(function (resp) {
			    	//alert(resp.data.message);
			    	layer.closeAll();
			    	layer.open({ content: resp.data.message ,btn: '确定' ,shadeClose:false  ,yes:function(){ window.location.href ="releasesuccess.html?id=3";} });
			    }, function (resp) {
			        console.log('Error status: ' + resp.status);
			    }, function (evt) {
			        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			        console.log('progress: ' + progressPercentage + '% ' + evt.name);
			    });
			} else {
	            layer.open({content: '请填写标记<em>*</em>的必选项再提交哦~',btn: '确定'});
	        }
		}
	    
	    
		$scope.goodSubmit = function(){
			$scope.rdcID = '';
			$scope.validStartTime = $("#sttime").val();
			$scope.validEndTime = $("#endtime").val();
			$scope.rdcAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if(window.flag2==1){
				$scope.typeCode = 2;
				$scope.typeText = "求购";
			}
			if($scope.rdcflag==1)
			{
				$scope.rdcID = $scope.rdcdto.id;
				$scope.rdcAddress = $scope.rdcdto.address;
				}
			var vo = {}; 
			if(checkGoodsSubmit()){
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
					codeLave1:$scope.codeLave11,
					unit1 : $scope.unit1,
					unitPrice : $scope.unitprice,
					validStartTime : $scope.validStartTime,
					validEndTime : $scope.validEndTime,
					sqm:$scope.sqm,
					telephone:$scope.telephone,
					note : $scope.note,
					dataType : 1,
					typeCode : $scope.typeCode,
					typeText : $scope.typeText,
					rdcID : $scope.rdcID,
					detlAddress:$scope.rdcAddress
					
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	//alert(resp.data.message);
		    	//layer.open({content: resp.data.message,btn: '确定'});
		    	layer.closeAll();
		    	layer.open({
		    		content: resp.data.message
		    		,btn: '确定'
	    			,shadeClose:false
	                ,yes:function(){
	                	if(data!=null&&data!=undefined)
	    		    	   window.location.href ="releasesuccess.html?id=2"; 
	                }
		    	});
		    	//window.location.href ="releasesuccess.html"; 
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            //alert("请填写标记*的必选项在提交!");
	            layer.open({content: '请填写标记<em>*</em>的必选项再提交哦~',btn: '确定'});
	        }
		}
		
		$scope.submit = function(){
			$scope.rdcID = '';
			$scope.validStartTime = $("#sttime").val();
			$scope.validEndTime = $("#endtime").val();
			$scope.rdcAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if( ($scope.provinceId==""||$scope.provinceId==undefined)&&$scope.rdcdto!=undefined){
				$scope.typeCode = 1;
				$scope.typeText = "出租";
				$scope.rdcID = $scope.rdcdto.id;
				$scope.rdcAddress = $scope.rdcdto.address;
			}
			var vo = {}; 
			if(checkStorageSubmit()){
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
					codeLave2 : $scope.temperType,
					codeLave1:$scope.storageType,
					unit : $scope.unit,
					sqm:$scope.sqm,
					unitPrice : $scope.unitprice,
					validStartTime : $scope.validStartTime,
					validEndTime : $scope.validEndTime,
					telephone:$scope.telephone,
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
