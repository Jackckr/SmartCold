checkLogin();

var releaseCarInfo={
		onoff:true,
		changline:	function(uline){
			if (uline) {
				$('.route select').hide();
				$("#user-defined").html('固定路线');
				$('.user_defined_address1').attr('placeholder','请输入自定义出发地址');
				$('.user_defined_address2').attr('placeholder','请输入自定义目的地址');
				releaseCarInfo.onoff = false;
			} else {
				$('.route select').show();
				$("#user-defined").html('自定义');
				$('.user_defined_address1').attr('placeholder','请输入详细地址(选填)');
				$('.user_defined_address2').attr('placeholder','请输入详细地址(选填)');
				releaseCarInfo.onoff = true;
			}
		},
		initui:function(attrvalue1,work){
			$("#ul_work li").click(function(event){ $(this).toggleClass("active"); });
			if(work&&work!=""){ $("#ul_work li").removeClass("active");  $.each(work, function(i, vo){ if(vo!=""&&vo!=" "){ $("#ul_work li[value="+vo+"]").addClass("active"); } });}
			releaseCarInfo.changtimemode(attrvalue1);
			$('#user-defined').click(function(){
				releaseCarInfo.changline(releaseCarInfo.onoff );
			});
	
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
	        $(".opIndex").append("<input  id='startTime' class='datainp'  type='text' placeholder='请选择出发时间'  readonly>");
	        $("#sl_attrvalue2").after("<input  id='arriveTime' class='datainp'  type='text' placeholder='请选择结束时间'   readonly "+(val==3?"":"style='width:60%;float: left;'")+">");
	        var form=val==3?"YYYY-MM-DD hh:mm":"hh:mm";
	        var start = { format: form, minDate: $.nowDate(0),   isinitVal:true,  initAddVal:[2,"hh"], choosefun: function(elem,datas){end.minDate = datas;  }};
		    var end = { format: form, minDate: $.nowDate(0),isinitVal:true,initAddVal:[4,"hh"],choosefun: function(elem,datas){ start.maxDate = datas;}};
		    $('#startTime').jeDate(start); $('#arriveTime').jeDate(end);
		    $("#li_end_time").show();
		    $("#release_item_from .obj_hide").hide();
		    $("#release_item_from .time_mod"+val).show();
	    	if(val==3){
	    		$("#sl_attrvalue2,#ul_work").hide(); $("#startTime,#arriveTime").val("");
	    	}else if(val==1||val==2){
	    		$("#sl_attrvalue2").show();
	    		if(val==2){$("#ul_work").show();}else{$("#ul_work").hide();} $("#startTime").val("09:00"); $("#arriveTime").val("17:00");
	    	}else if(val==4){
	    		$("#sl_attrvalue2,#startTime").show();
	    		$("#ul_work").hide(); $("#startTime").val("09:00"); $("#arriveTime").val("17:00");
	    	}else if(val==5){
	    		$("#sl_attrvalue2,#ul_work,#startTime,#arriveTime,#li_end_time").hide();
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
				var tstime= vo.validStartTime.substring(2).trim(), tetime= vo.validEndTime.substring(vo.validEndTime.lastIndexOf(":")-2).trim();
				 if(vo.attrvalue1==1){
					 $scope.validStartTime = tstime;  $scope.validEndTime = tetime; 
				 }else{
			    	 $scope.validEndTime = tetime; 
//			    	 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")+2);
			    	 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")).trim();
			    	 work=tstime.substring(0,tstime.lastIndexOf(" ")).split(",");
				 }
			 }else if(vo.attrvalue1==4){
				 $scope.validStartTime = vo.validStartTime.substring(vo.validStartTime.lastIndexOf(" ")+1).trim();
				 $scope.validEndTime = vo.validEndTime.substring(vo.validEndTime.lastIndexOf(":")-2).trim();
				 $("#sl_attrvalue1_4").val( vo.validStartTime.substring(1,2).trim());
			 }else if(vo.attrvalue1==5){
				 $("#sl_attrvalue1_5").val(vo.validStartTime);  $scope.validEndTime = vo.validEndTime;
			 }
			 releaseCarInfo.initui(vo.attrvalue1,work);
			 releaseCarInfo.changline(vo.attrvalue=='0' );
			 if(vo.attrvalue=='0'){
				    $('.user_defined_address1').val(vo.unit1);
					$('.user_defined_address2').val(vo.unit2);
			 }else{
				 $('.user_defined_address1').val(vo.staddress);
				 $('.user_defined_address2').val(vo.toaddress);
			 }
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
	    	 $scope.telephone = $scope.rdcsharedto.telephone.trim();
	    	 $scope.note = $scope.rdcsharedto.note;
	    	 $scope.unitprice = parseFloat($scope.rdcsharedto.unitPrice);
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
	    	 $scope.sqm = parseFloat($scope.rdcsharedto.sqm);
	    	 $scope.temperType = $scope.rdcsharedto.codeLave2;
	    	 $scope.manageType = $scope.rdcsharedto.codeLave1;
	    	 $scope.unit = $scope.rdcsharedto.unit;
	    	 $scope.totalfiles = $scope.rdcsharedto.files;
	    	 $scope.rmomtfiles = $scope.rdcsharedto.fileList;
	    	 $scope.attrvalue1= $scope.rdcsharedto.attrvalue1;
	    	 $scope.attrvalue2= $scope.rdcsharedto.attrvalue2;
	    	 $scope.rentdate=$scope.rdcsharedto.rentdate;
	    	 $scope.publishunit=$scope.rdcsharedto.publishunit;
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
	            $scope.cityId = $scope.cityId;
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
    $scope.rentDateSelected = function () {   };
    //租期类型
    $scope.rentDateTypes = [{id:1,type:"1个月以下"},{id:2,type:"1~3个月"},{id:3,type:"3~6个月"},{id:4,type:"6~9个月"},{id:5,type:"1年以上"},{id:6,type:"两年以上"},{id:7,type:"三年以上"},{id:8,type:"五年以上"}];
	    // 获取冷库经营类型
	    $http.get(ER.root+"/i/rdc/findAllManageType").success(function (data) {
	        $scope.manageTypes = data;
	        //$scope.manageType = $scope.manageType;
	    });

	    $scope.ManageTypeSelected = function () {
	    };

	    // 获取商品温度类型
	    $http.get(ER.root+"/i/rdc/findAllTemperType").success(function (data) {
	        $scope.temperTypes = data;
	       // $scope.temperType = $scope.temperType;
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
			if(allfiles.length>10){/*alert("最多选择10张！");*/ layer.open({content: '最多选择10张哦' ,btn: '确定'});return;}
	        $scope.totalfiles=allfiles; 
	    };
	    /*$scope.drophonor = function(honorfile){
	        angular.forEach($scope.totalfiles,function(item, key){
	            if(item == honorfile){
	                $scope.totalfiles.splice(key,1);
	                return false;
	            }
	        });
	    };*/
	    $scope.drophonor = function(honorfile){
	    	 if(confirm("确定要删除吗？")){
	           angular.forEach($scope.totalfiles,function(item, key){if(item == honorfile){ $scope.totalfiles.splice(key,1);  $scope.delimg(honorfile); return; }});
	    	 }
	      };
	      $scope.delimg=function(honorfile){
	    	
	    		 if(honorfile.indexOf("http:")!=-1){
	   	          angular.forEach($scope.rmomtfiles,function(item, key){
	   	            if(item.location==honorfile){
	   	              $http({ method:'DELETE',url:ER.root+'/i/rdc/deleteStoragePic', params:item}).success(function(){  });  
	   	                        return;              
	   	            }
	   	           });
	   	        }
	        
	      };
	    function checkStorageSubmit(){
	        // 检查必须填写项   仓库
	        if ($scope.title == undefined || $scope.title == '' ) {return false; }
	        //if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {return false;}
	        if ($scope.temperType == undefined || $scope.temperType == '') { return false;}
	        if($scope.rdcsharedto.rdcID==null||$scope.rdcsharedto.rdcID==undefined){
	        	if ($scope.manageType == undefined || $scope.manageType == '') { return false;}
	        }
	        if ($scope.sqm == undefined || $scope.sqm == '') { return false;}
	        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') { return false;}
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {return false;}
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {return false;}
	        return true;
	    }
	    
	    
	    function checkGoodsSubmit(){
	        // 检查必须填写项   货品
	        if ($scope.title == undefined || $scope.title == '' ) {return false;}
	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {return false;}
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') { return false;}
            if ($scope.unitprice == undefined) { return false; }
	        if ($scope.sqm == undefined || $scope.sqm == '') {return false;}
	        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') {return false;}
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {return false; }
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {return false;}
	        return true;
	    }
	    
	    
	    function checkCarSubmit(){
	        // 检查必须填写项   冷运
	        if ($scope.title == undefined || $scope.title == '' ) { return false; }
	        if(releaseCarInfo.onoff){
	        	 if ($scope.stprovinceID == undefined || $scope.stprovinceID == '' ) { return false; }
	             if ($scope.toprovinceID == undefined || $scope.toprovinceID == '' ) {  return false; }
	             if ($scope.stcityID == undefined || $scope.stcityID == '' ) { return false; }
	             if ($scope.tocityID == undefined || $scope.tocityID == '' ) {  return false;  }
	        }else{
	        	if($('.user_defined_address1').val().trim()==""){return false;};//出发地详细地址
	        	if($('.user_defined_address2').val().trim()==""){return false;};//目的地详细地址
	        }
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {return false; }
	        if ($scope.codeLave22 == undefined || $scope.codeLave22 == '') {return false;}
	        if ($scope.codeLave33 == undefined || $scope.codeLave33 == '') {return false;}
	        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') { return false;}
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
	    		$scope.startTime ="每"+$("#sl_attrvalue1_4").val()+"天一次 "+sttime ;
	    		 $scope.arriveTime=   sl2+" "+$("#arriveTime").val();
	    	}else if(attr1==5){
	    		$scope.startTime = $("#sl_attrvalue1_5").val();
	    		 $scope.arriveTime="当天  17:00";
	    		 $("#hl_validEndTime").val("");
	    	}
	    	
	    	var stplace=toplace=""; 
			if(releaseCarInfo.onoff){
				 stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text();
				 toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text();
				if($scope.staddress==undefined){$scope.staddress="";}
				if($scope.toaddress==undefined){$scope.toaddress="";}
		    }else{
		    	$scope.staddress=$scope.toaddress="";
		    	stplace = $('.user_defined_address1').val();//出发地详细地址
				toplace = $('.user_defined_address2').val();//目的地详细地址
		    }
			if(checkMobile($scope.telephone.trim()) == false){
				layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
				return false
			}
			if(checkCarSubmit()){
                if($scope.title.length<6||$scope.title.length>24){
                    layer.open({content: '描述文字长度范围是6~24位，请检查~', btn: '确定'});
                    return;
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
					codeLave1:$scope.codeLave11,
					codeLave2:$scope.codeLave22,
					codeLave3:$scope.codeLave33,
					unitPrice : $scope.unitprice,
		            stprovinceID:$scope.stprovinceID,
				    stcityID:$scope.stcityID,
				    toprovinceID:$scope.toprovinceID,
					tocityID:$scope.tocityID,
					staddress:$scope.staddress,
					toaddress:$scope.toaddress,
					unit1:stplace,
					unit2:toplace,
					validStartTime:$scope.startTime,
					validEndTime : $scope.arriveTime,
					telephone:$scope.telephone.trim(),
					note : $scope.note,
					attrvalue:releaseCarInfo.onoff?1:0,
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
			if(Date.parse($('#sttime').val().replace(/-/g,"/")) > Date.parse($('#endtime').val().replace(/-/g,"/"))){
				layer.open({content:'开始时间和结束时间冲突，请更改~',btn: '确定'});
				return false
			}
			if(checkMobile($scope.telephone.trim()) == false){
				layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
				return false
			}
			if(checkGoodsSubmit()){
                if($scope.title.length<6||$scope.title.length>24){
                    layer.open({content: '描述文字长度范围是6~24位，请检查~', btn: '确定'});
                    return;
                }else if($scope.sqm.length > 11){
		        	layer.open({content:'数量不合法哦~',btn: '确定'});return;
		        }else if(parseFloat($scope.unitprice).toFixed(2).length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
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
					unit1 : $("#boss").val(),
					unitPrice : $scope.unitprice,
					validStartTime : $scope.validStartTime,
					validEndTime : $scope.validEndTime,
					sqm:$scope.sqm,
					telephone:$scope.telephone.trim(),
					note : $scope.note,
					detlAddress:$scope.detlAddress,
					username:window.user.username,
                    publishunit:$scope.publishunit
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
				    content: "修改成功！"
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
		
		$scope.submit = function(){
			console.log($("#manageType").attr("val"))
			$scope.rdcID = '';
			$scope.validStartTime = $("#sttime").val();
			$scope.validEndTime = $("#endtime").val();
			$scope.detlAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
			if($scope.rdcsharedto.rdcID!=''&&$scope.rdcsharedto.rdcID!=undefined&&$scope.rdcsharedto.rdcID!=0){
				 $scope.detlAddress = $scope.rdcsharedto.detlAddress;
			 }
			if($scope.rdcdto!=undefined)
				$scope.storageType = $scope.rdcdto.storagetype;
			if(Date.parse($('#sttime').val().replace(/-/g,"/")) > Date.parse($('#endtime').val().replace(/-/g,"/"))){
				layer.open({content:'开始时间和结束时间冲突，请更改~',btn: '确定'});
				return false
			}
			if(checkMobile($scope.telephone.trim()) == false){
				layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
				return false
			}
			if(checkStorageSubmit()){
                if($scope.title.length<6||$scope.title.length>24){
                    layer.open({content: '描述文字长度范围是6~24位，请检查~', btn: '确定'});
                    return;
                }else if($scope.rdcsharedto.rdcSqm<$scope.sqm){
                    layer.open({content:'可出租面积不能大于关联冷库的总面积~',btn: '确定'});return;
				}
				if($scope.sqm.length > 11){
		        	layer.open({content:'数量不合法哦~',btn: '确定'});return;
		        }else if(parseFloat($scope.unitprice).toFixed(2).length>11){
					layer.open({content:'单价不合法哦~',btn: '确定'});return;
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
					cityid : parseInt($("#city").attr("val")),//$scope.cityId,city
					codeLave2 : $scope.temperType,
					codeLave1:parseInt($("#manageType").attr("val")),
					unit : $scope.unit,
					sqm:$scope.sqm,
					unitPrice : $scope.unitprice,
					validStartTime : $scope.validStartTime,
					validEndTime : $scope.validEndTime,
					telephone:$scope.telephone.trim(),
					note : $scope.note,
					detlAddress:$scope.detlAddress,
                    rentdate:$scope.rentdate,
                    username:window.user.username,
                    publishunit:"3"
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
				    content: "修改成功！"
				    ,btn: '确定'
				    ,shadeClose:false
				    ,yes:function(){
				    	window.location.href ="user-mycoldpublish.html";
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
