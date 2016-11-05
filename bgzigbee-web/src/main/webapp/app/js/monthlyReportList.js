coldWeb.controller('monthlyReportList', function ($scope,$http) {
	$scope.rdcList = [];$scope.selected = [];
    $scope.maxSize = 10;  $scope.bigTotalItems = 10;  $scope.bigCurrentPage = 1;
    //==========================================================================初始化数据==========================================================
	$scope.initdata = function(){
	    $http({method:'POST',url:'/i/report/findDLRDCByFilter',params:{pageNum : $scope.bigCurrentPage,pageSize : $scope.maxSize,keyword:$scope.keyword}}).success(function (data) {
	    	 $scope.rdcList = data.list;
	    	 $scope.bigTotalItems = data.total;
	    });
	};
    $scope.initdata();
    //==========================================================================初始化事件==========================================================
    //全选、全不选
    $scope.exists = function (rdc, list) {return list.indexOf(rdc) > -1;};
    $scope.searchData=function($event){if($event.keyCode == 13){ $scope.initdata(); } };//回车监听
    $scope.isChecked = function() { return $scope.selected.length === $scope.rdcList.length; };
    $scope.toggle = function (rdc, list) {var idx = list.indexOf(rdc); if (idx > -1) {list.splice(idx, 1); } else { list.push(rdc);} };
    $scope.toggleAll = function() { if ($scope.selected.length === $scope.rdcList.length) {$scope.selected = [];} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {$scope.selected = $scope.rdcList.slice(0);}};
});