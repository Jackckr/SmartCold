/**
 * 发布货品车
 */
var releaseItem = {
	$scope:null,
    initvalidate: function() { //验证必填项
        jQuery.validator.addMethod("isMobile", function(value, element) {var length = value.length; var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;return this.optional(element) || (length == 11 && mobile.test(value));},"请正确填写您的手机号码");
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
                reservation: { required: "请设置信息有效期！" }, telephone: { required: '请输入联系人电话信息！', pattern: '请正确输入联系方式！'}
            },
            success: function(label) { label.remove();  } 
        });
    },
    savedata: function() {if(user!==null&&user.id!=0){if ($("#release_item_from").valid()) {this.addvo();} else {$($("#release_item_from input.error")[0]).focus();}}else{ alert("请登录后执行该操作！"); window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageAdd#/releaseItemList";return; }  },
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
        $("#sl_cityid,#sl_provinceId,#txt_provinceId").attr("disabled",false);
        var data = $("#release_item_from").serializeArray();
        $.each(data, function(index, item) { vo[item.name] = item.value; });
        return JSON.stringify(vo);
        },
        deleteimg:function (i,em){//releaseCarInfo.deleteimg
        	releaseItem.$scope.drop(i,em);
        }
};

coldWeb.controller('releaseItem',function($rootScope, $scope, $stateParams, $state, Upload, $cookies, $http, $location) {
	if(user==null||(user!=null&&user.id==0)){util.info(null,"你还没有登录！请登录后操作！",function(){window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";});return; }else{$("#release_main").show(); }
	$scope.files;
	$scope.totalfiles = [];
	releaseItem.$scope=$scope;
	$scope.appmode=[{},{tit:"货品",tolimg:["goods","outCur","offerCur"],tool:[[1,"出售"],[2,"求购"]],lab:[["数量","吨"],["单价","元/吨"]]},{tit:"配送",tolimg:["car","carCur","noCarCur"],tool:[[1,"找货"],[2,"找车"]],lab:[["数量","吨"],["单价","元/吨"]]},{tit:"仓库",tolimg:["rent","rentCur","noRentCur"],tool:[[1,"出租"],[2,"求租"]],lab:[["数/质/量",""],["单价",$scope.unit]]}];
	$scope.gocoldShareComment=function(){ $state.go('coldShareComment',{_cuttid: $scope.dataType});};
    $scope.initMode=function(){
    	$(".mode_hide").hide();
    	$(".mode_"+$scope.dataType).show();
    	$(".mode_"+$scope.dataType+"_"+ $scope.typeCode).show();
    	$("#txt_rdcID").attr("disabled",$scope.typeCode==2?true:false); 
    	$("#tool"+$scope.typeCode).addClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]);
    	if( $scope.rdcinfo==null||($scope.dataType==3&&$scope.typeCode==2)){$("#recinfo_div").hide();}else{$("#recinfo_div").show();}
    	if($scope.rdcinfo==null||($scope.typeCode==2&&$scope.dataType==3)){$("#sh_pct_div").show();}
    };
    $scope.changtype=function(_em){
    	   var em=$(_em); 
    	   if(em.attr("value")==1&&$scope.rdcinfo==null&&$scope.dataType ==3){ util.info(null,"请选择冷库！然后才能发布出租信息！！",function(){  $state.go('releaseItemList',{data:null,dataid:null,_cuttid: $scope.dataType}); });  return;}
  	       $("#item_type_div span").removeClass($scope.appmode[$scope.dataType].tolimg[$scope.typeCode]); 
	       $scope.typeCode=em.attr("value");
	       $scope.typeText=em.text();
	       $scope.initpriv();
	       $scope.initMode();
    };
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
		if(user!==null&&user.id!=0){
   	    if(!$("#release_item_from").valid()){ $($("#release_item_from input.error")[0]).focus(); return; } }else{ util.info(null,"你还没有登录！请登录后操作！",function(){ window.location.href =  "http://" + $location.host() + ":" + $location.port() + "/login.html#/releaseItemList";}); return; } 
		 $("#but_submit").text("保存中...");
		 $("#but_submit").data('isLoading', true);
		var data = {data:releaseItem.addvo(), "files":$scope.totalfiles};
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
    $scope.initpriv=function(){
    	  $scope.changcity = function(id) {$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.provinceId}  }).success(function(data) {
          	$scope.city = data;
          	if ($scope.rdcinfo) {$("#sl_cityid").val($scope.rdcinfo.cityid); }
          });};
          $http.get('/i/city/findProvinceList').success(function(data) {
           	   $scope.provinces = data;
           	   if ($scope.rdcinfo) {
                      $scope.provinceId = $scope.rdcinfo.provinceid; 
                	  $("#sl_provinceId").val($scope.rdcinfo.provinceid);
                	  $("#txt_provinceId").val($scope.rdcinfo.provinceid);
                 }else{
	           		  $scope.provinceId = data[0].provinceId;
	           		  $scope.provinceName = data[0].provinceName; 
                 }
           		$scope.changcity(); 
           });
    };
    $scope.initdata = function() {
        releaseItem.initvalidate();
        $scope.rdcinfo=$stateParams.data;
        $scope.dataType = $stateParams._cuttid?$stateParams._cuttid:1;//当前数据类型
        $scope.unit = $scope.dataType==3?"元/天·平方米":"元/吨";
        $scope.seltype=$stateParams.dataid!=null?$stateParams.dataid:1;//支持直接发布(0,1)
        if ($scope.rdcinfo) {$scope.rdcID = $scope.rdcinfo.rdcID;$scope.rdcimgs = $scope.rdcinfo.files; }
        $scope.typeCode=$scope.appmode[$scope.dataType].tool[$scope.seltype][0];
        $scope.typeText=$scope.appmode[$scope.dataType].tool[$scope.seltype][1];
        $scope.initMode();
        $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30,format: 'YYYY-MM-DD HH:mm'});
        $http.get('/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据
        $http.get('/i/ShareRdcController/getSEFilterData').success(function(data) {$scope.codeLave2 = data.entity.st;$scope.codeLave1 = data.entity.mt;}); 
        $scope.initpriv();
      
    };
    $scope.initdata();
});