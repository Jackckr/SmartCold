/**
 * Created by xuyanan on 16/5/19.
 */
coldWeb.controller('warn', function($scope, $location, $stateParams, $http) {
	console.log($stateParams.rdcId);
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage : 1,
		itemsPerPage : 15,
		pagesLength : 15,
		perPageOptions : [ 10, 20, 30, 40, 50 ],
		rememberPerPage : 'perPageItems',
		onChange : function() {

		}
	}
	$scope.load = function() {
		$http.get(
				'/i/warn/findLastNWarningsInfoByRdcId?rdcId='
						+ $stateParams.rdcId + "&point=100").success(
				function(result) {
					$scope.warningsInfo = result;
					/*
					 * for (var i = 0; i < $scope.warningsInfo.length; i++) {
					 * console.log("id:" + $scope.warningsInfo[i].id + "
					 * warningName:" +$scope.warningsInfo[i].warningName +"
					 * addtime:" + $scope.warningsInfo[i].addtime); }
					 */
				});
	}
	$scope.load();
	/*
	 * var timeTicket; timeTicket = setInterval(function () { $scope.load(); },
	 * 30000);
	 */
});
