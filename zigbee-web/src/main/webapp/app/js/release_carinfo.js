/**
* 发布货品车
 */
var releaseCarInfo = {
	wk_type:1,//每天1，每周2，固定3
	$scope:null,
	vistHHMM:function(em,value, element){
		var reg = null, type = $("#sl_attrvalue1").val(), vlength = type == 3 ? 16
				: 5, length = value.length;
		if (type == 3) {
			reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
		} else {
			reg = /^(?:[01]?\d|2[0-3]){1}(?::[0-5]?\d){1}$/;
		}
		return em.optional(element) || (length == vlength && reg.test(value));
	},
    initvalidate: function() { //验证必填项
        jQuery.validator.addMethod("isMobile", function(value, element) {var length = value.length; var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;return this.optional(element) || (length == 11 && mobile.test(value));},"请正确填写您的手机号码");
        jQuery.validator.addMethod("isHHmm",   function(value, element) {
        	var vis= releaseCarInfo.vistHHMM(this,value, element);
        	if(vis&&$("#sl_attrvalue1").val()==2){
        		vis= $('input:checkbox[class="wk_erw"]:checked').length>0;
        		if(!vis){ jQuery.validator.messages.isHHmm='请选择周一至周天具体发车时间!'; }else{ jQuery.validator.messages.isHHmm='发车时间设置式不正确！';  }
        		return vis;
        	}
           return vis;
        },'发车时间设置式不正确！');
        jQuery.validator.addMethod("isEndHHmm",   function(value, element) {
        	var vis=  releaseCarInfo.vistHHMM(this,value, element);;
        	if(vis){
        		if($("#sl_attrvalue1").val()=='3'){//('#txt_sattim,#txt_endtim'
        			var sattim =new Date($('#txt_sattim').val());
        			var endtim =new Date($('#txt_endtim').val());
        			var isok= endtim>sattim;
        			if(sattim==endtim||!isok){
        				jQuery.validator.messages.isEndHHmm="到达时间应晚于发车时间！";
        				return false;
        			}
        			return true;
        	   }else if($("#sl_attrvalue2").val()==1){
        			var a= $('#txt_sattim').val().split(":");
        			var b= $('#txt_endtim').val().split(":");
        			if(a[0]>b[0]){ 
        				jQuery.validator.messages.isEndHHmm="到达时间应晚于发车时间！";
        				return false;
        			}else if(a[0]==b[0]&&(a[1]>b[1]||a[1]==b[1])){
        				jQuery.validator.messages.isEndHHmm="到达时间应晚于发车时间！";
        				return false;
        			}
        			return true;
        	 }
        	}
        	jQuery.validator.messages.isEndHHmm="到达时间设置错误！";
          return vis;	
        },"到达时间设置错误！");
        $("#release_item_from").validate({
            rules: {
                title: { required: true},provinceId: { required: true},city: { required: true },
                codeLave1: { required: true },
                sl_attrvalue1_4: { required: true },
                sl_attrvalue1_5: { required: true },
                sqm: { required: true,number:true    },
                unitPrice: {  number:true   },
                reservation: { required: true }, telephone: { required: true,isMobile: true },
                txt_sattim:{required: true,isHHmm:true},txt_endtim:{required: true,isEndHHmm:true}
            },
            messages: {
                title: { required: "请输入描述!"}, provinceId: { required: "请选择省份!"},
                city: { required: "请选择城市！" }, codeLave1: { required: "请选择品类！" }, sl_attrvalue1_4: { required: "请输入发车间隔时间！" }, sl_attrvalue1_5: { required: "请输入发车信息！" },
                sqm: { required: "请输入数量！" ,number:"请正确输入数量信息！！"}, unitPrice: {number:"请正确输入单价信息！" },
                reservation: { required: "请设置信息有效期！" }, telephone: { required: '请输入联系人电话信息！', pattern: '请正确输入联系方式！'},
                txt_sattim: {  required: '请输入发车时间！', pattern: '请正确输入发车时间！'}, txt_endtim: { required: '请输入到达时间！', pattern: '请正确输入到达时间！'}
            },
            success: function(label) {
                label.remove();
            } 
        });
    },
   changtimemode:function(val){
    	$("#st_sttime,#en_endtime").find(".obj_hide").hide();
    	$("#st_sttime .time_mod"+val).show();
    	$("#en_endtime .time_mod"+val).show();
    	$("#txt_sattim").css("width",val==3?"320px":"85px");
    	$("#txt_endtim").css("width",val==3?"405px":"85px");
    	if(val==3){
    		$("#sattim_div,#en_endtime").show();
    		$('#txt_sattim,#txt_endtim').datetimepicker('remove');
    	    $('#txt_sattim,#txt_endtim').datetimepicker({ format: 'yyyy-mm-dd hh:ii', weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 2,forceParse: 0,showMeridian: 1 });
    	    $('#txt_sattim,#txt_endtim').datetimepicker('update', new Date());
    	}else if(val==1||val==2) {
    		$("#sattim_div,#en_endtime").show();
    		$('#txt_sattim,#txt_endtim').datetimepicker('remove');
    	    $('#txt_sattim,#txt_endtim').datetimepicker({  format: 'hh:ii', weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0});
    	    $('#txt_sattim').datetimepicker('update', '1899-12-31 09:00:00');  $('#txt_endtim').datetimepicker('update', '1899-12-31 17:00:00');
    	}else if(val==4){
    		$('#txt_sattim,#txt_endtim').datetimepicker('remove');
    		 $('#txt_sattim,#txt_endtim').datetimepicker({  format: 'hh:ii', weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0});
    		 $('#txt_sattim').datetimepicker('update', '1899-12-31 00:00:00');  $('#txt_endtim').datetimepicker('update', '1899-12-31 17:00:00');
    		$("#en_endtime").show();
    		$("#sattim_div").hide();
    	}else{
    		$("#sattim_div,#en_endtime").hide();
    	}
    },
    savedata: function() {if ($("#release_item_from").valid()) { this.addvo(); } else {$($("#release_item_from input.error")[0]).focus();} },
    checktime:function(em){},
    addvo: function() {
    	var vo = {}; 
    	var attr1=$("#sl_attrvalue1").val();
    	var sl1= $("#sl_attrvalue1").find("option:selected").text();
    	var sl2= $("#sl_attrvalue2").find("option:selected").text();
    	if(attr1==1){
    		 $("#hl_validStartTime").val(sl1+" "+$("#txt_sattim").val());
    		 $("#hl_validEndTime").val(  sl2+" "+$("#txt_endtim").val());
    	}else if(attr1==2){
    		var spCodesTemp = "";
    		 $('input:checkbox[class="wk_erw"]:checked').each(function(i){spCodesTemp += ($(this).val()+","); });
    		 $("#hl_validStartTime").val(sl1+spCodesTemp.substr(0,spCodesTemp.length-1)+" "+$("#txt_sattim").val());
    		 $("#hl_validEndTime").val(  sl2+" "+$("#txt_endtim").val());
    	}else if(attr1==3){
        		 $("#hl_validEndTime").val($("#txt_sattim").val()); 
        		 $("#hl_validStartTime").val($("#txt_endtim").val());
    	} else if(attr1==4){
    		 $("#hl_validStartTime").val("每"+$("#sl_attrvalue1_4").val()+"天一次");
    		 $("#hl_validEndTime").val(  sl2+" "+$("#txt_endtim").val());
    	}else if(attr1==5){
    		 $("#hl_validStartTime").val($("#sl_attrvalue1_5").val());
    		 $("#hl_validEndTime").val("");
    	}
        var unit1=$("#sl_provinceId1 option:selected").text()+"-"+$("#sl_cityid1 option:selected").text();
        var unit2=$("#sl_provinceId2 option:selected").text()+"-"+$("#sl_cityid2 option:selected").text();
        
        $("#hide_div [name=unit1]").val(unit1);
        $("#hide_div [name=unit2]").val(unit2);
        var data = $("#release_item_from").serializeArray();
        $.each(data, function(index, item) { vo[item.name] = item.value; });
        return JSON.stringify(vo);
        },
        deleteimg:function (i,em){//releaseCarInfo.deleteimg
        	releaseCarInfo.$scope.drop(i,em);
        }
};
coldWeb.controller('releaseCarInfo',function($rootScope, $scope, $stateParams, Upload, $state, $cookies, $http, $location) {
	if(user==null||(user!=null&&user.id==0)){util.info(null,"请登录后执行该操作！",function(){window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseCarInfo";return;});return;}
	$scope.routes=[{"id":"0","name":"路线"},{"id":"1","name":"自定义路线"}];
	$scope.route = "0";
	$scope.routechange=function(){
		if($scope.route=="0"){
		$("#routeselect1").show();
		$("#routeselect2").hide();
		}
		if($scope.route=="1"){
			$("#routeselect2").show();
			$("#routeselect1").hide();
		}
    };
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
//		  $('#txt_sattim,#txt_endtim').datetimepicker('update', new Date());
	});  
	$scope.files;
	$scope.totalfiles = [];
	$scope.addFiles = function (files) {
		if(files.length==0){return;};
		var allfiles = $scope.totalfiles.concat(files);
		if(allfiles.length>10){alert("最多选择10张！");return;}
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
	$scope.submit = function(){
		if ($("#but_submit").data('isLoading') === true) return; 
		if(user!==null&&user.id!=0){ if (!$("#release_item_from").valid()) { $($("#release_item_from input.error")[0]).focus();  return; }  }else{util.info(null,"请登录后执行该操作！",function(){ window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";});return;}
		 $("#but_submit").text("保存中...");
		 $("#but_submit").data('isLoading', true);
		var data = {data:releaseCarInfo.addvo(), "files":$scope.totalfiles};
		Upload.upload({
            url: "/i/ShareRdcController/shareFreeRelease",
            headers :{ 'Content-Transfer-Encoding': 'utf-8' },
            data: data
        }).then(function (resp) {
        	$("#but_submit").text("发布"); $("#but_submit").delay(500).data('isLoading',false);
        	alert(resp.data.message);
        	$scope.gocoldShareComment();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.name);
        });
	};
	$scope.gl_rdc=1;
	$scope.dataType = 2;//当前数据类型
	releaseCarInfo.$scope=$scope;
	$scope.appmode=[{},{tit:"货品-测试",tolimg:["goods","outCur","offerCur"],tool:[[1,"出售"],[2,"求购"]]},{tit:"配送-测试",tolimg:["car","carCur","noCarCur"],tool:[[1,"找货"],[2,"找车"]]},{tit:"仓库-测试",tolimg:["rent","rentCur","noRentCur"],tool:[[1,"出租"],[2,"求租"]]}];
	$scope.gocoldShareComment=function(){ $state.go('coldShareComment',{_cuttid: 2});};
    $scope.initMode=function(){
    	$(".mode_hide").addClass("hide");
    	$(".mode_"+$scope.dataType).removeClass("hide");
    	$(".mode_"+$scope.dataType+"_"+ $scope.typeCode).removeClass("hide");
    	$("#tool"+$scope.typeCode).addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
    	if( $scope.rdcinfo==null){$("#recinfo_div").hide();}else{$("#recinfo_div").show();}
    };
    $scope.changtype=function(_em){
  	       var em=$(_em); 
  	       $("#item_type_div span").removeClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]); 
	       $scope.typeCode=em.attr("value");
	       em.addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
	       $scope.typeText=em.text();
	       $scope.initMode();
    };
    
    $scope.changcity1 = function(id) {
    	$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.stprovinceID}  }).success(function(data) {$scope.city1 = data;}); 
    };
    $scope.changcity2 = function(id) {
    	$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.toprovinceID}  }).success(function(data) {$scope.city2 = data;}); 
    };
    $scope.initdata = function() {
    	$scope.rdcinfo=$stateParams.data;
    	$scope.seltype=$stateParams.dataid!=null?$stateParams.dataid:1;//支持直接发布
    	if ($scope.rdcinfo) { $scope.rdcID = $stateParams.data.rdcID; $scope.rdcimgs = $stateParams.data.files;}
        $scope.typeCode=$scope.appmode[$scope.dataType].tool[$scope.seltype][0];
        $scope.typeText=$scope.appmode[$scope.dataType].tool[$scope.seltype][1];
        $scope.initMode();
        releaseCarInfo.initvalidate();
        
        $http.get('/i/ShareRdcController/getPSFilterData').success(function(data) {
        	$scope.codeLave1 = data.entity.fm;
        	$scope.codeLave2 = data.entity.cl;
        	$scope.ps_cr_type = data.entity.sk;
        }); //
        $http.get('/i/city/findProvinceList').success(function(data) {
        	$scope.provinces = data; 
        	$scope.stprovinceID = data[0].provinceId; 
        	$scope.toprovinceID = data[0].provinceId; 
        	$scope.changcity1();
        	$scope.changcity2();
        }); //加载区域数据
    };
    $scope.initdata();
});