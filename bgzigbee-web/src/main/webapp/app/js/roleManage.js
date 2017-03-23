coldWeb.controller('roleManage', function ($scope, $state, $cookies, $http, $location) {
	$scope.mode=[[{name:"RDC",value:"0"},{name:"user",value:"1"},{name:"role",value:"2"},{name:"Group",value:"3"}],["RDC名称","用户名","角色名称","组名称",""]];
	$scope.type=$scope.mode[0][0].value,$scope.keyword=null;
	
	
	$scope.initData=function(){
			$http({method : 'POST',url : 'i/acl/getObjByType',params : {type : $scope.type,keyword : $scope.keyword}}).success(function(data) {
				$scope.objData = data;
			});
			$http({method : 'POST',url : 'i/acl/getObjByType',params : {type : $scope.type,keyword : $scope.keyword}}).success(function(data) {
				$scope.objData = data;
			});
	};
	
	
	/**
	 * 
	 */
	$scope.changenaclMode=function(){	
		
		
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
