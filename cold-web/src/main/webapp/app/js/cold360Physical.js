
/**
 * Created by maqiang34 on 16/10/18.
 * 360体检
 */
coldWeb.controller('base', function( $scope, $rootScope,baseTools ) {
	$(".mainHeight").height($(".content-wrapper").height()); 
	$scope.physicalday= window.localStorage.physicalday;
	if($scope.physicalday){
		var date1=new Date($scope.physicalday);    
		var date2=new Date();
		var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数  
		var days=Math.floor(date3/(86400000)) ; 
		if(days==0){$scope.msg='上次体检时间：'+baseTools.formatTimeToMinute( $scope.physicalday);}else if(days<2){$scope.msg='系统已经'+days+"未体检了,建议体检";}else {$scope.msg='系统已经很久未体检了,建议体检';}
	}else{
		$scope.msg='您的冷库还没有体检哦，建议立即体检！';
	}
//	alert($rootScope.rdcId );
//	window.localStorage.physicalday='';//获得上次体检时间。。。
	
});

coldWeb.controller('cold360PhysicalList', function( $scope, $rootScope ) {
	window.localStorage.physicalday=new Date();
//	alert($rootScope.rdcId );
//	window.localStorage.physicalday='';//获得上次体检时间。。。
	
});


