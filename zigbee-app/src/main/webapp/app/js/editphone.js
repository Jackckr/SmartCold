 var app = angular.module('app', []);
 app.controller('usercl', function($http, $location,$scope) {
	$http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	$scope.initdata=function(){
       $scope.userinfo= window.user;
	};
	$scope.initevg=function(){
		$('.edit1').click(function(){
   			$(".show").hide();
   			$(".show1").show();
   		});
   		$('.edit2').click(function(){
   			countdown=0;
   			if ($("#code1").val().length != 0) {   				
	   			$(".show1").hide();
	   			$(".show2").show();
   			} else{
   				//alert('验证码不能为空,请输入验证码~');
   				layer.open({
   				    content: '验证码不能为空,请输入验证码~'
   				    ,btn: '确定'
   				  });
   			}
   		});
	};
	$scope.initdata();
	$scope.initevg();
	
	$scope.getVerCode=function(){
		setTime(document.getElementById("but_vercode"));
		$scope.getMobileCode('user_upphone',$scope.userinfo.telephone,'#but_vercode');
	};
	$scope.getVerCode2=function(){
		setTime(document.getElementById("but_vercode2"));
		//alert(11)
		$scope.getMobileCode('user_upphone',$("#telNum").val(),'#but_vercode2');
	};
	$scope.vertelephone=function(){//验证手机号码
		var length = ($scope.telephone+'').length; 
		var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
		var ct=$scope.telephone&&length == 11 && mobile.test($scope.telephone);
		$("#but_vercode2").attr("disabled",!ct).css("background-color",ct?"#438BCB":"#cccccc");
	};
	$scope.getMobileCode=function(key,telephone,vcid){
		$http.get(ER.root+"/i/ShareRdcController/sharvistPhone.json",  { params: {key:key,telephone:telephone}  }).success(function(data) {
			if(data.success){
				$scope.mtvarcode=data.entity;//
				$(vcid).data('vc', true);
			}
			//alert(data.message);
			 layer.open({
			    content: data.message
			    ,btn: '确定'
			  });
		});
	};
	$scope.veteleCode=function(){//验证码
		if($("#but_vercode").data('vc')==true){
			var ct=$scope.verrcode&&$scope.mtvarcode&&($scope.mtvarcode.toLowerCase() ==$scope.verrcode.toLowerCase());
			$("#ver_code_but").attr("disabled",!ct);
			if(ct){$("#ver_code_but").removeClass("gray");}else{$("#ver_code_but").addClass("gray");}
		}else{
			$http.get(ER.root+"/i/ShareRdcController/sharvistCode",  { params: {key:'user_upphone',telephone:$scope.userinfo.telephone, yzm:$scope.verrcode}  }).success(function(data) {
				if(data){
					$("#ver_code_but").attr("disabled",false);
					$("#ver_code_but").removeClass("gray");
				}else{
					$("#ver_code_but").attr("disabled",true);
					$("#ver_code_but").addClass("gray");
				}
	        });
		}
	};
	$scope.veteleCode2=function(){//验证码
		if($("#but_vercode2").data('vc')==true){
			var ct=$scope.verrcode1&&$scope.mtvarcode&&($scope.mtvarcode.toLowerCase() ==$scope.verrcode1.toLowerCase());
			$("#app_but").attr("disabled",!ct);
			if(ct){$("#app_but").removeClass("gray");}else{$("#app_but").addClass("gray");}
		}
	};
	$scope.savedata=function(){//验证码
		$.ajax({ url: ER.root+"/i/user/updateUser",type: 'POST',data: $('#datafrom').serialize(),success: function(data) { 
			if(data){
				window.user = data;window.localStorage.lkuser=JSON.stringify(data);
				tourl("personal.html");
			}else{layer.open({content:'修改失败了，请稍后重试吧',btn: '确定'});}
		}
    });
	};
	
});

	



