 var app = angular.module('app', []).controller('personal', function($http, $location,$scope) {
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.logout = function () {
			$http.get(ER.root+'/i/user/logout');
           	$scope.user=window.user  = null;
           	util.delCookie("token");
           	gohome();
     };
	$scope.initdata=function(){
		 $.ajax({cache: false,type: "POST",url:ER.root+"/i/user/findUser", success: function(data) {
			 $scope.$apply(function () {
            	 if(data.id!=0){ 
            		 $("#user_sex").val(data.sex);
            		 $scope.userinfo= data;
            	 }
		    });
		 } });
		 $http.get(ER.root+'/i/city/findProvinceList').success(function(data) {
         	   $scope.provinces = data;
         });
	};
	$scope.initevg=function(){
		$("#headImg").change(function() {
			util.setimg(this,'user_img');
			var value=$("input[type='file']")[0].files[0];
			$scope.savedata("fileData",value);
		});
		$("#user_sex").change(function() {
			if(this.name&&this.name!=''&&this.value&&this.value!=''){$scope.savedata(this.name,this.value);}
		});
		$("#sl_hometownid").change(function() {
			var value=this.value.split(":")[1];
		   if(this.name&&this.name!=''&&value&&value!=''){$scope.savedata(this.name,value);}
		});
		$("#sl_addressid").change(function() {
			var value=this.value.split(":")[1];
			if(this.name&&this.name!=''&&value&&value!='')$scope.savedata(this.name,value);
		});
	};
	$scope.savedata=function(name,value){
        var formdata = new FormData();
        formdata.append(name,value);
        formdata.append("id",$scope.userinfo.id);
        $.ajax({
        	type: 'POST',
            url: ER.root+"/i/user/updateUser",
            data: formdata,
            processData: false,
            contentType: false,
            success: function(data){if(!data){alert("修改失败咯，请稍后重试吧~");} }
          });
	};
	$scope.initdata();
	$scope.initevg();
});

	



