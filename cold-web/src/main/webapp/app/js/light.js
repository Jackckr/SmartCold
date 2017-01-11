/**
 * Created by xuyanan on 16/4/25.
 */
coldWeb.controller('light', function($stateParams, $scope, $http, $sce) {
	
    console.log($stateParams.storageID);
    
	$scope.load = function() {
		if ($stateParams.storageID) {

			$scope.storageID = $stateParams.storageID;				
			var url = "lightDiv.html?storageID="+ $scope.storageID;
			$scope.trustSrc = $sce.trustAsResourceUrl(url);
			}
        }
	
	$scope.load();
});