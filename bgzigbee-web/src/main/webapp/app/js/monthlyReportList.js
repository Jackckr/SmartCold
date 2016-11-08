coldWeb.controller('monthlyReportList', function ($scope,$http,$state) {
	$scope.rdcList = [];$scope.selected = [];$scope.type=null;
    $scope.maxSize = 10;  $scope.bigTotalItems = 10;  $scope.bigCurrentPage = 1;
    //==========================================================================初始化数据==========================================================
    $scope.goreport=function(item){ $state.go("monthReport",{rdcId: item.id,name:item.name}); };
    $scope.setype=function(type){ switch(type){case 0: return "DEV";break;case 1: return "PLC";break;default:return "PLC+DEV";break;} };
    $scope.initdata = function(){
	    $http({method:'POST',url:'/i/report/findDLRDCByFilter',params:{pageNum : $scope.bigCurrentPage,pageSize : $scope.maxSize,type:$scope.type,keyword:$scope.keyword}}).success(function (data) {
	    	angular.forEach(data.list,function(item,i){ data.type=$scope.setype(item.type); });$scope.rdcList = data.list;$scope.bigTotalItems = data.total;
	    });
	};
    $scope.initdata();
    
    //==========================================================================初始化事件==========================================================
    $scope.changeType=function(type){$scope.type=type==""?null:type; $scope.initdata();};//
    $scope.searchData=function($event){if($event.keyCode == 13){ $scope.initdata(); } };//回车监听
    //全选、全不选
    $scope.exists = function (rdc, list) {return list.indexOf(rdc) > -1;};
    $scope.isChecked = function() { return $scope.selected.length === $scope.rdcList.length; };
    $scope.toggle = function (rdc, list) {var idx = list.indexOf(rdc); if (idx > -1) {list.splice(idx, 1); } else { list.push(rdc);} };
    $scope.toggleAll = function() { if ($scope.selected.length === $scope.rdcList.length) {$scope.selected = [];} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {$scope.selected = $scope.rdcList.slice(0);}};
});