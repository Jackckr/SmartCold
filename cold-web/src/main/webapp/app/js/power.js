coldWeb.controller('power', function ($scope, $location,$stateParams) {
	$scope.load = function(){		
		$scope.powerid = $stateParams.powerid
	}
	
	$scope.load();
});