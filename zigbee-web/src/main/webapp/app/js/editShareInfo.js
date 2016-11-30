coldWeb.controller('editShareInfo', function ($rootScope, $scope, $state, $cookies, $http, Upload, $stateParams,$location) {
	$scope.totalfiles = [];
	 $.getScript('assets/plugins/daterangepicker2/bootstrap-datetimepicker.js',function(){  	});  
	 $scope.initData=function(vo){
		 if(vo.dataType==2){
			 releaseCarInfo.changtimemode(vo.attrvalue1);
			 if(vo.attrvalue1==3){
				 $scope.validStartTime = vo.validStartTime;  $scope.validEndTime = vo.validEndTime;
			 }else{
				var tstime= vo.validStartTime.substring(2), tetime= vo.validEndTime.substring(2);
				 if(vo.attrvalue1==1){
					 $scope.validStartTime = tstime;  $scope.validEndTime = tetime; 
				 }else{
			    	 $scope.validEndTime = tetime; 
			    	 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")+1);
			    	var work= tstime.substring(0,tstime.lastIndexOf(",")).split(",");
			    	if(work&&work!=""){ 
			    		$.each(work, function(i, vo){ 
			    		    var em=	$("#st_sttime input:checkbox[value="+vo+"]");
			    			em.attr("checked"); 
			    			em.parent().addClass("active");
			    			});
				    };
			    }
			 }
			 var unita=vo.unit1.split("-"),unitb=vo.unit2.split("-"); if(unita.length==3){$scope.staddress=vo.unit1.split("-")[2];};  if(unitb.length==3){$scope.toaddress=vo.unit2.split("-")[2];};
			 $("#txt_sattim").val( $scope.validStartTime );  $("#txt_endtim").val( $scope.validEndTime );
		 }else{
			 $scope.validStartTime = vo.validStartTime;  $scope.validEndTime = vo.validEndTime;
			 $("#reservationtime").val($scope.validStartTime+" - "+ $scope.validEndTime);
		 }
		 
	 };
	 
	if($stateParams.shareID!=''&&$stateParams.shareID!=undefined){
	 $http.get('/i/ShareRdcController/getSEByIDForEdit', {
         params: {
             "id": $stateParams.shareID
         }
     }).success(function (data) {
    	 $scope.initData(data.entity);
    	 $scope.rdcsharedto = data.entity;
    	 $scope.typeCode = $scope.rdcsharedto.typeCode;
    	 $scope.title = $scope.rdcsharedto.title;
    	 $scope.telephone = $scope.rdcsharedto.telephone;
//    	 $scope.validStartTime = $scope.rdcsharedto.validStartTime;
//    	 $scope.validEndTime = $scope.rdcsharedto.validEndTime;
//    	 var stentime =  $scope.validStartTime + "-" + $scope.validEndTime;
//    	 $("#reservationtime").val(stentime);
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
    	 $scope.temperType =parseInt($scope.rdcsharedto.codeLave2);
    	 $scope.manageType = parseInt($scope.rdcsharedto.codeLave1);
    	 $scope.unit = $scope.rdcsharedto.unit;
    	 $scope.totalfiles = $scope.rdcsharedto.files;
    	 $scope.attrvalue1= $scope.rdcsharedto.attrvalue1;
    	 $scope.attrvalue2= $scope.rdcsharedto.attrvalue2;
    	 if($scope.totalfiles==undefined)
    		 $scope.totalfiles = [];
    	 $scope.provinceSelected();
    	 $scope.stprovinceSelected();
    	 $scope.toprovinceSelected();
    	 if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
    		 $http.get('/i/rdc/findRDCEntityDtoByRdcId', {
    	         params: {
    	             "rdcID": $scope.rdcsharedto.rdcID
    	         }
    	     }).success(function (data) {
    	    	 $scope.rdcdto = data;
    	     });
    	 }
     });
	}
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
	    // 根据出发地省ID查询城市列表
	    $scope.stprovinceSelected = function () {
	        $http.get('/i/city/findCitysByProvinceId', {
	            params: {
	                "provinceID": $scope.stprovinceID
	            }
	        }).success(function (data) {
	            $scope.stcitys = data;
	            $scope.stcityId = parseInt(data[0].cityID);
	        });
	    }
	    
	    // 根据目的地省ID查询城市列表
	    $scope.toprovinceSelected = function () {
	        $http.get('/i/city/findCitysByProvinceId', {
	            params: {
	                "provinceID": $scope.toprovinceID
	            }
	        }).success(function (data) {
	            $scope.tocitys = data;
	            $scope.tocityId = data[0].cityID;
	        });
	    }

	    $scope.citySelected = function () {
	    }
	  
	    
	    // 获取冷库经营类型
	    $http.get("/i/rdc/findAllManageType").success(function (data) {
	        $scope.manageTypes = data;
	    });

	    // 获取商品温度类型
	    $http.get("/i/rdc/findAllTemperType").success(function (data) {
	        $scope.temperTypes = data;
	    });

	    $scope.TemperTypeSelected = function () {
	    };
	    //冷运参数
	    $http.get('/i/ShareRdcController/getPSFilterData').success(function(data) {
        	$scope.codeLave1 = data.entity.fm;
        	$scope.codeLave2 = data.entity.cl;
        	$scope.ps_cr_type = data.entity.sk;
        }); 
	    //货物参数
	    $http.get('/i/ShareRdcController/getGDFilterData').success(function(data) {
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
			var attr1=$("#sl_attrvalue1").val(),attr2=$("#sl_attrvalue2").val(),sttime=$("#txt_sattim").val(), edtime=$("#txt_endtim").val();
	    	var sl1= $("#sl_attrvalue1").find("option:selected").text(),sl2= $("#sl_attrvalue2").find("option:selected").text();
	    	if(attr1==1){
	    		$scope.startTime =sl1+" "+sttime;
	    		$scope.arriveTime =sl2+" "+edtime;
	    	}else if(attr1==2){
	    		var spCodesTemp = "";
	    		 $('input:checkbox[class="wk_erw"]:checked').each(function(i){spCodesTemp += ($(this).val()+","); });
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
					 attrvalue1:attr1,
	    	         attrvalue2: attr2
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: "/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	window.location.href ="#personalShare"; 
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            alert("请填写标记<em>*</em>的必选项再提交哦");
	        }
		}
	    
	    
		$scope.goodSubmit = function(){
			var stentime=$("#reservationtime").val().split(" - ");
	    	if(stentime.length==2){
	    		$scope.validStartTime = stentime[0]; 
	    		$scope.validEndTime = stentime[1];
	    	}
			$scope.detlAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
				 $scope.detlAddress = $scope.rdcsharedto.detlAddress;
			 }
			if(checkGoodsSubmit()){
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
		        url: "/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	window.location.href ="#personalShare";
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            alert("请填写标记<em>*</em>的必选项再提交哦");
	        }
		}
		
		$scope.submit = function(){
			$scope.rdcID = '';
			var stentime=$("#reservationtime").val().split(" - ");
	    	if(stentime.length==2){
	    		$scope.validStartTime = stentime[0]; 
	    		$scope.validEndTime = stentime[1];
	    	}
			$scope.detlAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
				 $scope.detlAddress = $scope.rdcsharedto.detlAddress;
			 }
			if(checkStorageSubmit()){
			var simdata = {
					id:$scope.rdcsharedto.id,
					uid:window.user.id,
					title:$scope.title,
					provinceid : $scope.provinceId,
					cityid : $scope.cityId,
					codeLave2 : $scope.temperType,
					codeLave1:$scope.manageType,
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
		        url: "/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	window.location.href ="#personalShare"; 
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            alert("请填写标记<em>*</em>的必选项再提交哦");
	        }
		}
		 $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30,format: 'YYYY-MM-DD HH:mm'});
//		 $.getScript('assets/plugins/daterangepicker2/bootstrap-datetimepicker.js',function(){  
//		      $('#txt_sattim').datetimepicker({  format: 'hh:ii', language:  'fr',weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0});//.on("click",function(ev){$("#txt_sattim").datetimepicker("setEndDate",  $("#txt_endtim").val());  });
//		      $('#txt_endtim').datetimepicker({  format: 'hh:ii', language:  'fr',weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0}).on("click",function(ev){
//		    	  if($("#sl_attrvalue1").val()=='3'){
//			    		 $("#txt_endtim").datetimepicker("setStartDate",$("#txt_sattim").val());
//			    	 }else{
//			    		 if($("#sl_attrvalue2").val()==1){  
//				    		  $("#txt_endtim").datetimepicker("setEndDate",'1899-12-31 23:59:59');
//				    		  $("#txt_endtim").datetimepicker("setStartDate",$("#txt_sattim").val());
//				    	  }else{
//				    		  $("#txt_endtim").datetimepicker("setStartDate",null);
//				    	  } 
//			    	 }
//		      });

});
