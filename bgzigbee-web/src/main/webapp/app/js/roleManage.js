coldWeb.controller('roleManage', function ($scope, $state, $cookies, $http, $location) {
	$('.role_on_off').click(function(event) {				
		if($(this).parents(".filter").hasClass('current')){
			$(this).parents(".filter").removeClass('current');
		}else{
			$(this).parents(".filter").addClass('current');
			$(this).parents(".filter").siblings(".filter").removeClass('current');
		}
	});
	$('.role_on_off').siblings("label").children("input[type='checkbox']").click(function(event) {	
		if(this.checked){    
			$(this).parents(".oneFilter").siblings(".role_list").find(":checkbox").attr("checked", true);   
	    }else{    
	    	$(this).parents(".oneFilter").siblings(".role_list").find(":checkbox").attr("checked", false); 
	    } 
	});
});
