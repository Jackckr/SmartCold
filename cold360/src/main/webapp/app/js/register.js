var app = angular.module('app', []).controller('register',function($http, $location, $scope) {
	$http.defaults.withCredentials = true;$http.defaults.headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
	var victdata={victtl:false,extname:false,victyzm:false,victpwd:false,tel:null};
	$scope.vsphone = function(telephone) {// 验证手机号码
		var length = (telephone + '').length;
//		var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
		var mobile = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
		return telephone && length == 11&& mobile.test(telephone);
	};
	$scope.vertelephone = function() {// 验证手机号码
		$("#code2").val('');$("#but_vercode").data('vc', false);_sysconfig.countdown =0;
		var ct = $scope.vsphone($scope.telephone);
		if(ct){
			victdata.victtl=true;
			$.post( ER.root+"/i/user/existenceUserName", {userName: $scope.telephone}, function(data) {
                victdata.extname=!data;
                $("#mention1").html(data?"该手机已经注册~":"");
                $("#but_vercode").attr("disabled", data).css("background-color", data ?  "#cccccc":"#438BCB" );
			});//
		}else{
			 victdata.victtl=false;
			 $("#mention1").html("请输入正确手机号码~");
			 $("#but_vercode").attr("disabled", true).css("background-color",  "#cccccc");
		}
	};
	
	$scope.getVerCode = function() {
		setTime(document.getElementById("but_vercode"));
		$scope.getMobileCode('user_register', $scope.telephone,'#but_vercode');
	};
	$scope.getMobileCode = function(key, telephone, vcid) {//获取验证码
		$http.get(ER.root+ "/i/ShareRdcController/sharvistPhone.json",{params : {key : 'signUpCode',telephone : telephone}}).success(function(data) {
				if (data.success) {$scope.mtvarcode = data.entity;$(vcid).data('vc', true);}
				//alert(data.message);
				layer.open({
				    content: data.message
				    ,btn: '确定'
				  });
		});
	};
    $scope.veteleCode = function() {// 验证码
    	if ($("#but_vercode").data('vc') == true) {
    		victdata.victyzm= $scope.verrcode&& $scope.mtvarcode&& ($scope.mtvarcode.toLowerCase() == $scope.verrcode.toLowerCase());
    	} 
   };
   $scope.checkpwd=function(){
	   var password = $("#txt_password").val().trim(); 
       var repsword = $("#txt_repsword").val().trim();
       if(password == ''){
           $("#mention1").html("密码不能为空");
           $('#app_but1').attr("disabled",true);
           return false;
       }else if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)){
           if(password != repsword){
               $("#mention1").html("两次密码输入不一致，请重新输入");
               $('#app_but1').attr("disabled",true);
               return false;
           }else{
               $("#mention1").html("");
               $('#app_but1').attr("disabled",false);
           }
       }else{
           $("#mention1").html("密码长度6-12位,必须是数字字母组合");
           $('#app_but1').attr("disabled",true);
       }
   }
   $scope.checkData=function (){ 
	      $("#mention1").html();
	      if(!victdata.victtl){ $("#mention1").html("请输入正确手机号码~");return false; }
	      if(!victdata.extname){ $("#mention1").html("该手机已经注册~");return false; }
	      if(!victdata.victyzm){ $("#mention1").html("验证码错误~请重新输入~");return false; }
	      $scope.savedata();
  	      
  	  };
   	$scope.savedata= function () {// 修改密码
        if($('#agreement').is(':checked')==false){
            alert("请确认您已同意冷库360使用协议~");
            return
        }
		var me = "#btn_login"; if ($(me).data('isLoading') === true) return;$(me).text("提交中...");$("#mention2").html(""); //防止再次点击
        $('#app_but1').attr("disabled",true);
		$.ajax({
        	type: 'POST',
        	data:{username:$("#telNum").val().trim(),
				password:$("#txt_password").val().trim(),
				password1:$("#txt_repsword").val().trim(),
				telephone:$("#telNum").val().trim(),
				type:$("input[name='usertype']:checked").val(),
				signUpCode:$("#code2").val().trim()
		},
            url: ER.root+"/i/user/signup?",
            complete : function(e){$(me).text("注册"); $(me).delay(500).data('isLoading',false);},
            success: function(data){
            	if(data.status=="0"){
            		//alert(data.message);
            		layer.open({
    				    content: data.message
    				    ,btn: '确定'
    				  });
            		window.location.href = "../index.html";
            	}else{
            		$("#mention1").html(data.message);
            	} }
          });
        
        
	};
});
