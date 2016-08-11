coldWeb.controller('personalDetail', function ($rootScope, $scope, $state, $cookies, Upload, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data,status,config,headers){
			$rootScope.user = data;
			if($rootScope.user == undefined || $rootScope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    })
    }
    $scope.load();
    $scope.oldTele = $rootScope.user.telephone;
    $scope.verifycode = '';
    $scope.oldPwd = '';
    $scope.newPwd1 = '';
    $scope.newPwd2 = '';
    
    $scope.avatar = user.avatar;
    $scope.telephone = user.telephone;
    $scope.realname = user.realname;
    $scope.sex = user.sex;
    $scope.hometownid = user.hometownid;
    $scope.addressid = user.addressid;
    $scope.email =user.email;
    $scope.nickname = user.nickname;
    // 获取省列表
    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });
    
    function checkVerifyCode(){
    	if($scope.oldTele!=$rootScope.user.telephone){
    		$http.get('/i/user/checkVerifyCode', {
                params: {
                    verifycode: $scope.verifycode
                }
            }).success(function (data) {
            	return data;
            });
    	}
    	else
    		return true;
    }
    
    
    function checkOldPwd(){
    	if($scope.oldPwd==''&&$scope.newPwd1==''&&$scope.newPwd2=='')
    		return true;
    	else{
    		$http.get('/i/user/checkOldPwd', {
                params: {
                	oldPwd: $scope.oldPwd
                }
            }).success(function (data) {
            	return data;
            });
    	}
    		
    }
    
    


    $scope.goUpdateUser = function() {		
    	if (checkVerifyCode()) {
					if (checkOldPwd()) {
						data = {
							avatar : avatar,
							telephone : telephone,
							realname : realname,
							sex : sex,
							hometownid : hometownid,
							addressid : addressid,
							password : newPwd1,
							email : email,
							nickname : nickname
						};
						/*
						 * Upload.upload({ url : '/i/user/updateUser', headers : {
						 * 'Content-Transfer-Encoding' : 'utf-8' }, data : data
						 * }).then(function(resp) { alert("修改成功");
						 * $state.reload(); });
						 */
						
					        var formdata = new FormData();
				             formdata.append('fileData',$("input[type='file']")[0].files[0]);
					        $.each(data,function(index,item){
					          formdata.append(index, item);
					        });
					        $.ajax({
					          type: 'POST',
					            url: "/i/user/updateUser",
					            data: formdata,
					            processData: false,
					            contentType: false,
					            success: function(data){
					            	if(!data){alert("修改失败！请稍后重试！");}}});
					            }	
				else {
						alert("验证码输入错误!");
					}
				} else {
					alert("旧密码输入错误!");
				}
			};
		});
