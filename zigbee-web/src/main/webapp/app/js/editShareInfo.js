coldWeb.controller('editShareInfo', function ($rootScope, $scope, $state, $cookies, $http, Upload, $stateParams,$location) {
	$scope.totalfiles = [];
	if($stateParams.shareID!=''&&$stateParams.shareID!=undefined){
	 $http.get('/i/ShareRdcController/getSEByIDForEdit', {
         params: {
             "id": $stateParams.shareID
         }
     }).success(function (data) {
    	 $scope.rdcsharedto = data.entity;
    	 $scope.typeCode = $scope.rdcsharedto.typeCode;
    	 $scope.title = $scope.rdcsharedto.title;
    	 $scope.telephone = $scope.rdcsharedto.telephone;
    	 $scope.validStartTime = $scope.rdcsharedto.validStartTime;
    	 $scope.validEndTime = $scope.rdcsharedto.validEndTime;
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
	            $scope.stcityId = data[0].cityID;
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
	        $scope.manageType = data[0].id;
	    });

	    $scope.ManageTypeSelected = function () {
	    };

	    // 获取商品温度类型
	    $http.get("/i/rdc/findAllTemperType").success(function (data) {
	        $scope.temperTypes = data;
	        $scope.temperType = data[0].id;
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
			$scope.validStartTime = $("#startTime").val();
			$scope.validEndTime = $("#arriveTime").val();
			var stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text()+"-"+$scope.staddress;
			var toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text()+"-"+$scope.toaddress;
			if(checkCarSubmit()){
	        	/*layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });*/
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
					validStartTime:$scope.validStartTime,
					validEndTime : $scope.validEndTime,
					telephone:$scope.telephone,
					note : $scope.note,
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: "/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	//window.location.href ="coldtransportlist.html"; 
		    	//layer.open({content: resp.data.message,btn: '确定'});
		    	/*layer.closeAll();
		    	 layer.open({
				    content: resp.data.message
				    ,btn: '确定'
				    ,shadeClose:false
				    ,yes:function(){
				    	window.location.href ="coldtransportlist.html"; 
				    }
				  });*/
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            alert("请填写标记<em>*</em>的必选项再提交哦");
	            //layer.open({content:'请填写标记<em>*</em>的必选项再提交哦',btn: '确定'});
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
	        	/*layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });*/
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
		    	//layer.open({content:resp.data.message,btn: '确定'});
		    	//window.location.href ="goodslist.html";
		    	/*layer.closeAll();
		    	layer.open({
				    content: resp.data.message
				    ,btn: '确定'
				    ,shadeClose:false
				    ,yes:function(){
				    	window.location.href ="goodslist.html"; 
				    }
				  });*/
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            alert("请填写标记<em>*</em>的必选项再提交哦");
	            //layer.open({content:'请填写标记<em>*</em>的必选项再提交哦',btn: '确定'});
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
	        	/*layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });*/
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
		        url: "/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	//layer.open({content:resp.data.message,btn: '确定'});
		    	//window.location.href ="user-myrelease.html"; 
		    	/*layer.closeAll();
		    	layer.open({
				    content: resp.data.message
				    ,btn: '确定'
				    ,shadeClose:false
				    ,yes:function(){
				    	window.location.href ="user-myrelease.html"; 
				    }
				  });*/
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
			}
			else {
	            alert("请填写标记<em>*</em>的必选项再提交哦");
	            // layer.open({content:'请填写标记<em>*</em>的必选项再提交哦',btn: '确定'});
	        }
		}
		 $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30,format: 'YYYY-MM-DD HH:mm'});
		 $.getScript('assets/plugins/daterangepicker2/bootstrap-datetimepicker.js',function(){  
		      $('#txt_sattim').datetimepicker({  format: 'hh:ii', language:  'fr',weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0});//.on("click",function(ev){$("#txt_sattim").datetimepicker("setEndDate",  $("#txt_endtim").val());  });
		      $('#txt_endtim').datetimepicker({  format: 'hh:ii', language:  'fr',weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0}).on("click",function(ev){
		    	  if($("#sl_attrvalue1").val()=='3'){
			    		 $("#txt_endtim").datetimepicker("setStartDate",$("#txt_sattim").val());
			    	 }else{
			    		 if($("#sl_attrvalue2").val()==1){  
				    		  $("#txt_endtim").datetimepicker("setEndDate",'1899-12-31 23:59:59');
				    		  $("#txt_endtim").datetimepicker("setStartDate",$("#txt_sattim").val());
				    	  }else{
				    		  $("#txt_endtim").datetimepicker("setStartDate",null);
				    	  } 
			    	 }
		      });
//			  $('#txt_sattim,#txt_endtim').datetimepicker('update', new Date());
		});  
});
