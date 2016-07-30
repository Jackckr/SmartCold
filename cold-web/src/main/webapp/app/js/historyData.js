coldWeb.controller('report', function ($scope, $location,$stateParams,$timeout,$http,$rootScope) {
	$scope.getDateTimeStringBefore = function(before){
		return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,'');
	}
	$http.get("/i/baseInfo/findAllStorageType").then(function(response){
		$scope.searchOptions = response.data;
		$scope.choseOption = $scope.searchOptions[0];
	})

	$scope.begin = $scope.getDateTimeStringBefore(3);
	$scope.end = $scope.getDateTimeStringBefore(0);
	$scope.picktime = $scope.begin + ' - ' + $scope.end;
	$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
	
});
