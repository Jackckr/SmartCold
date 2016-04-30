/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStoragelist', function ($rootScope, $scope, $state, $cookies, $http) {

    // 获取当前冷库的列表
    $http.get('/i/rdc/findRdcList').success(function (data) {
        var size = data.length;
        data.splice(10, size);
        for (var i = 0; i < data.length; i++) {
            console.log("data:" + data[i].name + data[i].addtime);
            data[i].score = (Math.random() + 4).toFixed(1);
            data[i].userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
            data[i].userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
            console.log(data[i].score);
        }
        $scope.rdcs = data;
    });

    // 获取当前热度冷库的列表
    $http.get('/i/rdc/findRdcList').success(function (data) {
        var size = data.length;
        data.splice(6, size);
        $scope.hotrdcs = data;
        for (var i = 0; i < data.length; i++) {
            console.log("data:" + data[i].name + data[i].addtime);
        }
    });

    $scope.goDetail = function (rdcID) {
        console.log("rdcID" + rdcID);
        $state.go('coldStorageComment', {"rdcID": rdcID});
    }
});