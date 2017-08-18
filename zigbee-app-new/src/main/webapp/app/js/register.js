angular.module('myapp', []).controller('oregister',function($http, $location, $scope) {
	$http.defaults.withCredentials = true;$http.defaults.headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
	var victdata={victtl:false,extname:false,victyzm:false,victpwd:false,tel:null,usefulName:false};
    localStorage.goIndex=1;
	$scope.vsphone = function(telephone) {// 验证手机号码
		var length = (telephone + '').length;
		var mobile = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
		return telephone && length == 11&& mobile.test(telephone);
	};
	$("#username").blur(function () {
        $.post(ER.root + '/i/user/userNameVerify',{
            username:$("#username").val()
        }, function(data){
            if(!data){
                layer.open({
                    content: "用户名已存在,请更换~"
                    ,btn: '确定'
                });
                victdata.extname=false;
                return false
            }else{
                if(!/^[a-zA-Z0-9][a-zA-Z0-9]{2,23}$/.test($("#username").val())){
                    layer.open({
                        content: "用户名不能包含中文和特殊字符，长度3~24位~"
                        ,btn: '确定'
                    });
                    victdata.usefulName=true;
                    return false
                }else{
                    victdata.extname=true;
				}
			}
        });
    });
   /* $scope.usefulName = function () {
        $http.post(ER.root+ "/i/user/userNameVerify",
            {username : $scope.username}).success(function(data) {
            if(!data){
                layer.open({
                    content: "用户名已存在,请更换~"
                    ,btn: '确定'
                });
                victdata.extname=false;
                return false
            }else{
                if(!/^[a-zA-Z0-9][a-zA-Z0-9]{2,23}$/.test($("#username").val())){
                    layer.open({
                        content: "用户名不能包含中文和特殊字符，长度3~24位~"
                        ,btn: '确定'
                    });
                    victdata.usefulName=true;
                    return false
                }else{
                    victdata.extname=true;
                }
            }
        });
    };*/
	$scope.vertelephone = function() {// 验证手机号码
		$("#code2").val('');$("#but_vercode").data('vc', false);
		var ct = $scope.vsphone($scope.telephone);
		if($scope.telephone.length==11){
		    $http.get(ER.root+"/i/user/checkTelephone",{params:{telephone:$scope.telephone}}).success(function (data) {
                if(!data){
                    victdata.victtl=false;
                    $("#mention1").html("该手机号已被注册~");
                    $("#but_vercode").attr("disabled", true).css("background-color",  "#cccccc");
                    return;
                }
            });
        }
         if(ct){
			victdata.victtl=true;
            $("#mention1").html('');
            $("#but_vercode").attr("disabled", false).css("background-color",  "#4287ff");
		}else{
			 victdata.victtl=false;
			 $("#mention1").html("请输入正确手机号码~");
			 $("#but_vercode").attr("disabled", true).css("background-color",  "#cccccc");
		}
	};

	$scope.getVerCode = function() {
		if(victdata.extname){//发验证码之前先检查用户名是否可用
            $scope.getMobileCode('user_register', $scope.telephone,'#but_vercode');
            $("#but_vercode").attr("disabled", true).css("background-color",  "#cccccc");
            $("#telNum").attr('readonly','readonly');
            $("#username").attr('readonly','readonly');
		}else{
			if(victdata.usefulName){
                layer.open({
                    content: "用户名不能包含中文和特殊字符，长度不得低于3位~"
                    ,btn: '确定'
                });
			}else{
                layer.open({
                    content: "用户名已存在,请更换~"
                    ,btn: '确定'
                });
			}
		}

	};
	$scope.getMobileCode = function(key, telephone, vcid) {//获取验证码
		$http.get(ER.root+ "/i/ShareRdcController/sharvistPhone.json",{params : {key : 'signUpCode',telephone : telephone}}).success(function(data) {
			if (data.success) {$scope.mtvarcode = data.entity;$(vcid).data('vc', true);}
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
       }else if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,15}$/.test(password)){
           if(password != repsword){
               $("#mention1").html("两次密码输入不一致，请重新输入");
               $('#app_but1').attr("disabled",true);
               return false;
           }else{
               $("#mention1").html("");
               $('#app_but1').attr("disabled",false);
           }
	   }else{
           $("#mention1").html("密码长度6-16位,必须是数字字母组合");
           $('#app_but1').attr("disabled",true);
	   }
   }
   $scope.checkData=function (){
	      $("#mention1").html();
	      if(!victdata.victtl){ $("#mention1").html("请输入正确手机号码~");return false; }
	      if(!victdata.victyzm){ $("#mention1").html("验证码错误~请重新输入~");return false; }
	      $scope.savedata();

  };
    $scope.ischeck=true;
    $scope.savedata = function () {// 修改密码
        if ($scope.ischeck == false) {
            alert("请确认您已同意冷库360使用协议~");
            return
        }
        $("#mention2").html(""); //防止再次点击
        $('#app_but1').attr("disabled", true);
        $.ajax({
            type: 'POST',
            data: {
                username: $("#username").val().trim(),
                password: $("#txt_password").val().trim(),
                password1: $("#txt_repsword").val().trim(),
                telephone: $("#telNum").val().trim(),
                signUpCode: $("#code2").val().trim()
            },
            url: ER.root + "/i/user/signup?",
            success: function (data) {
                if (data.status == "0") {
                    layer.open({
                        content: data.message
                        , btn: '确定'
                        , yes: function () {
                            window.location.href = "login.html";
                        }
                    });
                } else {
                    $("#mention1").html(data.message);
                }
            }
        });
    };
});
