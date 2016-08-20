var app = angular.module('app', []).controller('register',function($http, $location, $scope) {
	$http.defaults.withCredentials = true;$http.defaults.headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
	var victdata={victtl:false,extname:false,victyzm:false,victpwd:false};
	$scope.vsphone = function(telephone) {// 验证手机号码
		var length = (telephone + '').length;
		var mobile = /^1[3|4|5|8][0-9]\d{4,8}$/;
		return telephone && length == 11&& mobile.test(telephone);
	};
	$scope.vertelephone = function() {// 验证手机号码
		var ct = $scope.vsphone($scope.telephone);
		if(ct){
			victdata.victtl=true;
			$.post( ER.root+"/i/user/existenceUserName", {userName: $scope.telephone}, function(data) {
                victdata.extname=!data;
                $("#mention1").html(data?"该手机已经注册!":"");
                $("#but_vercode").attr("disabled", data).css("background-color", data ?  "#cccccc":"#438BCB" );
			});//
		}else{
			 victdata.victtl=false;
			 $("#mention1").html("请输入正确手机号码！");
			 $("#but_vercode").attr("disabled", false).css("background-color",  "#cccccc");
		}
	};
	
	$scope.getVerCode = function() {
		setTime(document.getElementById("but_vercode"));
		$scope.getMobileCode('user_register', $scope.telephone,'#but_vercode');
	};
	$scope.getMobileCode = function(key, telephone, vcid) {//获取验证码
		$http.get(ER.root+ "/i/ShareRdcController/sharvistPhone.json",{params : {key : 'signUpCode',telephone : telephone}}).success(function(data) {
				if (data.success) {$scope.mtvarcode = data.entity;$(vcid).data('vc', true);}
				alert(data.message);
		});
	};
    $scope.veteleCode = function() {// 验证码
    	if ($("#but_vercode").data('vc') == true) {
    		victdata.victyzm= $scope.verrcode&& $scope.mtvarcode&& ($scope.mtvarcode.toLowerCase() == $scope.verrcode.toLowerCase());
    	} 
   };
   $scope.checkData=function (){ 
	     $("#mention1").html();
	      if(!victdata.victtl){ $("#mention1").html("请输入正确手机号码！");return false; }
	      if(!victdata.extname){ $("#mention1").html("该手机已经注册！");return false; }
	      if(!victdata.victyzm){ $("#mention1").html("验证码错误！请重新输入！");return false; }
  	       var password = $("#txt_password").val(); 
           var repsword = $("#txt_repsword").val(); 
           if (password.length!=0 && repsword.length!=0) {
        	   if(password.length<6){
        		   $("#mention1").html("密码长度不能小于6位！");
        		    return false;
        	   }
           	   if(password != repsword) {
		         $("#mention1").html("两次密码输入不一致，请重新输入");
		         return false;
		       }
		       else {
		    		$scope.savedata();
		       }
           } else{
        	 if(password.length==0){
        		 $("#txt_password").focus();
        	 }else if(repsword.length==0){
        		 $("#txt_repsword").focus();
        	 }
           	  $("#mention1").html("密码不能为空哦，请输入密码~");
           }
  	  };
   	$scope.savedata= function () {// 修改密码
		var me = "#btn_login"; if ($(me).data('isLoading') === true) return;$(me).text("提交中...");$("#mention2").html(""); //防止再次点击
        $.ajax({
        	type: 'POST',
        	data:{username:$("#telNum").val(),
				password:$("#txt_password").val(),
				password1:$("#txt_repsword").val(),
				telephone:$("#telNum").val(),
				signUpCode:$("#code2").val()
		},
            url: ER.root+"/i/user/signup?",
            complete : function(e){$(me).text("注册"); $(me).delay(500).data('isLoading',false);},
            success: function(data){
            	if(data.status==0){
            		alert(data.message);
            		window.location.href = "login.html";
            	}else{
            		$("#mention1").html(data.message);
            	} }
          });
        
        
	};
});
