 var app = angular.module('app', []);
  app.controller('homecontroller', function( $scope, $http) {
	$scope.province=null;
	$scope.initdata=function(){
       $http.get(ER.root+'/i/city/findProvinceList').success(function(data) {   $scope.province=data; });//初始化 城市
	};
	$scope.initevg=function(){
		 $("#city").click(function (e) {
			SelCity(this,e,$scope.province);
			$("#city").siblings('i').html('&#xe62e;');
		});
	};
	$scope.initdata();
	$scope.initevg();
});


	



