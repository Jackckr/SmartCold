
/**
 * Created by maqiang34 on 16/10/18.
 * 360体检
 */
coldWeb.controller('base', function( $scope, $rootScope,$http,baseTools ) {
	//初始化页面
	$scope.oldid=1;
	$scope.cwheight=$(".content-wrapper").height();
	$(".mainHeight").height($scope.cwheight); 
	$scope.physicalday= window.localStorage.physicalday;
	if($scope.physicalday){
		var date1=new Date($scope.physicalday); var date2=new Date(); var date3=date2.getTime()-date1.getTime();  var days=Math.floor(date3/(86400000)) ; 
		if(days==0){$scope.msg='上次体检时间：'+baseTools.formatTimeToMinute( $scope.physicalday);}else if(days<2){$scope.msg='系统已经'+days+"未体检了,建议体检";}else {$scope.msg='系统已经很久未体检了,建议体检';}
	}else{
		$scope.msg='您的冷库还没有体检哦，建议立即体检！';
	}
	//体检
	$scope.physical=function(){
		$http.get('/i/physicalController/checkup',{params: {"rdcId":$rootScope.rdcId } }).success(function(data,status,config,header){
		
			
		 });
//		$scope.showpage(2);
	};
	
	$scope.showpage=function(i){
		$("#physicalstep1,#physicalstep2,#physicalstep3").hide();
		$("#physicalstep"+i).show();
//		$("#physicalstep"+$scope.oldid).animate({  top:"-200px" });
	};
	
});

coldWeb.controller('cold360PhysicalList', function( $scope, $rootScope ) {
	
});


