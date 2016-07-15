/**
 * 共享详情
 */
coldWeb.controller('shareriteminfo',function($rootScope, $scope, $stateParams, $state, $cookies, $http, $location) {
	$scope._dataid = $stateParams.dataid;//当前数据类型
    $scope.initdata = function() {
        
    	
    	
    	
        $scope.dataType = $stateParams._cuttid?$stateParams._cuttid:1;//当前数据类型
        if ($stateParams.data) {
        	$scope.rdcinfo = $stateParams.data;//选择冷库、货品、车的信息
        	$scope.rdcID = $stateParams.data.rdcID;
            $scope.rdcimgs = $stateParams.data.files;
            $scope.typeCode=$scope.appmode[$scope.dataType].tool[0][0];
            $scope.typeText=$scope.appmode[$scope.dataType].tool[0][1];
        } else{
        	$scope.typeCode=$scope.appmode[$scope.dataType].tool[1][0];
            $scope.typeText=$scope.appmode[$scope.dataType].tool[1][1];
//            $("#item_type_div span:last").addClass($scope.appmode[$scope.dataType].tolimg[2]);
//            $("#item_type_div span:first").removeClass($scope.appmode[$scope.dataType].tolimg[1]);
        }
        $scope.initMode();
        $http.get('/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据
        $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 30,format: 'YYYY-MM-DD HH:mm'});
        $http.get('/i/city/findProvinceList').success(function(data) {
        	$scope.provinces = data; 
        	$scope.provinceId = data[0].provinceId; 
        	$scope.provinceName = data[0].provinceName; 
        	$scope.changcity();
        }); //加载区域数据
        $scope.changcity = function(id) {
        	$http.get('/i/city/findCitysByProvinceId', { params: {"provinceID": $scope.provinceId}  }).success(function(data) {$scope.city = data;}); 
        };
    };

    $scope.initdata();
	
	
	
	
	
});