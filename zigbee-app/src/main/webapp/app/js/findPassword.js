var app = angular.module('app', []).controller('findPassword',function($http, $location, $scope) {
	$http.defaults.withCredentials = true;$http.defaults.headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
	$scope.vsphone = function(telephone) {// 验证手机号码
		var length = (telephone + '').length;
		var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;
		return telephone && length == 11&& mobile.test(telephone);
	};
	$scope.vertelephone = function() {// 验证手机号码
		var ct = $scope.vsphone($scope.telephone);
		$("#but_vercode").attr("disabled", !ct).css("background-color", ct ? "#438BCB" : "#cccccc");
	};
	var tel = util.getCookie("username");if ($scope.vsphone(tel)) {$("#telNum").val(tel);}
	$scope.getVerCode = function() {
		setTime(document.getElementById("but_vercode"));
		$scope.getMobileCode('user_findwpd', $scope.telephone,'#but_vercode');
	};
	$scope.getMobileCode = function(key, telephone, vcid) {//获取样子吗
		$http.get(ER.root+ "/i/ShareRdcController/sharvistPhone.json",{params : {key : 'user_findwpd',telephone : telephone}}).success(function(data) {
				if (data.success) {$scope.mtvarcode = data.entity;$(vcid).data('vc', true);}
				alert(data.message);
		});
	};
    $scope.veteleCode = function() {// 验证码
	 if ($("#but_vercode").data('vc') == true) {
		var ct = $scope.verrcode&& $scope.mtvarcode&& ($scope.mtvarcode.toLowerCase() == $scope.verrcode.toLowerCase());
		$("#app_but1").attr("disabled", !ct);
		if (ct) {$("#app_but1").removeClass("gray");} else {$("#app_but1").addClass("gray");}
	} else {
		$http.get(ER.root+ "/i/ShareRdcController/sharvistCode",{params : {key : 'user_findwpd',telephone : $scope.userinfo.telephone,yzm : $scope.verrcode}}).success(function(data) {
			if (data) {
				$("#app_but1").attr("disabled", false);
				$("#app_but1").removeClass("gray");
			} else {
				$("#app_but1").attr("disabled", true);$("#app_but1").addClass("gray");
			}
		});
	}
   };
	$scope.savedata = function() {// 修改密码
		$.ajax({
			url : ER.root + "/i/user/updateUser",
			type : 'POST',
			data : $('#datafrom').serialize(),
			success : function(data) {
				if (data) {
					tourl("personal.html");
				} else {
					alert("修改失败！请稍后重试！");
				}
			}
		});
	};
	$scope.initevg = function() {
		$("#app_but1").click(function() {
			$("#stup1").hide();
			$("#stup2").show();
	//		$("#stup2").html('<section class="nopad"><div class="editarea clearfix"><span class="fl">新密码</span><p class="input bd"><input type="password" id="txt_password" placeholder="新密码"/></p><span class="fl">再次输入</span><p class="input"><input type="password" id="txt_repsword" placeholder="再次输入"/></p></div><div class="row"><div class="col-xs-8"><a style="color:red;font-size:0.7rem;" hidden=true id="mention"></a></div></div></section><button class="mybtn" onclick ="savedata();">确定</button>');
		});
		
	};
	$scope.initevg();
});
