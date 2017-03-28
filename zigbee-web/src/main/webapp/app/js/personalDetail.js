coldWeb.controller('personalDetail', function ($scope, $state, $cookies, Upload, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data,status,config,headers){
			//$scope.$apply(function () {
			 $scope.user = data;
			if($scope.user == undefined || $scope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    });
		//});
	        $scope.oldTele = $scope.user.telephone;
		    $scope.verifycode = '';
		    $scope.oldPwd = '';
		    $scope.newPwd1 = '';
		    $scope.newPwd2 = '';
		    $scope.avatar = $scope.user.avatar;
		    $scope.telephone ="";
		    $scope.realname = $scope.user.realname;
		    $scope.sex = $scope.user.sex;
		    $scope.hometownid = $scope.user.hometownid;
		    $scope.addressid = $scope.user.addressid;
		    $scope.email =$scope.user.email;
		    $scope.nickname = $scope.user.nickname;
		    if($scope.email=="undefined")
		    	$scope.email = "";
		    if($scope.oldTele=="undefined")
		    	$scope.oldTele = "";
		    if($scope.realname=="undefined")
		    	$scope.realname = "";
		    if($scope.nickname=="undefined")
		    	$scope.nickname = "";
		    if($scope.telephone=="undefined")
		    	$scope.telephone = "";
    }
    $scope.load();
   
   
    function vsphone(telephone) {// 验证手机号码
		var length = (telephone + '').length;
		var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
		return telephone && length == 11&& mobile.test(telephone);
	};
    
	
	

    // 获取省列表
    $http.get('/i/city/findProvinceList').success(function (data) { $scope.provinces = data;});
	$scope.setimg = function(em, imgid) {
        var oFile = $(em)[0].files[0];
        /* var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
        var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
        if (!rFilter.test(oFile.type)) {
            alert("格式错误~请选择格式为" + msg + "的图片~");
            return;
        }*/
    		var _file=oFile.name;
    		var i=_file.lastIndexOf('.');
    		var len=_file.length;
    		var extEndName=_file.substring(i+1, len);
    		var extName="GIF,BMP,JPG,JPEG,PNG";
        	//首先对格式进行验证
        	if(extName.indexOf(extEndName.toUpperCase())==-1) {
        		alert("只能上传"+extName+"格式的文件");
        		return false
        	}else if(oFile.size > 10485760){
        		alert("最大只能上传10M的图片");
        		return false
        	}
	        var oImage = document.getElementById(imgid);
	        var oReader = new FileReader();
	        oReader.onload = function(e) {
	            oImage.src = e.target.result;
	        };
	        oReader.readAsDataURL(oFile);
      
    };

  
    $("#headImg").change(function() {$scope.setimg(this,'showimg');});
    $scope.verifycode_err=$scope.opwd_err=false;
    
    /**
     * 修改手机号码
     */
    $scope.sendverifCode=function(){
    	$("#yzm").css("display", "inline");
    	var em=$("#authcode2");
    	var isok=vsphone($scope.telephone);
    	if(isok){
    		if($scope.telephone==$scope.oldTele){
    		    alert("请输入新的手机号~");
    		}else{
    			$.post('/i/user/identityVerify', {telephone :$scope.telephone}, function(data) {
    				em.attr('disabled', 'disabled');
    				$("#input_newTel").attr('disabled', 'disabled');
    				alert(data.message);
    			});
    		}
    	}else{
    		alert("请正确输入新的手机号码~");
    	}
    };
    
    
    $scope.uptelephone=function(){
    	$scope.telephone="";
    	$("#tele2").css("display", "block");
    	$("#input_newTel").attr('disabled', false);
    };
    
	/**
	 *  校验手机号码是否合法
	 */
	$scope.cktelephone=function(){
		    if($scope.telephone.length=11&&vsphone($scope.telephone)){
			if($scope.telephone==$scope.oldTele){$("#authcode2").attr('disabled', "disabled");alert("请输入有效的手机号码~");return;}
			var ckuserName=	vsphone($scope.user.username);//判断用户名是否为手机号
		    if(ckuserName){//
				    $.post('/i/user/userNameVerify', {username : $scope.telephone}, function(data) {//true 表示可用
	    				if(data){
	    					$("#authcode2").attr('disabled', false);
	    				}else{
	    					alert("该手机已经注册！请更换手机号重试~");
	    					$("#authcode2").attr('disabled', "disabled");
	    				}
	    			});
			 }else{
				 $("#authcode2").attr('disabled', false);
			 }
		}else{
			$("#authcode2").attr('disabled', "disabled");
		}
	};
	
    /**
     *更新用户信息
     *同步执行（禁止异步操作）
     */
	$scope.pwd = function() {
		var password = $scope.newPwd1.trim();
		if(password.length>=6){
			if (/^(\d)\1+$/.test(password)){
				$("#pwdError").html("密码太过简单了~");
				return false;
			}/*else{
				$("#pwdError").html("");
			}*/
		}
	}
	$scope.goUpdateUser = function() {
		var ckvcd=ckpwd=true;
		//校验用户名 ，验证码
		if($scope.oldTele != $scope.telephone&&$scope.telephone!=""){
				if($scope.telephone==$scope.oldTele){alert("请输入有效的手机号码~");return;}
				var ckuserName=	vsphone($scope.user.username);//判断用户名是否为手机号
			    if(ckuserName){$.post('/i/user/userNameVerify', {username : $scope.telephone}, function(data) {	if(!data){alert("该手机已经注册！请更换手机号重试！");return;}}); }
			    $.ajax({ type : "POST", url : '/i/user/checkVerifyCode', data:{verifycode : $scope.verifycode},cache : false, async : false, success : function (result){  ckvcd =result;$scope.verifycode_err=!ckvcd;
			    if(!result){return false;}
			     } }); 
		}
	
	
		if($scope.oldPwd.trim() != '' && $scope.newPwd1.trim() != ''&& $scope.newPwd2.trim() != ''){
			if($scope.newPwd1.trim().length<6){
				$("#pwdError").html("密码长度最少6位~");return;
			}
			if(16<$scope.newPwd1.trim().length){
				$("#pwdError").html("密码最多16位~");return;
			}
			if($scope.newPwd1.trim() ==  $scope.newPwd2.trim() ){
				$.ajax({ type : "POST", url : '/i/user/checkOldPassword', data:{pwd : $scope.oldPwd.trim()}, cache : false, async : false, success : function (result){ ckpwd =result; $scope.opwd_err=!result;	if(!result){return false;}}});
			}else{
				return;
			}
		}else {
			if($scope.oldPwd.trim() == '' && $scope.newPwd1.trim() == ''&& $scope.newPwd2.trim() == ''){
				//这里不写代码的原因是防止不修改密码情况下无法提交
			}else {
				alert("请输入有效密码~");return;
			}
			
		}
		if(!flag_email){
			alert("请输入正确的电子邮件地址~");
			return false
		}
			if(ckvcd&&ckpwd){
				if($scope.hometownid==undefined)
					$scope.hometownid =  '';
				if($scope.addressid==undefined)
					$scope.addressid =  '';
				data = {
					avatar : $scope.avatar,
					telephone : $scope.telephone,
					realname : $scope.realname,
					sex : $scope.sex,
					hometownid : $scope.hometownid,
					addressid : $scope.addressid,
					password : $scope.newPwd1.trim(),
					email : $scope.email,
					nickname : $scope.nickname
				};
				if($scope.oldTele != $scope.telephone&&$scope.telephone!=""&&vsphone($scope.user.username)){
					data.username=$scope.telephone;
				}
				var formdata = new FormData();
				formdata.append('fileData',$("input[type='file']")[0].files[0]);
				$.each(data, function(index, item) {formdata.append(index, item);});
				$.ajax({
					type : 'POST',
					url : "/i/user/updateUser",
					data : formdata,
					processData : false,
					contentType : false,
					success : function(data) {
						alert("保存成功");
						//$state.reload(); 
						window.location.reload();
					}
				});
			}		
		};
});
var flag_email = true
function isEmail(strEmail) {
	if (strEmail.search(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) != -1){
		flag_email = true ;
		return true;
	}else{
		flag_email = false;
		alert("请输入正确的电子邮件地址~");
	}
}