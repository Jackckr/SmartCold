checkLogin();
var releaseCarInfo={
		initui:function(attrvalue1,work){
			$("#ul_work li").click(function(event){ $(this).toggleClass("active"); });
			if(work&&work!=""){ $("#ul_work li").removeClass("active");  $.each(work, function(i, vo){ if(vo!=""&&vo!=" "){ $("#ul_work li[value="+vo+"]").addClass("active"); } });}
			releaseCarInfo.changtimemode(attrvalue1);
			
//		   $("#release_item_from .obj_hide").hide();
//		   $("#release_item_from .time_mod"+attrvalue1).show();
//			if(attrvalue1==3){
//				$("#ul_work,#sl_attrvalue2").hide();
//				$("#startTime,#arriveTime").jeDate({isTime:true,format:"YYYY-MM-DD hh:mm"});
//			}else if(attrvalue1==1||attrvalue1==2){
//				$("#sl_attrvalue2").show(); 
//				$("#startTime,#arriveTime").jeDate({isTime:true,format:"hh:mm"});
//				if(attrvalue1==2){
//					$("#ul_work").show(); 
//			   }else{
//				   $("#ul_work").hide();
//			   }
//			}else if(attrvalue1==4){
//				$("#startTime,#arriveTime").jeDate({isTime:true,format:"hh:mm"});
//			}else if(attrvalue1==5){
//				
//			}
		},
		changtimemode:function(val){
		    $("#startTime,#arriveTime").remove(); 
	        $("#ul_work").after("<input  id='startTime' class='datainp'  type='text' placeholder='请选择出发时间'  readonly>");
	        $("#sl_attrvalue2").after("<input  id='arriveTime' class='datainp'  type='text' placeholder='请选择结束时间'   readonly "+(val==3?"":"style='width:70%;float: left;'")+">");
	        var form=val==3?"YYYY-MM-DD hh:mm":"hh:mm";
	        var start = { format: form, minDate: $.nowDate(0),   isinitVal:true,  initAddVal:[2,"hh"], choosefun: function(elem,datas){end.minDate = datas;  }};
		    var end = { format: form, minDate: $.nowDate(0),isinitVal:true,initAddVal:[4,"hh"],choosefun: function(elem,datas){ start.maxDate = datas;}};
		    $('#startTime').jeDate(start); $('#arriveTime').jeDate(end);
		    $("#release_item_from .obj_hide").hide();
		    $("#release_item_from .time_mod"+val).show();
	    	if(val==3){
	    		$("#sl_attrvalue2,#ul_work").hide(); $("#startTime,#arriveTime").val("");
	    	}else if(val==1||val==2){
	    		$("#sl_attrvalue2").show();
	    		if(val==2){$("#ul_work").show();}else{$("#ul_work").hide();} $("#startTime").val("09:00"); $("#arriveTime").val("17:00");
	    	}else if(val==4){
	    		$("#sl_attrvalue2").show();
	    		$("#ul_work,#startTime").hide(); $("#startTime").val("09:00"); $("#arriveTime").val("17:00");
	    	}else if(val==5){
	    		$("#sl_attrvalue2,#ul_work,#startTime,#arriveTime").hide();
//	    		$("#sl_attrvalue1_5").show();
	    	}
	    	
		}	
};
angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	 $http.defaults.withCredentials=true;
	 $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.initData=function(vo){
		 if(vo.dataType==2){
			 var work=undefined;
			 if(vo.attrvalue1==3){
				 $scope.validStartTime = vo.validStartTime;  $scope.validEndTime = vo.validEndTime;
			 }else if(vo.attrvalue1==1||vo.attrvalue1==2){
				 var unita=vo.unit1.split("-"); if(unita.length==3){$scope.staddress=vo.unit1.split("-")[2];};
				 var unitb=vo.unit2.split("-"); if(unitb.length==3){$scope.toaddress=vo.unit2.split("-")[2];};
				var tstime= vo.validStartTime.substring(2).trim(), tetime= vo.validEndTime.substring(2).trim();
				 if(vo.attrvalue1==1){
					 $scope.validStartTime = tstime;  $scope.validEndTime = tetime; 
				 }else{
			    	 $scope.validEndTime = tetime; 
//			    	 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")+2);
			    	 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")).trim();
			    	 work=tstime.substring(0,tstime.lastIndexOf(" ")).split(",");
				 }
			 }else if(vo.attrvalue1==4){
				 $scope.validEndTime = vo.validEndTime.substring(2).trim();
				 $("#sl_attrvalue1_4").val( vo.validStartTime.substring(1,2).trim());
			 }else if(vo.attrvalue1==5){
				 $("#sl_attrvalue1_5").val(vo.validStartTime);  $scope.validEndTime = vo.validEndTime;
			 }
			 releaseCarInfo.initui(vo.attrvalue1,work);
		 }else{
			 $scope.validStartTime = vo.validStartTime;  $scope.validEndTime = vo.validEndTime;
			 releaseCarInfo.initui(vo.attrvalue1,undefined);
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
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {return false; }
	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {return false;}
	        if ($scope.temperType == undefined || $scope.temperType == '') { return false;}
	        if ($scope.manageType == undefined || $scope.manageType == '') { return false;}
	        if ($scope.sqm == undefined || $scope.sqm == '') { return false;}
	        if ($scope.telephone == undefined || $scope.telephone == '') { return false;}
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {return false;}
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {return false;}
	        return true;
	    }
	    
	    
	    function checkGoodsSubmit(){
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {return false;}
	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {return false;}
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') { return false;}
	        if ($scope.sqm == undefined || $scope.sqm == '') {return false;}
	        if ($scope.telephone == undefined || $scope.telephone == '') {return false;}
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {return false; }
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {return false;}
	        return true;
	    }
	    
	    
	    function checkCarSubmit(){
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) { return false; }
	        if ($scope.stprovinceID == undefined || $scope.stprovinceID == '' ) {return false; }
	        if ($scope.toprovinceID == undefined || $scope.toprovinceID == '' ) { return false; }
	        if ($scope.stcityID == undefined || $scope.stcityID == '' ) {return false; }
	        if ($scope.tocityID == undefined || $scope.tocityID == '' ) {return false; }
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {return false; }
	        if ($scope.codeLave22 == undefined || $scope.codeLave22 == '') {return false;}
	        if ($scope.codeLave33 == undefined || $scope.codeLave33 == '') {return false;}
	        if ($scope.telephone == undefined || $scope.telephone == '') { return false;}
	        if ($scope.startTime == undefined || $scope.startTime == '') {return false;}
	        if ($scope.arriveTime == undefined || $scope.arriveTime == '') { return false;}
	        return true;
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
	    	} else if(attr1==4){
	    		$scope.startTime ="每"+$("#sl_attrvalue1_4").val()+"天一次";
	    		 $scope.arriveTime=   sl2+" "+$("#arriveTime").val();
	    	}else if(attr1==5){
	    		$scope.startTime = $("#sl_attrvalue1_5").val();
	    		 $scope.arriveTime="当天  17:00";
	    		 $("#hl_validEndTime").val("");
	    	}
			var stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text();
			var toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text();
			if($scope.staddress){stplace+='-'+$scope.staddress;}
			if($scope.toaddress){toplace+='-'+$scope.toaddress;}
			if(checkCarSubmit()){
				if(parseFloat($scope.unitprice).toFixed(2).length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
		        }else if($scope.telephone.trim().length != 11){
		        	layer.open({content:'手机号码有误哦~',btn: '确定'});return;
		        }
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
				if($scope.sqm.length > 11){
		        	layer.open({content:'数量不合法哦~',btn: '确定'});return;
		        }else if(parseFloat($scope.unitprice).toFixed(2).length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
		        }else if($scope.telephone.trim().length != 11){
		        	layer.open({content:'手机号码有误哦~',btn: '确定'});return;
		        }
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
				if($scope.sqm.length > 11){
		        	layer.open({content:'数量不合法哦~',btn: '确定'});return;
		        }else if(parseFloat($scope.unitprice).toFixed(2).length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
		        }else if($scope.telephone.trim().length != 11){
		        	layer.open({content:'手机号码有误哦~',btn: '确定'});return;
		        }
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
