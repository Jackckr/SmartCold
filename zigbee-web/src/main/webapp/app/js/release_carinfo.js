/**
* 发布货品车
 */
var releaseCarInfo = {
	wk_type:1,//每天1，每周2，固定3
	$scope:null,
    initvalidate: function() { //验证必填项
        jQuery.validator.addMethod("isMobile", function(value, element) {var length = value.length; var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;return this.optional(element) || (length == 11 && mobile.test(value));},"请正确填写您的手机号码");
        jQuery.validator.addMethod("isHHmm",   function(value, element) {
        	var reg=null;
        	var type=$("#sl_attrvalue1").val();
            var vlength =type==3? 16:5; 
            var length = value.length;
            if(type==3){
            	 reg=/^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/; 
            }else{
            	 reg=/^(?:[01]?\d|2[0-3]){1}(?::[0-5]?\d){1}$/; 
            }
            return this.optional(element) || (length ==vlength && reg.test(value));},"时间格式不正确！");
        $("#release_item_from").validate({
            rules: {
                title: { required: true},provinceId: { required: true},city: { required: true },
                codeLave1: { required: true },
                sqm: { required: true,number:true    },
                unitPrice: {  number:true   },
                reservation: { required: true }, telephone: { required: true,isMobile: true },
                txt_sattim:{required: true,isHHmm:true},txt_endtim:{required: true,isHHmm:true}
            },
            messages: {
                title: { required: "请输入描述!"}, provinceId: { required: "请选择省份!"},
                city: { required: "请选择城市！" }, codeLave1: { required: "请选择品类！" },
                sqm: { required: "请输入数量！" ,number:"请正确输入数量信息！！"}, unitPrice: {number:"请正确输入单价信息！" },
                reservation: { required: "请设置信息有效期！" }, telephone: { required: '请输入联系人电话信息！', pattern: '请正确输入联系方式！'},
                txt_sattim: {  required: '请输入发车时间！', pattern: '请正确输入发车时间！'}, txt_endtim: { required: '请输入到达时间！', pattern: '请正确输入到达时间！'}
            },
            success: function(label) {
                label.remove();
            } 
        });
    },
   changtimemode:function(em){
    	var val= $(em).val();
    	$("#st_sttime,#en_endtime").find(".obj_hide").hide();
    	$("#st_sttime .time_mod"+val).show();
    	$("#en_endtime .time_mod"+val).show();
    	$("#txt_sattim").css("width",val==3?"320px":"85px");
    	$("#txt_endtim").css("width",val==3?"405px":"85px");
    	if(val==3){
    		$('#txt_sattim,#txt_endtim').datetimepicker('remove');
    	    $('#txt_sattim,#txt_endtim').datetimepicker({ format: 'yyyy-mm-dd hh:ii', weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 2,forceParse: 0,showMeridian: 1 });
    	}else{
    		$('#txt_sattim,#txt_endtim').datetimepicker('remove');
    	    $('#txt_sattim,#txt_endtim').datetimepicker({  format: 'hh:ii', weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0});
    	}
    	 $('#txt_sattim,#txt_endtim').datetimepicker('update', new Date());
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
	$.getScript('assets/plugins/daterangepicker2/bootstrap-datetimepicker.js',function(){  
	      $('#txt_sattim').datetimepicker({  format: 'hh:ii', language:  'fr',weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0}).on("click",function(ev){$("#txt_sattim").datetimepicker("setEndDate",  $("#txt_endtim").val());  });
	      $('#txt_endtim').datetimepicker({  format: 'hh:ii', language:  'fr',weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1,startView: 1,minView: 0,maxView: 1,forceParse: 0}).on("click",function(ev){$("#txt_endtim").datetimepicker("setStartDate",$("#txt_sattim").val());  });
		  $('#txt_sattim,#txt_endtim').datetimepicker('update', new Date());
	});  
	$scope.files;
	$scope.totalfiles = [];
//	$scope.addFiles = function (files) {
//		if(files.length==0){return;};
//		var allfiles = $scope.totalfiles.concat(files);
//		if(allfiles.length>10){
//			alert("最多选择10张！");
//		}
//       if( allfiles!=$scope.totalfiles){
//    	   $scope.totalfiles=allfiles;
//    	   $scope.refimg();
//       }
//    };
//    $scope.refimg=function(){
//    	$("#img_list").empty();
//    	var files = $scope.totalfiles ; // FileList object
//	    for (var i = 0, f; f = files[i]; i++) {
//	      if (!f.type.match('image.*')) { continue;}
//	         var reader = new FileReader();
//	         reader.onload = (function(theFile) {  return function(e) { 
//	        	 var innerHTML = ['<span id="thumb_id' + i + '"><img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/><i onclick="releaseCarInfo.deleteimg(' + i+",'" +theFile.name+ '\')">×</i></span>'].join('');
//	        	    $("#img_list").last().append(innerHTML);
//	        	 };
//	        	})(f);
//	      reader.readAsDataURL(f);
//	    }
//    };
//	$scope.drop = function(i,imgname){
//		angular.forEach($scope.totalfiles,function(item, key){
//            if(item.name == imgname){
//                $scope.totalfiles.splice(key,1);
//                $('#img_list img[title=\''+imgname+'\']').parent().remove();
//               return false;
//            }
//        });
//    };
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