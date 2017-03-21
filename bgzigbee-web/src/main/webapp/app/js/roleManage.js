coldWeb.controller('roleManage', function ($scope, $state, $cookies, $http, $location) {
	$scope.type=0,$scope.keyword=null;
//	$scope.urlmode=["/i/admin/findRdcDTOByPage","","","",];
	$scope.initData=function(){
				$http({method : 'POST',url : 'i/acl/getObjByType',params : {type : $scope.type,keyword : $scope.keyword}}).success(function(data) {
					$scope.objData = data;
			    	
				});
	};
	$scope.searchdata=function(){
		$scope.initData();
	};
	
	
	$scope.initData();
	
	
	
	$('.role_on_off').click(function(event) {				
		if($(this).parents(".filter").hasClass('current')){$(this).parents(".filter").removeClass('current');}else{$(this).parents(".filter").addClass('current');$(this).parents(".filter").siblings(".filter").removeClass('current');}
	});
	$('.role_on_off').siblings("label").children("input[type='checkbox']").click(function(event) {	
		if(this.checked){    
			$(this).parents(".oneFilter").siblings(".role_list").find(":checkbox").attr("checked", true);   
	    }else{    
	    	$(this).parents(".oneFilter").siblings(".role_list").find(":checkbox").attr("checked", false); 
	    } 
	});
	
});
