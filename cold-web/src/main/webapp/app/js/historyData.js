coldWeb.controller('historyData', function ($scope, $http,$rootScope) {
	$scope.getDateTimeStringBefore = function(before){
		return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,'');
	}
	console.log($rootScope.vm);
	$http.get("/i/historySearch/findAllStorageKeys",{
		params:{
			'rdcId':$rootScope.vm.choserdc.id
		}
	}).success(function(response){
		$scope.searchOptions = response;
		$scope.selectedOption = $scope.searchOptions[0];
	})

	$scope.begin = $scope.getDateTimeStringBefore(3);
	$scope.end = $scope.getDateTimeStringBefore(0);
	$scope.picktime = $scope.begin + ' - ' + $scope.end;
	$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
	
	
	$scope.search = function(){
		var selected = $scope.selectedOption;
		if(selected){
			console.log(selected.keyDesc);
			bothTime = $scope.picktime.split(" - ");
			$scope.begin = bothTime[0];
			$scope.end = bothTime[1];
			$http.get("i/baseInfo/getKeyValueDataByTime",{
				params:{
					type:selected.type,
					oid:selected.oid,
					key:selected.key,
					startTime:$scope.begin,
					endTime:$scope.end  
				}
			}).then(function(response){
				
			})
		}
	}
});
