checkLogin();

var releaseCarInfo={
		initui:function(attrvalue1,work){
			$("#ul_work li").click(function(event){var em=$(this); if(em.hasClass("active")){ em.removeClass("active"); }else{ em.addClass("active"); }});
			$("#startTime,#arriveTime").jeDate({isTime:true,format:"hh:mm"});
			if(work&&work!=""){ $("#ul_work li").removeClass("active");  $.each(work, function(i, vo){  $("#ul_work li[value="+vo+"]").addClass("active");  });}
			if(attrvalue1==3){$("#ul_work,#sl_attrvalue2").hide();}else{ $("#sl_attrvalue2").show(); if(attrvalue1==2){$("#ul_work").show(); }else{$("#ul_work").hide();}}
		},
		changtimemode:function(val){
		    $("#startTime,#arriveTime").remove(); 
	        $("#ul_work").after("<input  id='startTime' class='datainp'  type='text' placeholder='请选择出发时间'  readonly>");
	        $("#sl_attrvalue2").after("<input  id='arriveTime' class='datainp'  type='text' placeholder='请选择结束时间'   readonly "+(val==3?"":"style='width:70%;float: left;'")+">");
	        var form=val==3?"YYYY-MM-DD hh:mm":"hh:mm";
	        var start = { format: form, minDate: $.nowDate(0),   isinitVal:true,  initAddVal:[2,"hh"], choosefun: function(elem,datas){end.minDate = datas;  }};
		    var end = { format: form, minDate: $.nowDate(0),isinitVal:true,initAddVal:[4,"hh"],choosefun: function(elem,datas){ start.maxDate = datas;}};
	    	if(val==3){
	    		$("#sl_attrvalue2,#ul_work").hide(); $("#startTime,#arriveTime").val("");
	    	}else{
	    		$("#sl_attrvalue2").show();
	    		if(val==2){$("#ul_work").show();}else{$("#ul_work").hide();} $("#startTime").val("09:00"); $("#arriveTime").val("17:00");
	    	}
	    	$('#startTime').jeDate(start); $('#arriveTime').jeDate(end);
		}	
};



angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	 $http.defaults.withCredentials=true;
	 $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.initData=function(vo){
		 if(vo.dataType==2&&vo.attrvalue1!=3){
			var tstime= vo.validStartTime.substring(2), tetime= vo.validEndTime.substring(2);
			 if(vo.attrvalue1==1){
				 $scope.validStartTime = tstime;  $scope.validEndTime = tetime; 
			 }else{
		    	 $scope.validEndTime = tetime; 
		    	 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")+1);
		    	 releaseCarInfo.initui(vo.attrvalue1, tstime.substring(0,tstime.lastIndexOf(",")).split(","));
			 }
		 }else{
			 if(vo.dataType==2){ releaseCarInfo.initui(vo.attrvalue1,undefined);}
			 $scope.validStartTime = vo.validStartTime;  $scope.validEndTime = vo.validEndTime;
		 }
	 };
	 
	var id=getUrlParam("id");
	$scope.totalfiles = [];
	if(id){
		 $http.get(ER.root+'/i/ShareRdcController/getSEByIDForEdit', {  params: { "id": id } }).success(function (data) {
			 if(!data.success){alert("内容已被删除或者失效！");return;}
			 $scope.initData(data.entity);
	    	 $scope.rdcsharedto = data.entity;
	    	 $scope.typeCode = $scope.rdcsharedto.typeCode;
	    	 $scope.title = $scope.rdcsharedto.title;
	    	 $scope.telephone = $scope.rdcsharedto.telephone;
	    	 $scope.note = $scope.rdcsharedto.note;
	    	 $scope.unitprice = $scope.rdcsharedto.unitPrice;
	    	 $scope.codeLave11 = $scope.rdcsharedto.codeLave1;
	         $scope.codeLave22 = $scope.rdcsharedto.codeLave2;
	    	 $scope.codeLave33 = $scope.rdcsharedto.codeLave3;
	    	 $scope.stprovinceID = $scope.rdcsharedto.stprovinceID;
	    	 $scope.stcityID = $scope.rdcsharedto.stcityID;
	    	 $scope.toprovinceID = $scope.rdcsharedto.toprovinceID;
	    	 $scope.tocityID = $scope.rdcsharedto.tocityID;
	    	 $scope.provinceId = $scope.rdcsharedto.provinceid;
	    	 $scope.cityId = $scope.rdcsharedto.cityid;
	    	 $scope.unit1 = $scope.rdcsharedto.unit1;
	    	 $scope.sqm = $scope.rdcsharedto.sqm;
	    	 $scope.temperType = $scope.rdcsharedto.codeLave2;
	    	 $scope.manageType = $scope.rdcsharedto.codeLave1;
	    	 $scope.unit = $scope.rdcsharedto.unit;
	    	 $scope.totalfiles = $scope.rdcsharedto.files;
	    	 $scope.attrvalue1= $scope.rdcsharedto.attrvalue1;
	    	 $scope.attrvalue2= $scope.rdcsharedto.attrvalue2;
	    	 if($scope.totalfiles==undefined){ $scope.totalfiles = []; }
	    	 $scope.provinceSelected();
	    	 $scope.stprovinceSelected();
	    	 $scope.toprovinceSelected();
	    	 if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
	    		 $http.get(ER.root+'/i/rdc/findRDCEntityDtoByRdcId', {   params: {  "rdcID": $scope.rdcsharedto.rdcID } }).success(function (data) {
	    	    	 $scope.rdcdto = data;
	    	     });
	    	 }
	     });
	}
	  // 获取省列表
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
	    };
	    // 根据出发地省ID查询城市列表
	    $scope.stprovinceSelected = function () {
	        $http.get(ER.root+'/i/city/findCitysByProvinceId', {
	            params: {
	                "provinceID": $scope.stprovinceID
	            }
	        }).success(function (data) {
	            $scope.stcitys = data;
	            $scope.stcityId = data[0].cityID;
	        });
	    };
	    
	    // 根据目的地省ID查询城市列表
	    $scope.toprovinceSelected = function () {
	        $http.get(ER.root+'/i/city/findCitysByProvinceId', {
	            params: {
	                "provinceID": $scope.toprovinceID
	            }
	        }).success(function (data) {
	            $scope.tocitys = data;
	            $scope.tocityId = data[0].cityID;
	        });
	    };

	    $scope.citySelected = function () {
	    };
	  
	    
	    // 获取冷库经营类型
	    $http.get(ER.root+"/i/rdc/findAllManageType").success(function (data) {
	        $scope.manageTypes = data;
	        $scope.manageType = data[0].id;
	    });

	    $scope.ManageTypeSelected = function () {
	    };

	    // 获取商品温度类型
	    $http.get(ER.root+"/i/rdc/findAllTemperType").success(function (data) {
	        $scope.temperTypes = data;
	        $scope.temperType = data[0].id;
	    });

	    $scope.TemperTypeSelected = function () {
	    };
	    //冷运参数
	    $http.get(ER.root+'/i/ShareRdcController/getPSFilterData').success(function(data) {
        	$scope.codeLave1 = data.entity.fm;
        	$scope.codeLave2 = data.entity.cl;
        	$scope.ps_cr_type = data.entity.sk;
        }); 
	    //货物参数
	    $http.get(ER.root+'/i/ShareRdcController/getGDFilterData').success(function(data) {
	    	$scope.good_type = data.entity.gt;
	    	}); 
	    
	    $scope.addFiles = function (files) {
			if(files.length==0){return;};
			var allfiles = $scope.totalfiles.concat(files);
			if(allfiles.length>10){/*alert("最多选择10张！");*/ layer.open({content: '最多选择10张哦' ,btn: '确定'});return;}
	        $scope.totalfiles=allfiles; 
	    };
	    $scope.drophonor = function(honorfile){
	        angular.forEach($scope.totalfiles,function(item, key){
	            if(item == honorfile){
	                $scope.totalfiles.splice(key,1);
	                return false;
	            }
	        });
	    };
	    function checkStorageSubmit(){
	        var flag = true;
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {
	            flag = false;
	        }
	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {
	            flag = false;
	        }
	        if ($scope.temperType == undefined || $scope.temperType == '') {
	            flag = false;
	        }
	        
	        if ($scope.manageType == undefined || $scope.manageType == '') {
	            flag = false;
	        }
	        if ($scope.sqm == undefined || $scope.sqm == '') {
	            flag = false;
	        }
	        if ($scope.telephone == undefined || $scope.telephone == '') {
	            flag = false;
	        }
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {
	            flag = false;
	        }
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {
	            flag = false;
	        }
	        return flag;
	    }
	    
	    
	    function checkGoodsSubmit(){
	        var flag = true;
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {
	            flag = false;
	        }
	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {
	            flag = false;
	        }
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {
	            flag = false;
	        }
	        if ($scope.sqm == undefined || $scope.sqm == '') {
	            flag = false;
	        }
	        if ($scope.telephone == undefined || $scope.telephone == '') {
	            flag = false;
	        }
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {
	            flag = false;
	        }
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {
	            flag = false;
	        }
	        return flag;
	    }
	    
	    
	    function checkCarSubmit(){
	        var flag = true;
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {
	            flag = false;
	        }
	        if ($scope.stprovinceID == undefined || $scope.stprovinceID == '' ) {
	            flag = false;
	        }
	        if ($scope.toprovinceID == undefined || $scope.toprovinceID == '' ) {
	            flag = false;
	        }
	        if ($scope.stcityID == undefined || $scope.stcityID == '' ) {
	            flag = false;
	        }
	        if ($scope.tocityID == undefined || $scope.tocityID == '' ) {
	            flag = false;
	        }
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {
	            flag = false;
	        }
	        if ($scope.codeLave22 == undefined || $scope.codeLave22 == '') {
	            flag = false;
	        }
	        if ($scope.codeLave33 == undefined || $scope.codeLave33 == '') {
	            flag = false;
	        }
	        if ($scope.telephone == undefined || $scope.telephone == '') {
	            flag = false;
	        }
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {
	            flag = false;
	        }
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {
	            flag = false;
	        }
	        return flag;
	    }
	    
	    
	    
		$scope.carSubmit = function(){
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
			var stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text();
			var toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text();
			if($scope.staddress){stplace+='-'+$scope.staddress;}
			if($scope.toaddress){toplace+='-'+$scope.toaddress;}
			if(checkCarSubmit()){
	        	layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });
			var simdata = {
					id:$scope.rdcsharedto.id,
					uid:window.user.id,
					title:$scope.title,
					codeLave1:$scope.codeLave11,
					codeLave2:$scope.codeLave22,
					codeLave3:$scope.codeLave33,
					unitPrice : $scope.unitprice,
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
					attrvalue1:attr1,//设置时间类型  每天，每周，单次
					attrvalue2:attr2//设置到达时间类型
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	layer.closeAll();
		    	layer.open({content: resp.data.message ,btn: '确定' ,shadeClose:false  ,yes:function(){ window.location.href ="coldtransportlist.html";  } });
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            //alert("请填写标记*的必选项在提交!");
	            layer.open({content:'请填写标记<em>*</em>的必选项再提交哦',btn: '确定'});
	        }
		}
	    
	    
		$scope.goodSubmit = function(){
			$scope.validStartTime = $("#sttime").val();
			$scope.validEndTime = $("#endtime").val();
			$scope.detlAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
				 $scope.detlAddress = $scope.rdcsharedto.detlAddress;
			 }
			if(checkGoodsSubmit()){
	        	layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });
			var simdata = {
					id:$scope.rdcsharedto.id,
					uid:window.user.id,
					title:$scope.title,
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
					detlAddress:$scope.detlAddress
					
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	//alert(resp.data.message);
		    	//layer.open({content:resp.data.message,btn: '确定'});
		    	//window.location.href ="goodslist.html";
		    	layer.closeAll();
		    	layer.open({
				    content: resp.data.message
				    ,btn: '确定'
				    ,shadeClose:false
				    ,yes:function(){
				    	window.location.href ="goodslist.html"; 
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
	            layer.open({content:'请填写标记<em>*</em>的必选项再提交哦',btn: '确定'});
	        }
		}
		
		$scope.submit = function(){
			$scope.rdcID = '';
			$scope.validStartTime = $("#sttime").val();
			$scope.validEndTime = $("#endtime").val();
			$scope.detlAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
				 $scope.detlAddress = $scope.rdcsharedto.detlAddress;
			 }
			if(checkStorageSubmit()){
	        	layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });
			var simdata = {
					id:$scope.rdcsharedto.id,
					uid:window.user.id,
					title:$scope.title,
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
					detlAddress:$scope.detlAddress
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	//alert(resp.data.message);
		    	//layer.open({content:resp.data.message,btn: '确定'});
		    	//window.location.href ="user-myrelease.html"; 
		    	layer.closeAll();
		    	layer.open({
				    content: resp.data.message
				    ,btn: '确定'
				    ,shadeClose:false
				    ,yes:function(){
				    	window.location.href ="user-myrelease.html"; 
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
				 layer.open({content:'请填写标记<em>*</em>的必选项再提交哦',btn: '确定'});
	        }
		}
});
