checkLogin();

angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	$http.defaults.withCredentials=true;  $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	var id=getUrlParam("id");
	var onoff = true;
	$('#user-defined').click(function(){
		if (onoff) {
			$('.route select').hide();
			$(this).html('固定路线');
			$('.user_defined_address1').attr('placeholder','请输入自定义出发地址');
			$('.user_defined_address2').attr('placeholder','请输入自定义目的地址');
			onoff = false;
		} else {
			$('.route select').show();
			$(this).html('自定义');
			$('.user_defined_address1').attr('placeholder','请输入详细地址(选填)');
			$('.user_defined_address2').attr('placeholder','请输入详细地址(选填)');
			onoff = true;
		}
	});
	$scope.totalfiles = [];
	$scope.unit = "元/天·平方米"; 
	$scope.telephone =  window.user.telephone.trim();
	if(id){
//		 $http.get(ER.root+'/i/rdc/findRDCEntityDtoByRdcId', { params: {  "rdcID": id, } }).success(function (data) {
//	    	 $scope.rdcdto = data;
//	    	 $scope.star = [];
//	    	 $scope.nostar = [];
//	    	 $scope.star.length = 5;
//	    	 $scope.nostar.length = 3;
//	    	 for(var i=0;i<5;i++){  $scope.star[i] = 1;  }
//	     });
		$http.get(ER.root+'/i/ShareRdcController/getRdcByUid', { params: {  "rdcId": id,uid:window.user.id } }).success(function (data) {
	    	if(data.success){ $scope.rdcdto = data.data[0];}
		});
	};
	
	$scope.goaddrdcpag=function(){  $location.path("/coldStorageAdd");  };
	     // 获取省列表
    $http.get(ER.root+'/i/city/findProvinceList').success(function (data) { 
    	$scope.provinces = data;  
    	
    });
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
        if ($scope.storageType == undefined || $scope.storageType == '') {  return false; }
        if ($scope.sqm == undefined || $scope.sqm == '') { return false;  }
        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') { return false;  }
        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {  return false;  }
        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {  return false;  }
        return true;
    }
    function checkGoodsSubmit(){ // 检查必须填写项    货品
        if ($scope.title == undefined || $scope.title == '' ) {  return false; }
        if ($scope.rdcAddress == undefined || $scope.rdcAddress == ''||$scope.rdcAddress == '-') { return false; }
        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') { return false; }
        if ($scope.sqm == undefined || $scope.sqm == '') {  return false;  }
        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') {  return false; }
        if ($scope.validStartTime == undefined || $scope.validStartTime == '') { return false; }
        if ($scope.validEndTime == undefined || $scope.validEndTime == '') { return false;  }
        return true;
    }
    function checkCarSubmit(){  // 检查必须填写项    冷运
        if ($scope.title == undefined || $scope.title == '' ) {   return false;  }
        if(onoff){
        	 if ($scope.stprovinceID == undefined || $scope.stprovinceID == '' ) { return false; }
             if ($scope.toprovinceID == undefined || $scope.toprovinceID == '' ) {  return false; }
             if ($scope.stcityID == undefined || $scope.stcityID == '' ) { return false; }
             if ($scope.tocityID == undefined || $scope.tocityID == '' ) {  return false;  }
        }else{
        	if($('.user_defined_address1').val().trim()==""){return false;};//出发地详细地址
        	if($('.user_defined_address2').val().trim()==""){return false;};//目的地详细地址
        }
        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {  return false; }
        if ($scope.codeLave22 == undefined || $scope.codeLave22 == '') {   return false;  }
        if ($scope.codeLave33 == undefined || $scope.codeLave33 == '') {  return false; }
        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') {   return false; }
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
	    	}  else if(attr1==4){
	    		$scope.startTime ="每"+$("#sl_attrvalue1_4").val()+"天一次 "+sttime;
	    		 $scope.arriveTime=   sl2+" "+$("#arriveTime").val();
	    	}else if(attr1==5){
	    		$scope.startTime = $("#sl_attrvalue1_5").val();
	    		 $scope.arriveTime="当天  17:00";
	    		 $("#hl_validEndTime").val("");
	    	}
	    	
	    	
	    	
			$scope.rdcAddress = '';
			var stplace=toplace="";
			if(onoff){
				stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text();
			    toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text();
				if($scope.staddress==undefined){ $scope.staddress="";}
				if($scope.toaddress==undefined){ $scope.toaddress="";}
		    }else{
		    	stplace = $('.user_defined_address1').val();//出发地详细地址
				toplace = $('.user_defined_address2').val();//目的地详细地址
		    }
			
			if(window.flag1==1){
				$scope.typeCode = 2;
				$scope.typeText = "找车";
			}
			if($scope.rdcflag==1)
			{
				$scope.rdcID = $scope.rdcdto.rdcID;
				$scope.rdcAddress = $scope.rdcdto.address;
			}
			if(checkMobile($scope.telephone.trim()) == false){
				layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
				return false
			}
			if(checkCarSubmit()){
				if($scope.unitPrice == undefined || $scope.unitPrice == null || $scope.unitPrice == ""){
					$scope.unitPrice = "";
				}else if($scope.unitPrice.toString().trim().length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
		        }
	        	layer.open({ type: 2 ,content: '努力加载中~~~' ,shadeClose:false});
				var simdata = {
						title:$scope.title.trim(),
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
						telephone:$scope.telephone.trim(),
						note : $scope.note,
						dataType : 2,
						typeCode : $scope.typeCode,
						typeText : $scope.typeText,
						rdcID : $scope.rdcID,
						detlAddress:$scope.rdcAddress,
						attrvalue:onoff?1:0,
						staddress:$scope.staddress,
						toaddress:$scope.toaddress,
						attrvalue1:attr1,//设置时间类型  每天，每周，单次
						attrvalue2:attr2//设置到达时间类型
				};
				var sdata  = JSON.stringify(simdata);
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
		};
	    
	    
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
				$scope.rdcID = $scope.rdcdto.rdcID;
			    $scope.provinceId=$scope.rdcdto.provinceid;
			    $scope.cityId=$scope.rdcdto.cityid;
				$scope.rdcAddress = $scope.rdcdto.address;
			}
			if(Date.parse($('#sttime').val().replace(/-/g,"/")) > Date.parse($('#endtime').val().replace(/-/g,"/"))){
				layer.open({content:'开始时间和结束时间冲突，请更改~',btn: '确定'});
				return false
			}
			if(checkMobile($scope.telephone.trim()) == false){
				layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
				return false
			}
			if(checkGoodsSubmit()){
				if($scope.sqm.toString().length > 11){
		        	layer.open({content:'数量不合法哦~',btn: '确定'});return;
		        }else if($scope.unitprice == undefined || $scope.unitprice == null || $scope.unitprice == ""){
		        	$scope.unitprice = "";
		        }else if($scope.unitprice.toString().length>11){
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
					codeLave1:$scope.codeLave11,
					unit1 : $scope.unit1,
					unitPrice : $scope.unitprice,
					validStartTime : $scope.validStartTime,
					validEndTime : $scope.validEndTime,
					sqm:$scope.sqm,
					telephone:$scope.telephone.trim(),
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
		};
		
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
//				 $scope.storageType =$("#ls_storageType").val();
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
					codeLave2 : $scope.temperType,
					codeLave1:$scope.storageType,
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
