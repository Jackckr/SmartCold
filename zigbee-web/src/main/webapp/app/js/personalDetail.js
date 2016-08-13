coldWeb.controller('personalDetail', function ($scope, $scope, $state, $cookies, Upload, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data,status,config,headers){
			//$scope.$apply(function () {
			 $scope.user = data;
			if($scope.user == undefined || $scope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    })
		//});
	        $scope.oldTele = $scope.user.telephone;
		    $scope.verifycode = '';
		    $scope.oldPwd = '';
		    $scope.newPwd1 = '';
		    $scope.newPwd2 = '';
		    
		    $scope.avatar = $scope.user.avatar;
		    $scope.telephone = $scope.user.telephone;
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
   
    // 获取省列表
    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });
    var verifyCodeflag = true;
	var OldPwdflag = false;
	
	$scope.setimg = function(em, imgid) {
        var oFile = $(em)[0].files[0];
        var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
        var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
        if (!rFilter.test(oFile.type)) {
            alert("格式错误~请选择格式为" + msg + "的图片~");
            return;
        }
        var oImage = document.getElementById(imgid);
        var oReader = new FileReader();
        oReader.onload = function(e) {
            oImage.src = e.target.result;
        };
        oReader.readAsDataURL(oFile);
      
    };

    $("#headImg").change(function() {
    	$scope.setimg(this,'showimg');
        });
	$scope.goUpdateUser = function() {
					$http.get('/i/user/checkVerifyCode', {
						params : {
							verifycode : $scope.verifycode
						}
					}).success(function(res1) {
						if ($scope.oldTele != $scope.telephone) 
						    verifyCodeflag = res1;
						$http.get('/i/user/checkOldPassword', {
							params : {
								pwd : $scope.oldPwd
							}
						}).success(function(res2) {
							if ($scope.oldPwd == '' && $scope.newPwd1 == ''
								&& $scope.newPwd2 == '')
							OldPwdflag = true;
							else
								OldPwdflag = res2;
							if (verifyCodeflag) {
									if (OldPwdflag){ 
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
											password : $scope.newPwd1,
											email : $scope.email,
											nickname : $scope.nickname
										};
										var formdata = new FormData();
										formdata.append('fileData',
												$("input[type='file']")[0].files[0]);
										$.each(data, function(index, item) {
											formdata.append(index, item);
										});
										$.ajax({
											type : 'POST',
											url : "/i/user/updateUser",
											data : formdata,
											processData : false,
											contentType : false,
											success : function(data) {
												//alert("删除成功");
												//$state.reload(); 
												window.location.reload();
											}
										});
									
									 
									}else {
										alert("旧密码输入错误!");
									}
								} else {
									alert("验证码输入错误!");
								}
						});
					});
				
				
			
			};
		});
