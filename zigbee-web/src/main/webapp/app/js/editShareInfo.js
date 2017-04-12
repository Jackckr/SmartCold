coldWeb.controller('editShareInfo', function ($rootScope, $scope, $state, $cookies, $http, Upload, $stateParams,$location) {
	var onoff = true;
	$scope.totalfiles = [];
	$scope.changline=function(uline){
		if (uline) {
			$('.route select').hide();
			$('.route input').css('width',400);
			$("#user-defined").html('自定义');
			$('.user_defined_address1').attr('placeholder','请输入自定义出发地址');
			$('.user_defined_address2').attr('placeholder','请输入自定义目的地址');
			onoff = false;
		} else {
			$('.route select').show();
			$('.route input').css('width',200);
			$("#user-defined").html('固定路线');
			$('.user_defined_address1').attr('placeholder','请输入详细地址(选填)');
			$('.user_defined_address2').attr('placeholder','请输入详细地址(选填)');
			onoff = true;
		}
	};
    $('#user-defined').click(function(){ $scope.changline(onoff);});
	 $.getScript('assets/plugins/daterangepicker2/bootstrap-datetimepicker.js',function(){  	});  
	 $scope.initData=function(vo){
		 if(vo.dataType==2){
			 releaseCarInfo.changtimemode(vo.attrvalue1);
			 $scope.changline(vo.attrvalue=='0');
			 if(vo.attrvalue=='0'){
				    $('.user_defined_address1').val(vo.unit1);
					$('.user_defined_address2').val(vo.unit2);
			 }
			 if(vo.attrvalue1==3){
				 $scope.validStartTime = vo.validStartTime;  
				 $scope.validEndTime = vo.validEndTime;
			 }else if(vo.attrvalue1==1||vo.attrvalue1==2){
				var tstime= vo.validStartTime.substring(2).trim(), 
				tetime= vo.validEndTime.substring(vo.validEndTime.lastIndexOf(":")-2).trim();
				 if(vo.attrvalue1==1){
					 $scope.validStartTime = tstime;  $scope.validEndTime = tetime; 
				 }else{
			    	 $scope.validEndTime = tetime; 
			    	 if(tstime.lastIndexOf(",")!=-1){
			    		 $scope.validStartTime = tstime.substring(tstime.lastIndexOf(" ")+1);
			    		 var work= tstime.substring(0,tstime.lastIndexOf(",")+2).trim().split(",");
					     if(work&&work!=""&&work!=" "){ 
					    		$.each(work, function(i, vo){ 
					    			if(vo!=""&&vo!=" "){ var em=	$("#st_sttime input:checkbox[value="+vo+"]"); em.attr("checked");  em.parent().addClass("active"); }
					    		 });
						  };
			    	 }else{
			    		 $scope.validStartTime = tstime;
			    	 }
			    }
			 }else if(vo.attrvalue1==4){
				 $scope.validStartTime = vo.validStartTime.substring(vo.validStartTime.lastIndexOf(" ")+1).trim();
				 $scope.validEndTime = vo.validEndTime.substring(vo.validEndTime.lastIndexOf(":")-2).trim();
				 $("#sl_attrvalue1_4").val( vo.validStartTime.substring(1,2).trim());
			 }else if(vo.attrvalue1==5){
				 $("#sl_attrvalue1_5").val(vo.validStartTime);  $scope.validEndTime = vo.validEndTime;
			 }
			 var unita=vo.unit1.split("-"),unitb=vo.unit2.split("-"); if(unita.length==3){$scope.staddress=vo.unit1.split("-")[2];};  if(unitb.length==3){$scope.toaddress=vo.unit2.split("-")[2];};
			 $("#txt_sattim").val( $scope.validStartTime );  $("#txt_endtim").val( $scope.validEndTime );
			 $scope.staddress=vo.staddress;
		     $scope.toaddress=vo.toaddress;	
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
    	 if(!data.success){alert("数据查询失败！请刷新页面重试");return;}
    	 $scope.initData(data.entity);
    	 if(data.entity.unitPrice=="0.00"){data.entity.unitPrice=null;}
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
    	 $scope.temperType =parseInt($scope.rdcsharedto.codeLave2);
    	 $scope.manageType = parseInt($scope.rdcsharedto.codeLave1);
    	 $scope.unit = $scope.rdcsharedto.unit;
    	 $scope.totalfiles = $scope.rdcsharedto.files;
    	 $scope.rmomtfiles = $scope.rdcsharedto.fileList;
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
	            console.log($scope.cityId)
	            $scope.cityId = $scope.cityId;
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
	        	}else if(files[j].size > 10485760){
	        		alert("最大只能上传10M的图片");
	        		return false
	        	}
	    	}
			if(files.length==0){return;};
			var allfiles = $scope.totalfiles.concat(files);
			if(allfiles.length>10){alert("最多选择10张！"); /*layer.open({content: '最多选择10张哦' ,btn: '确定'});*/return;}
	        $scope.totalfiles=allfiles; 
	    };
	    $scope.drophonor = function(honorfile){
	    	angular.forEach($scope.totalfiles,function(item, key){if(item == honorfile){ $scope.totalfiles.splice(key,1);  $scope.delimg(honorfile); return; }});
	    };
	    $scope.delimg=function(honorfile){
	    	if(honorfile.indexOf("http:")!=-1){
	    		angular.forEach($scope.rmomtfiles,function(item, key){
	    			if(item.location==honorfile){
//	    				item.location=item.type;
	    				$http({ method:'DELETE',url:'i/rdc/deleteStoragePic', params:item}).success(function(){  });	
                        return;	    				
	    			}
	    		 });
	    	}
	    };
	    function checkStorageSubmit(){
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) { return false;}
//	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {return false;}
	        if ($scope.temperType == undefined || $scope.temperType == '') {return false;}
	        if ($scope.manageType == undefined || $scope.manageType == '') { return false;}
	        if ($scope.sqm == undefined || $scope.sqm == '') {return false;}
	        if ($scope.telephone == undefined || $scope.telephone == '') {return false;}
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') { return false;}
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {return false;}
	        return true;
	    }
	    
	    
	    function checkGoodsSubmit(){
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {return false;}
	        if ($scope.detlAddress == undefined || $scope.detlAddress == ''||$scope.detlAddress == '-') {return false;}
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {return false;}
	        if ($scope.sqm == undefined || $scope.sqm == '') {return false;}
	        if ($scope.telephone == undefined || $scope.telephone == '') { return false;}
	        if ($scope.validStartTime == undefined || $scope.validStartTime == '') {return false;}
	        if ($scope.validEndTime == undefined || $scope.validEndTime == '') {return false;}
	        return true;
	    }
	    
	    
	    function checkCarSubmit(){
	        // 检查必须填写项
	        if ($scope.title == undefined || $scope.title == '' ) {return false;}
	        if($("#stprovince").is(':visible')){
	        	if ($scope.stprovinceID == undefined || $scope.stprovinceID == '' ) { return false;}
	        	if ($scope.toprovinceID == undefined || $scope.toprovinceID == '' ) {return false;}
	        	if ($scope.stcityID == undefined || $scope.stcityID == '' ) { return false;}
	        	if ($scope.tocityID == undefined || $scope.tocityID == '' ) {return false;}
	        }else{
	        	if($scope.staddress==""||$scope.toaddress==""){
	        		return false;
	        	}
	        }
	        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') {return false;}
	        if ($scope.codeLave22 == undefined || $scope.codeLave22 == '') {return false;}
	        if ($scope.codeLave33 == undefined || $scope.codeLave33 == '') {return false; }
	        if ($scope.telephone == undefined || $scope.telephone == '') {return false;}
	        return true;
	    }
	    
	    
	    
		$scope.carSubmit = function(){
			var attr1=$("#sl_attrvalue1").val(),attr2=$("#sl_attrvalue2").val(),sttime=$("#txt_sattim").val(), edtime=$("#txt_endtim").val();
	    	var sl1= $("#sl_attrvalue1").find("option:selected").text(),sl2= $("#sl_attrvalue2").find("option:selected").text();
	    	if(attr1==1){
	    		$scope.startTime =sl1+" "+sttime;
	    		$scope.arriveTime =sl2+" "+edtime;
	    	}else if(attr1==2){
	    		var spCodesTemp = "";
	    		 $('input:checkbox[class="wk_erw"]').parent('label.active').each(function(i){
	    			 spCodesTemp += (this.textContent+","); 
    			 });
	    		 $scope.startTime =sl1+spCodesTemp.substr(0,spCodesTemp.length-1)+" "+sttime;
	    		 $scope.arriveTime =  sl2+" "+edtime;
	    	}else if(attr1==3){
	    		$scope.startTime =sttime;  $scope.arriveTime= edtime;
	    	} else if(attr1==4){
	    		 $scope.startTime="每"+$("#sl_attrvalue1_4").val()+"天一次 "+$("#txt_sattim").val();
	    		 $scope.arriveTime =  sl2+" "+$("#txt_endtim").val();
	    	}else if(attr1==5){
	    		 $scope.startTime=$("#sl_attrvalue1_5").val();
	    		 $scope.arriveTime = null;
	    		 $("#hl_validEndTime").val("");
	    	}
			var stplace = $("#stprovince option:selected").text()+"-"+$("#stcity option:selected").text();
			var toplace = $("#toprovince option:selected").text()+"-"+$("#tocity option:selected").text();
	        if(!onoff){
	        	stplace = $('.user_defined_address1').val();//出发地详细地址
	        	toplace = $('.user_defined_address2').val();//目的地详细地址
	        }
	        if(checkMobile($scope.telephone.trim()) == false){
	    		alert("请输入正确的手机号码或者座机号码~");
	    		return false
			}
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
					telephone:$scope.telephone.trim(),
					note : $scope.note,
					attrvalue:onoff?1:0,
					attrvalue1:attr1,
	    	        attrvalue2: attr2,
	    	        staddress:$scope.staddress?$scope.staddress:"",
	    	        toaddress:$scope.toaddress?$scope.toaddress:"",	
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
			if(checkMobile($scope.telephone.trim()) == false){
	    		alert("请输入正确的手机号码或者座机号码~");
	    		return false
			}
			if(checkGoodsSubmit()){
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
			if(checkMobile($scope.telephone.trim()) == false){
	    		alert("请输入正确的手机号码或者座机号码~");
	    		return false
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
					telephone:$scope.telephone.trim(),
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
