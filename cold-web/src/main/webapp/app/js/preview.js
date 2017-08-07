/**
 * preview:系统总预览
 * Created by maqiang34 on 17/8/7.
 */
coldWeb.controller('preview', function($scope, $location, $stateParams, $http,$rootScope, baseTools) {
       $scope.endTime= new Date().getTime(),  $scope.startTime = new Date(endTime - 30 * 60 * 1000);
	    $scope.load = function () {

	    	
	    	
	    	
	    	
	    };

	   
	    /**
	     *
	     */
	    $scope.refdata=function(){
	    	
	       
	    };
	  
	    clearInterval($rootScope.timeTicket);
	    $rootScope.timeTicket = setInterval(function () { $scope.refdata(); }, 30000);
	    $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });

	
	

});


