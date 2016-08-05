 var app = angular.module('app', []);
 app.controller('storehousedetail', function($http, $location,$scope) {
    var id  = getUrlParam("id");
    $scope.appmode=[{},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}]; 
	$scope.initdata=function(){
       //获得数据
		$http.get(ER.root+"/i/ShareRdcController/getSEByID.json",  { params: {id:id}  }).success(function(data) {
			if(data.success){
				   $scope.vo=data.entity; 
		    	   $scope.datatype=data.entity.dataType;
			}
       });
	};
	$scope.initevg=function(){
		$("#she_imglist li a").imgbox({'speedIn': 0,'speedOut'	: 0,'alignment'		: 'center','overlayShow'	: true,'allowMultiple'	: false});//图片
	};
	$scope.initdata();
	$scope.initevg();
});

	



