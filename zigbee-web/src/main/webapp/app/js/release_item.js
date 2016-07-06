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
                unitPrice: { required: true, number:true   },
                reservation: { required: true }, telephone: { required: true,isMobile: true }
            },
            messages: {
                title: { required: "请输入描述!"}, provinceId: { required: "请选择省份!"},
                city: { required: "请选择城市！" }, codeLave1: { required: "请选择品类！" },sqm: { required: "请输入数量！" ,number:"请正确输入数量信息！！"}, unitPrice: { required: "请输入单价",number:"请正确输入单价信息！" },
                reservation: { required: "请设置信息有效期！" }, telephone: { required: '请输入联系人电话信息！', pattern: '请正确输入联系方式！'
                }
            },
            success: function(label) {
                label.remove();
            } //label.removeClass('error');label.text("").addClass("success");
        });
    },
   
    savedata: function() {
        if ($("#release_item_from").valid()) {
            this.addvo();
        } else {
            $($("#release_item_from input.error")[0]).focus();
        }
    },
    addvo: function() {
    	var vo = {}; 
        $("#hl_validEndTime").val( $("[name=daterangepicker_end]").val());
        $("#hl_validStartTime").val($("[name=daterangepicker_start]").val());
        var data = $("#release_item_from").serializeArray();
        $.each(data, function(index, item) { vo[item.name] = item.value; });
        var formdata = new FormData();formdata.append("data", JSON.stringify(vo));
        $.ajax({
            url: "/i/ShareRdcController/shareFreeRelease",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            dataType:"json",
            success: function(data) {
            	if(data.success){
            		 alert("发布成功！");
            		 releaseItem.$scope.gocoldShareComment();
            	}else{
            		alert("发布失败！！请稍后重试！");
            	}
            }});
        }
};

coldWeb.controller('releaseItem',function($rootScope, $scope, $stateParams, $state, $cookies, $http, $location) {
	releaseItem.$scope=$scope;
	$scope.appmode=[{},{tit:"货品-测试",tool:[[1,"出货"],[2,"求货"]],lab:[["数量","吨"],["单价","元/吨"]]},{tit:"配送-测试",tool:[[1,"有车"],[2,"求车"]],lab:[["数量","吨"],["单价","元/吨"]]},{tit:"仓库-测试",tool:[[1,"出租"],[2,"求租"]],lab:[["数/质/量",""],["单价","元/平方米"]]}];
	$scope.gocoldShareComment=function(){
		  $state.go('coldShareComment');
	};
    $scope.initMode=function(){
    	$(".mode_hide").hide();
    	$(".mode_"+$scope.dataType).show();
    	$(".mode_"+$scope.dataType+"_"+ $scope.typeCode).show();
    	$("#tx_title").val($scope.appmode[$scope.dataType].tit+$scope.appmode[$scope.dataType].tool[$scope.typeCode-1][1]+parseInt(Math.random()*100)+"!");
    };
    $scope.changtype=function(_em){
  	    var em=$(_em); $("#item_type_div span").removeClass("outCur");
	    em.addClass("outCur");
	    $scope.typeCode=em.attr("value");
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
            $("#item_type_div span:last").addClass("outCur");
            $("#item_type_div span:first").removeClass("outCur");
        }
        $scope.initMode();
        $http.get('/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据
        $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30,format: 'YYYY-DD-MM HH:mm'});
        $http.get('/i/city/findProvinceList').success(function(data) {
        	$scope.provinces = data; 
        	$scope.provinceId = data[0].provinceId; 
        	$scope.changcity();
        }); //加载区域数据
        $scope.changcity = function(id) {
        	$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.provinceId}  }).success(function(data) {$scope.city = data;}); 
        };
    };

    $scope.initdata();
});