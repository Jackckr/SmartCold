/**
* 发布货品车
 */
var releaseCarInfo = {
	$scope:null,
    initvalidate: function() { //验证必填项
        jQuery.validator.addMethod("isMobile", function(value, element) {var length = value.length; var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;return this.optional(element) || (length == 11 && mobile.test(value));},"请正确填写您的手机号码");
        $("#release_item_from").validate({
            rules: {
                title: { required: true},provinceId: { required: true},city: { required: true },
                codeLave1: { required: true },
                sqm: { required: true,number:true    },
                unitPrice: {  number:true   },
                reservation: { required: true }, telephone: { required: true,isMobile: true }
            },
            messages: {
                title: { required: "请输入描述!"}, provinceId: { required: "请选择省份!"},
                city: { required: "请选择城市！" }, codeLave1: { required: "请选择品类！" },
                sqm: { required: "请输入数量！" ,number:"请正确输入数量信息！！"}, unitPrice: {number:"请正确输入单价信息！" },
                reservation: { required: "请设置信息有效期！" }, telephone: { required: '请输入联系人电话信息！', pattern: '请正确输入联系方式！'
                }
            },
            success: function(label) {
                label.remove();
            } 
        });
    },
   changtimemode:function(em){
    	var val= $(em).val();
    	$("#st_sttime").find(".obj_hide").hide();
    	$("#st_sttime .time_mod"+val).show();
    	$("#txt_endtim").css("width",val==3?"337px":"110px");
        $("#sl_attrvalue2,#txt_endtim").attr("disabled",val==3);
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
    		var stentime=$("#reservationtime").val().split(" - ");
        	if(stentime.length==2){
        		 $("#hl_validEndTime").val(stentime[1]); 
        		 $("#hl_validStartTime").val(stentime[0]);
        	}else{
        		 $("#hl_validEndTime").val( ""); 
        		 $("#hl_validStartTime").val("");
        	}
    	} 
        var unit1=$("#sl_provinceId1 option:selected").text()+"-"+$("#sl_cityid1 option:selected").text();
        var unit2=$("#sl_provinceId2 option:selected").text()+"-"+$("#sl_cityid2 option:selected").text();
        $("#hide_div [name=unit1]").val(unit1);
        $("#hide_div [name=unit2]").val(unit2);
        var data = $("#release_item_from").serializeArray();
        $.each(data, function(index, item) { vo[item.name] = item.value; });
        return JSON.stringify(vo);
        }
    
};
coldWeb.controller('releaseCarInfo',function($rootScope, $scope, $stateParams, Upload, $state, $cookies, $http, $location) {
	if(user==null||(user!=null&&user.id==0)){util.info(null,"请登录后执行该操作！",function(){window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseCarInfo";return;});return;}
	$scope.files;
	$scope.totalfiles = [];
	$scope.addFiles = function (files) {
        $scope.totalfiles = $scope.totalfiles.concat(files);
        var files = $scope.totalfiles ; // FileList object
	    for (var i = 0, f; f = files[i]; i++) {
	      if (!f.type.match('image.*')) { continue;}
	      var reader = new FileReader();
	      reader.onload = (function(theFile) {  return function(e) {  var innerHTML = ['<span><img class="thumb" src="', e.target.result,  '" title="', escape(theFile.name), '"/></span>'].join('');$("#img_list").append(innerHTML);  }; })(f);
	      reader.readAsDataURL(f);
	    }
    };
	$scope.drop = function(file){
        var index = $scope.totalfiles.indexOf(file);
        $scope.totalfiles.splice(index,1);
    };
	$scope.submit = function(){
		if(user!==null&&user.id!=0){ if (!$("#release_item_from").valid()) { $($("#release_item_from input.error")[0]).focus();  return; }  }else{util.info(null,"请登录后执行该操作！",function(){ window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";});return;}
		var data = {data:releaseCarInfo.addvo(), "files":$scope.totalfiles};
		Upload.upload({
            url: "/i/ShareRdcController/shareFreeRelease",
            headers :{ 'Content-Transfer-Encoding': 'utf-8' },
            data: data
        }).then(function (resp) {
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
        //初始化数据
        $('#reservationtime').daterangepicker({timePicker: true,timePicker12Hour : false,  timePickerIncrement: 1,format: 'YYYY-MM-DD HH:mm:ss'}, function(start, end, label) {//格式化日期显示框  
            $('#txt_endtim').val( end.format('YYYY-MM-DD HH:mm:ss'));  
        });
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