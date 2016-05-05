/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStoragelist', function ($rootScope, $scope, $state, $cookies, $http) {

    // 显示最大页数
    $scope.maxSize = 7;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 0;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.pageChanged = function () {
        var curPage = $scope.bigCurrentPage;
        var startItem = 0;
        var endItem = 0;
        var data = $scope.Allrdcs;
        // 不满10条,则一页
        if (($scope.bigTotalItems - (curPage - 1) * 10) <= 10) {
            startItem = (curPage - 1) * 10;
            endItem = $scope.bigTotalItems -1;
        } else {
            startItem = (curPage - 1) * 10;
            endItem = curPage * 10 -1;
        }
        var curtData = [];
        for (var i = startItem; i <=endItem; i++) {
            console.log("data:" + data[i].name + data[i].addtime);
            data[i].score = (Math.random() + 4).toFixed(1);
            data[i].userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
            data[i].userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
            console.log(data[i].score);
            curtData.push(data[i]);
        }
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.rdcs = curtData;
            });
        }, 1);
    }

    $scope.Allrdcs = "";

    // 获取当前冷库的列表
    $http.get('/i/rdc/findRdcList').success(function (data) {
        var size = data.length;
        $scope.Allrdcs = data;
        $scope.bigTotalItems = size;
        var firstData = [];
        //firstData.splice(10, size);
        for (var i = 0; i < 10; i++) {
            console.log("data:" + data[i].name + data[i].addtime);
            data[i].score = (Math.random() + 4).toFixed(1);
            data[i].userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
            data[i].userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
            console.log(data[i].score);
            firstData.push(data[i]);
        }
        $scope.rdcs = firstData;
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