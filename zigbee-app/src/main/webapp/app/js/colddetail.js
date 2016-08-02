 var app = angular.module('app', []);
 app.controller('colddetail', function($http, $location,$scope) {
    var id  = getUrlParam("id");//当前数据信息
    var rdcID  = getUrlParam("rdcID");//主库信息
	$scope.datatype=1;
    $scope.appmode=[{},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}]; 
	$scope.initdata=function(){
       //获得数据
    	$http.get(ER.root+'/i/ShareRdcController/getSEByID', { params: {"id": id} }).success(function(data) {
    		 $scope.vo=data.entity;
    		 $scope.datatype=data.entity.dataType;
    	}); 
	};
	$scope.initevg=function(){
		
	};
	$scope.initdata();
	$scope.initevg();
});

	



