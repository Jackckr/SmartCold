/**
 * 发布货品车
 */
var releaseItem = {
	$scope:null,
    initvalidate: function() { //验证必填项
        jQuery.validator.addMethod("isMobile", function(value, element) {var length = value.length; var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;return this.optional(element) || (length == 11 && mobile.test(value));},"请正确填写您的手机号码");
        $("#release_item_from").validate({
            rules: {
                title: { required: true},provinceId: { required: true},city: { required: true },codeLave1: { required: true },
                sqm: { required: true,number:true    },
                unitPrice: { number:true   },
                reservation: { required: true }, telephone: { required: true,isMobile: true }
            },
            messages: {
                title: { required: "请输入描述!"}, provinceId: { required: "请选择省份!"},
                city: { required: "请选择城市！" }, codeLave1: { required: "请选择品类！" },sqm: { required: "请输入数量！" ,number:"请正确输入数量信息！！"}, 
                unitPrice: {number:"请正确输入单价信息！" },
                reservation: { required: "请设置信息有效期！" }, telephone: { required: '请输入联系人电话信息！', pattern: '请正确输入联系方式！'
                }
            },
            success: function(label) {
                label.remove();
            } //label.removeClass('error');label.text("").addClass("success");
        });
    },
   
    savedata: function() {
    	if(user!==null&&user.id!=0){
    	     if ($("#release_item_from").valid()) {
    	            this.addvo();
    	        } else {
    	            $($("#release_item_from input.error")[0]).focus();
    	        }
		  }else{
			   alert("请登录后执行该操作！");
			   window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageAdd#/releaseItemList";
			   return;
		  } 
    },
    addvo: function() {
    	var vo = {}; 
        var stentime=$("#reservationtime").val().split(" - ");
    	if(stentime.length==2){
    		 $("#hl_validEndTime").val(stentime[1]); 
    		 $("#hl_validStartTime").val(stentime[0]);
    	}else{
    		 $("#hl_validEndTime").val(null); 
    		 $("#hl_validStartTime").val(null);
    	}
        var detlAddress=releaseItem.$scope.typeCode==1?$("#rdc_address").text():$("#sl_provinceId option:selected").text()+"-"+$("#sl_cityid option:selected").text();
        $("#hide_div [name=detlAddress]").val(detlAddress);
        $("#release_main div.mode_hide:hidden").find("input,select").attr("disabled",true); 
        var data = $("#release_item_from").serializeArray();
        $.each(data, function(index, item) { vo[item.name] = item.value; });
        return JSON.stringify(vo);
//        var formdata = new FormData();formdata.append("data", JSON.stringify(vo));
//        formdata.append("files", releaseItem.$scope.totalfiles);
//        $.ajax({
//            url: "/i/ShareRdcController/shareFreeRelease",
//            data: formdata,
//            processData: false,
//            contentType: false,
//            type: 'POST',
//            dataType:"json",
//            success: function(data) {
//            	if(data.success){
//            		 alert("发布成功！");
//            		 releaseItem.$scope.gocoldShareComment();
//            	}else{
//            		alert("发布失败！！请稍后重试！");
//            	}
//            }});
        }
};

coldWeb.controller('releaseItem',function($rootScope, $scope, $stateParams, $state, Upload, $cookies, $http, $location) {
	$scope.files;
	$scope.totalfiles = [];
	$scope.addFiles = function (files) {
        $scope.totalfiles = $scope.totalfiles.concat(files);
    }
	$scope.drop = function(file){
        var index = $scope.totalfiles.indexOf(file);
        $scope.totalfiles.splice(index,1);
    }
	$scope.submit = function(){
		var data = {data:releaseItem.addvo(), "files":$scope.totalfiles};
		Upload.upload({
            url: "/i/ShareRdcController/shareFreeRelease",
            headers :{ 'Content-Transfer-Encoding': 'utf-8' },
            data: data
        }).then(function (resp) {
        	alert("发布成功！");
        	$scope.gocoldShareComment();
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.name);
        });
	}
	
	if(user==null||(user!=null&&user.id==0)){
		   alert("请登录后执行该操作！");
		   window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";
		   return;
	 }else{
		 $("#release_main").show();
	 }
	releaseItem.$scope=$scope;
	$scope.appmode=[{},{tit:"货品",tolimg:["goods","outCur","offerCur"],tool:[[1,"出售"],[2,"求购"]],lab:[["数量","吨"],["单价","元/吨"]]},{tit:"配送",tolimg:["car","carCur","noCarCur"],tool:[[1,"找货"],[2,"找车"]],lab:[["数量","吨"],["单价","元/吨"]]},{tit:"仓库",tolimg:["rent","rentCur","noRentCur"],tool:[[1,"出租"],[2,"求租"]],lab:[["数/质/量",""],["单价","元/平方米"]]}];
	$scope.gocoldShareComment=function(){ 
		$state.go('coldShareComment',{_cuttid: $scope.dataType});
	};
    $scope.initMode=function(){
    	$(".mode_hide").hide();
    	$(".mode_"+$scope.dataType).show();
    	$(".mode_"+$scope.dataType+"_"+ $scope.typeCode).show();
    	$("#txt_rdcID").attr("disabled",$scope.typeCode==2?true:false); 
    	$("#tool"+$scope.typeCode).addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
    };
    $scope.changtype=function(_em){
    	   var em=$(_em); 
    	   if(em.attr("value")==1&&$scope.rdcID==null){
    		   alert("请去去发布页面选择冷库信息！然后才能发布出租信息！");
    		   $state.go('releaseItemList',{data:null,dataid:null,_cuttid: $scope.dataType});
    		   return;
    	   }
  	       $("#item_type_div span").removeClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]); 
	       $scope.typeCode=em.attr("value");
	    //   em.addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
	       $scope.typeText=em.text();
	       $scope.initMode();
    };
    $scope.initdata = function() {
        releaseItem.initvalidate();
        $scope.dataType = $stateParams._cuttid?$stateParams._cuttid:1;//当前数据类型
        if ($stateParams.data) {
        	$scope.rdcinfo = $stateParams.data;//选择冷库、货品、车的信息
        	$scope.rdcID = $stateParams.data.rdcID;
            $scope.rdcimgs = $stateParams.data.files;
            $scope.typeCode=$scope.appmode[$scope.dataType].tool[0][0];
            $scope.typeText=$scope.appmode[$scope.dataType].tool[0][1];
        } else{
        	$scope.typeCode=$scope.appmode[$scope.dataType].tool[1][0];
            $scope.typeText=$scope.appmode[$scope.dataType].tool[1][1];
//            $("#item_type_div span:last").addClass($scope.appmode[$scope.dataType].tolimg[2]);
//            $("#item_type_div span:first").removeClass($scope.appmode[$scope.dataType].tolimg[1]);
        }
        $scope.initMode();
        $http.get('/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据
        $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30,format: 'YYYY-MM-DD HH:mm'});
        $http.get('/i/city/findProvinceList').success(function(data) {
        	$scope.provinces = data; 
        	$scope.provinceId = data[0].provinceId; 
        	$scope.provinceName = data[0].provinceName; 
        	$scope.changcity();
        }); //加载区域数据
        $scope.changcity = function(id) {
        	$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.provinceId}  }).success(function(data) {$scope.city = data;}); 
        };
    };

    $scope.initdata();
});