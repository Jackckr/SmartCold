coldWeb.controller('lightGroup', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.colors=['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4','#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']; 
	$scope.inintData=function(){//初始化冷库门
		   $scope.isshow=true;
		   if($rootScope.mystorages!=undefined){
			   watch();
			   $http.get('i/lightGroupController/findByRdcId', {params: {rdcId:$rootScope.rdcId}} ).success(function(data, status, headers, config) {   
				   if(data.length>0){
					      $scope.isshow=false;
					      angular.forEach($rootScope.mystorages,function(item){ 
							   var lightGroups=[];
							   angular.forEach(data,function(obj){  if(obj.coldStorageId==item.id){ 
								   if(obj.id==81||obj.id==83||obj.id==85||obj.id==87||obj.id==88){
                                       obj.isRunning=1;
                                    }
								   lightGroups.push(obj);
								   
							   } }); 
							   item.lightGroups=lightGroups;
						   }); 
					      
					      $scope.coldlightGroups=[];
					      angular.forEach($rootScope.mystorages,function(item){ 
							  if(item.lightGroups.length>0){ $scope.coldlightGroups.push(item);} 
						   }); 
				   }
				   
			   });
		   }
	 };

	  clearInterval($scope.timeTicket);
	  $scope.timeTicket = setInterval(function () { $scope.inintData(); }, 30000);
	  $scope.$on('$destroy',function(){ clearInterval($scope.timeTicket);  });
	  var watch =$scope.$watch('mystorages', $scope.inintData,true);//监听冷库变化
    //$("#oview").height($(".content-wrapper")[0].clientHeight);
});

function closeFn(em) { $(em).parents('.previewModel').remove(); }