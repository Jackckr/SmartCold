 var app = angular.module('app', []);
 app.controller('storehousedetail', function($http, $location,$scope) {
   var key="order", id  = getUrlParam("id");
    $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.appmode=[{title:["","货品详情","配送详情","仓位详情"]},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}];
     $scope.oUnit=['吨','Kg','吨'];
     localStorage.oURL=document.URL;
    $scope.initdata=function(){
		$http.get(ER.root+"/i/ShareRdcController/getSEByID.json",  { params: {id:id}  }).success(function(data) { //获得数据
			if(data.success&&data.entity!=undefined){ 
				if(data.entity.unit!=undefined){
					
					if(data.entity.unit.length<4){ 
						if(data.entity.dataType==3){
							data.entity.picunit="元/天·"+data.entity.unit;
						}else{
							data.entity.picunit="元/"+data.entity.unit;
						}
					}else{ 
						data.entity.picunit=data.entity.unit;
						data.entity.unit=data.entity.picunit.substr(4);
					}
				}
				$scope.vo=data.entity;
				if($scope.vo.typeCode ==1){
                    $http.get(ER.root+"/i/city/findProvinceById",{params:{provinceId:$scope.vo.provinceid}}).success(function (data) {
                        $scope.provinceName="["+data.provinceName;
                    });
                    $http.get(ER.root+"/i/city/findCityById",{params:{CityID:$scope.vo.cityid}}).success(function (data) {
                    	if(data&&data.cityName!=""){
                            $scope.cityName="-"+data.cityName+"]";
						}else {
                            $scope.cityName="]";
						}
                    });
				}
				$scope.price="元/㎡/天";
				if($scope.vo.unit1&&$scope.vo.unit2&&$scope.vo.unit1!=""&&$scope.vo.unit2!=""){
					$scope.price="元/"+$scope.vo.unit1+"/"+$scope.vo.unit2;
				}
				$scope.datatype=data.entity.dataType;
              }
        });
	};
     // 手机号加密
     $scope.telMd5 = function (tel) {
         if (tel) {
             if (tel.length == 11) {// 手机号
                 tel = tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
             } else {// 座机
                 tel = tel.slice(0, tel.length - 4).concat('****');
             }
         } else {
             tel = '187****2361';// 手机号没有时默认值
         }
         return tel;
     }
	$scope.getVerCode=function(){
		var length = ($scope.telephone+'').length; 
		var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
		var ct=$scope.telephone&&length == 11 && mobile.test($scope.telephone);
		if(!ct){/*alert("请输入正确的手机号码哟~");*/layer.open({content: '请输入正确的手机号码哟~',btn: '确定'});return;}//需要手机验证
		setTime(document.getElementById("but_vercode"));
		$http.get(ER.root+"/i/ShareRdcController/sharvistPhone.json",  { params: {key:key,dataid:id,telephone: $scope.telephone}  }).success(function(data) {
			if(data.success){
				$scope.mtvarcode=data.entity;//
				$("#but_vercode").data('vc', true);
			}
			//alert(data.message);
			layer.open({content: data.message,btn: '确定'});
		});
	};
	$scope.vertelephone=function(){//验证手机号码
		var length = ($scope.telephone+'').length; 
		var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
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

     $scope.checkUserLogin = function () {
         if(window.user!=null&&window.user!=undefined){
             return true
         }else{
         	localStorage.oURL=document.URL;
             return false
         };
     };
     $scope.goWhere = function () {
		 if($scope.checkUserLogin()){
		 	if(localStorage.gowhere){
                goback();
			}else{
                checkLocal();
                if($scope.datatype==3){//1:出租/2:求租
                    if($scope.vo.typeCode==1){
                        location.href='rentstorage.html'
                    }else{
                        location.href='lookstorage.html'
                    }
                }else if($scope.datatype==1){//1:出售/2:求购
                    if($scope.vo.typeCode==1){
                        location.href='salegoodslist.html'
                    }else{
                        location.href='buygoodslist.html'
                    }
                }
			}

		 }else{
		 	goback();
		 }
     };
     $scope.rentDate=['','1个月以下','1~3个月','3~6个月','6~9个月','1年以上','两年以上','三年以上','五年以上'];
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
			    				  getmsg();
			    				  window.location.href ='orderdetail.html?id='+data.entity.orders.id;
			    			  }
			    			  else{
			    				  window.location.href ='fail.html';
			    			  }
			    	   }
			    	  }); 
			    	}else{/*alert("请留下手机号之后再下单")*/layer.open({content: '请完善您的联系方式！',btn: '确定'});}}else{checkLogin("请登陆之后再抢单");}
	    	
    } ; 
	$scope.initdata();
	 /*详情页轮播*/
     function slideFn() {
         $dragBln = false;
         $(".main_image").touchSlider({
             flexible: true,
             speed: 200,
             paging: $(".flicking_con a"),
             counter: function (e) {
                 $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
             }
         });
         $(".main_image").bind("mousedown", function () {
             $dragBln = false;
         });

         $(".main_image").bind("dragstart", function () {
             $dragBln = true;
         });

         $(".main_image a").click(function () {
             if ($dragBln) {
                 return false;
             }
         });
     }
	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) { baguetteBox.run('.baguetteBoxOne', {buttons:true});imgBoxHide();slideFn();});
	$('body').show();
});
 app.directive('onFinishRenderFilters', function ($timeout) { return { restrict: 'A', link: function(scope, element, attr) {   $timeout(function() { scope.$emit('ngRepeatFinished');  },100); } };});