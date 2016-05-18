coldWeb.controller('review', function ($rootScope, $scope, $state, $cookies, $http,Upload) {
	$scope.files;
	
	$scope.max = 5;
	$scope.starsNum = 5;
	$scope.stars = [];
	$scope.ratingVal = [];
	for(i=0;i<$scope.starsNum;i++){
		$scope.stars[i] = [];
		$scope.ratingVal[i] = 0;
	}
	for(j=0;j<$scope.starsNum;j++){
		for(i=0;i<$scope.max;i++){
			$scope.stars[j].push({filled:false});
		}
	}
	$scope.click = function(i,val){
		$scope.ratingVal[i] = val;
		$scope.stars[i] = [];
		for (var j = 0; j < $scope.max; j++) {
	      $scope.stars[i].push({
	        filled: j < $scope.ratingVal[i]
          });
        }
	};
	$scope.over = function(i,val){
	  $scope.stars[i] = [];
	    for (var j = 0; j < $scope.max; j++) {
	      $scope.stars[i].push({
	        filled: j < val
	      });
	    }
	};
	$scope.leave = function(i){
	  $scope.stars[i] = [];
	    for (var i = 0; i < $scope.max; i++) {
          $scope.stars[i].push({
            filled: i < $scope.ratingVal[i]
          });
        }
	};
	
	$scope.uploadFiles = function (files) {
	      if (files && files.length) {
	        for (var i = 0; i < files.length; i++) {
	          Upload.upload({
	              url: 'upload/url',
	              data: {file: files[i]}
	          }).then(function (resp) {
	              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
	          }, function (resp) {
	              console.log('Error status: ' + resp.status);
	          }, function (evt) {
	              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	          });
	        }
	      }
	    }

	
	$scope.submit = function(){
		console.log($scope.file);
	}
})