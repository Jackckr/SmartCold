 var app = angular.module('app', ['ngFileUpload']).controller('personal', function($http, $location,$scope, Upload) {
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 $scope.logout = function () {
			$http.get(ER.root+'/i/user/logout');
           	$scope.user=window.user  = null;gohome();
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
		$("#headImg").change(function() {util.setimg(this,'user_img');
		var input = $("input[type='file']");
        var formdata = new FormData();
        $.each(input,function(index,item){
            formdata.append('fileData['+index+']',item.files[0]);
        });
        var parnArray = $("#form1").serializeArray();
        var vo ={};
        $.each(parnArray,function(index,item){
            vo[item.name] = item.value;
        });
        formdata.append("user",vo);//$('#form1').serialize()
        $.ajax({
        	type: 'POST',
            url: ER.root+"/i/user/updateUser",
            data: formdata,
            processData: false,
            contentType: false,
//            contentType: "application/json; charset=utf-8",        
            success: function(data){ }
          });
		});
	};
	$scope.initdata();
	$scope.initevg();
});

	



