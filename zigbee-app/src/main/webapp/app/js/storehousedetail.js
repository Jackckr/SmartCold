 var app = angular.module('app', []);
 app.controller('storehousedetail', function($http, $location,$scope) {
   var key="order", id  = getUrlParam("id");
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.appmode=[{title:["","货品详情","配送详情","冷库详情"]},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}]; 
	$scope.initdata=function(){
		$http.get(ER.root+"/i/ShareRdcController/getSEByID.json",  { params: {id:id}  }).success(function(data) { //获得数据
			if(data.success){ $scope.vo=data.entity; $scope.datatype=data.entity.dataType;}
        });
		 $http.get(ER.root + "/i/user/findUser", {params: {token:util.getCookie('token')}}).success(function(data) {  
			  if (data && data.id != 0) {  window.user = data; }  
		 });
	};
	$scope.initevg=function(){ 
		$("#she_imglist li a").imgbox({'speedIn': 0,'speedOut'	: 0,'alignment'		: 'center','overlayShow'	: true,'allowMultiple'	: false});//图片
	};
	$scope.getVerCode=function(){
		var length = ($scope.telephone+'').length; 
		var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;
		var ct=$scope.telephone&&length == 11 && mobile.test($scope.telephone);
		if(!ct){alert("请输入正确的手机号码哟~");return;}//需要手机验证
		setTime(document.getElementById("but_vercode"));
		$http.get(ER.root+"/i/ShareRdcController/sharvistPhone.json",  { params: {key:key,dataid:id,telephone: $scope.telephone}  }).success(function(data) {
			if(data.success){
				$scope.mtvarcode=data.entity;//
				$("#but_vercode").data('vc', true);
			}
			alert(data.message);
		});
	};
	$scope.vertelephone=function(){//验证手机号码
		var length = ($scope.telephone+'').length; 
		var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;
		var ct=$scope.telephone&&length == 11 && mobile.test($scope.telephone);
		$("#but_vercode").attr("disabled",!ct);
		if(ct){$("#but_vercode").removeClass("gray");}else{$("#but_vercode").addClass("gray");}
	};
	$scope.veteleCode=function(){//验证码
		if($("#but_vercode").data('vc')==true){
			var ct=$scope.verrcode&&$scope.mtvarcode&&($scope.mtvarcode.toLowerCase() ==$scope.verrcode.toLowerCase());
			$("#app_order").attr("disabled",!ct);
			if(ct){$("#app_order").removeClass("gray");}else{$("#app_order").addClass("gray");}
		}else{
			$http.get(ER.root+"/i/ShareRdcController/sharvistCode",  { params: {key:key, dataid:id, telephone:$scope.telephone, yzm:$scope.verrcode}  }).success(function(data) {
				if(data){
					$("#app_order").attr("disabled",false);
					$("#app_order").removeClass("gray");
				}
	        });
		}
		
	};
	 $scope.getOrder=function () {  
			if(window.user!=undefined&&window.user.id!=0){
	    		if(user.telephone!=''&&user.telephone!=undefined){
			    	  $.ajax({ url: ER.root +"/i/orders/generateOrder", data: {
			    		  userid:window.user.id,
			    		  username:window.user.username,
			    		  telephone:window.user.telephone,
			    		  address:window.user.address,
			    		  rsdid: $scope.vo.id,
			    		  dataType:$scope.vo.dataType,
			    		  typeText:$scope.vo.typeText,
			    		  releaseID:$scope.vo.releaseID,
			    		  title:$scope.vo.title
			    		  }, type: 'POST',dataType:"json", success: function(data) {
			    			  if(data.success){
			    				  window.location.href ='orderdetail.html?id='+data.entity.orders.id;
			    			  }
			    			  else{
			    				  window.location.href ='fail.html';
			    			  }
			    	   }
			    	  }); 
			    	}else{alert("请留下手机号之后再下单");}}else{checkLogin("登陆之后才可以抢单");}
	    	
    } ; 
	$scope.initdata();
	$scope.initevg();
	$('body').show();
});