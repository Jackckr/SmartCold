var app = angular.module('mapp', []);
  app.controller('homecontroller', function( $scope, $http) {
	  $scope.province=null;
//	  $scope.shrdcList=null;
    $http.get(ER.root+'i/city/findProvinceList').success(function(data) {  $scope.province=data; });//初始化 城市
    $http.get(ER.root+'i/ShareRdcController/getSERDCList', { params: {datatype:3,pageSize:5}  }).success(function(data) { $scope.shrdcList=data.data; });//初始化发布信息-ur l274
	$scope.initevg=function(){
		 $("#city").click(function (e) {
			SelCity(this,e,$scope.province);
			$("#city").siblings('i').html('&#xe62e;');
		});
	};
    $scope.gosharedile=function(sharid){window.location.href ="view/storehousedetail.html?id="+sharid; };
});

	



