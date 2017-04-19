coldWeb.controller('maintainRequest', function ($rootScope, $scope, $state,$stateParams, $cookies, $http, $location,baseTools) {
	$scope.stmode=["未处理 ","待维修","维修中 ","已完成 ","已忽略"];//0:未处理 1：待处理  2:处理中 3已处理 4:已忽略
	$scope.warids=$stateParams.ids;
	$scope.note=undefined;$scope.cost=undefined;
    if(!$scope.warids){return;}
	 $http.get('/i/warningMint/getWarningMintById',{params: {ids: $scope.warids,rdcId:  $rootScope.rdcId}}).success(function(data,status,config,header){
		  $scope.wardata=data.warData;
		  $scope.company=data.company;
		  $scope.wuser=data.user;
  	});
	 
	$scope.submit=function(){
		var servertype="";
		var em_servertype=$("[name ='service']:checked");
		if(em_servertype.length>0){
			for(var i=0;i<em_servertype.length;i++){ 
				servertype += em_servertype[i].value +","; 
			} 
			servertype=servertype.substring(0,servertype.length-1);
		}
		 var vo ={
		    		waruser:JSON.stringify($scope.wuser),
		    		maintuser:JSON.stringify($rootScope.user),
		    		companyinfo:JSON.stringify( $scope.company),
		    		warMapper:JSON.stringify( $scope.wardata),
		    		mappid:$scope.warids,
		    		note:$scope.note,
		    		cost:$scope.cost,
		    		repairtime :"2017-4-18 16:10:07",
			        bookingtime:"2017-4-20 16:10:12",
			        servertype:servertype
		  };
	      $.ajax({type: 'POST',data: vo,url: "/i/warningMint/addMaintenance",success: function(data){
	               if(data){
	               }
	    	  
	    	  
	      }});
	};
	 
	 
    
});
