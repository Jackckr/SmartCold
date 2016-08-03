 var app = angular.module('app', []);
 app.controller('colddetail', function($http, $location,$scope) {
    var id  = getUrlParam("id");//当前rdc-id数据信息
	$scope.datatype=1;
    $scope.appmode=[{},{lab:[["数量","吨"],["单价","元/吨"]]},{lab:[["数量","吨"],["单价",""]]},{lab:[["数/质/量",""],["单价","元/吨","元/平方米"]]}]; 
    $scope.gosharedile=function(sharid){
   	 window.location.href ="storehousedetail.html?id="+sharid; 
     };
	$scope.initdata=function(){
       //获得数据
    	$http.get(ER.root+'/i/rdc/findRDCByID', { params: {"rdcID": id} }).success(function(data) {
    		if(data.success){$scope.vo=data.data[0]; }else{alert(data.message); }
    	}); 
        $http.get(ER.root + "/i/ShareRdcController/getSEGDList", {params: {pageNum:1,pageSize:2,rdcID:id,datatype:1}}).success(function( data) {//货品共享
			$scope.goodList = data.data;//
			$scope.gdtotal = data.total;//
		});
		$http.get(ER.root + "/i/ShareRdcController/getSEPSList", {params: {pageNum:1,pageSize:2,rdcID:id,datatype:2}}).success(function(data) {//配送共享
			$scope.pslist = data.data;//
			$scope.pstotal = data.total;//
		});
		$http.get(ER.root + "/i/ShareRdcController/getSERDCList", {params: {pageNum:1,pageSize:2,rdcID:id,datatype:3}}).success(function(data) {//冷库共享
			$scope.rdcList = data.data;//
			$scope.rdctotal = data.total;//
		});
		$http.get(ER.root + "/i/comment/findCommentsByRDCId", {params: {npoint:20,rdcID:id}}).success(function(data) {//评价信息--npoint：记录条数
			$scope.evaList = data;//
		});
	};
	$scope.initevg=function(){
		
	};
	$scope.initdata();
	$scope.initevg();
});

	



