/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageAdd', function ($rootScope, $scope, $state, $cookies, $http) {

    // 获取省列表
    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;

        $scope.provinceId = data[0].cityID;
    });

    // 根据省ID查询城市列表
    $scope.provinceSelected = function(){
        $http.get('/i/city/findCitysByProvinceId', {
            params: {
                "provinceID":  $scope.provinceId
            }
        }).success(function (data) {
            $scope.citys = data;
            $scope.cityId = data[0].cityID;
        });
    }

    $scope.citySelected = function(){
        alert($scope.cityId);
    }

    // 获取冷库经营类型

    // 获取商品存放类型

    // 获取冷库温度类型


    $scope.moreInfos = true;
    // 检查输入的参数

    $scope.addMore = function(){
        $scope.moreInfos = !$scope.moreInfos;
    }

    // 获取冷链设施类型

    // 制冷剂类型

});