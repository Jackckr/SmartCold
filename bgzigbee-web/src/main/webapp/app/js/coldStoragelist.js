/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStoragelist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.rdcs = [];
	$scope.initTable = function(pageNum,pageSize){
		    $http({method:'POST',url:'/i/rdc/findRdcDTOList',params:{pageNum : pageNum,pageSize : pageSize}}).success(function (data) {
		    	 $scope.bigTotalItems = data.total;
			      $scope.rdcs = data.data;
		    });
	}
    // 显示最大页数
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.pageChanged = function () {
    	 $scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    }
    $scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    // 获取当前冷库的列表
   

    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });

    
    $scope.selected = [];
    $scope.toggle = function (rdc, list) {
		  var idx = list.indexOf(rdc);
		  if (idx > -1) {
		    list.splice(idx, 1);
		  }
		  else {
		    list.push(rdc);
		  }
    };
    $scope.exists = function (rdc, list) {
    	return list.indexOf(rdc) > -1;
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.rdcs.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.rdcs.length) {
        	$scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        	$scope.selected = $scope.rdcs.slice(0);
        }
    };


    $scope.goRdcMap = function () {
        $state.go('coldStorageMap', {});
    }

    $scope.goSearch = function () {
        var content = $scope.query;
        // 获取当前冷库的列表
        $http.get('/i/rdc/findRdcList').success(function (data) {
            var result = [];
            var size = data.length;
            if (size >= 0) {
                for (var i = 0; i < size; i++) {
                    if ((data[i].name).indexOf(content) > -1) {
                        result.push(data[i]);
                    }
                }
            }
            $scope.Allrdcs = result;
            $scope.bigTotalItems = result.length;
            var firstData = [];
            var minSize = Math.min(result.length, 10);
            for (var i = 0; i < minSize; i++) {
                console.log("result:" + result[i].name + result[i].addtime);
                result[i].score = (Math.random() + 4).toFixed(1);
                result[i].userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
                result[i].userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
                console.log(result[i].score);
                firstData.push(result[i]);
            }
            $scope.rdcs = firstData;
        });
        $scope.query = "";
    }


    $scope.goEditRdc = function (rdcID) {
        $state.go('coldStorageEdit', {"rdcID": rdcID});
    }
    
    $scope.goAddRdc = function () {
        $http.get('/i/user/findUser').success(function(data){
            $rootScope.user = data;
            if($rootScope.user == null || $rootScope.user.id == 0){
                url = "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageAdd";
                window.location.href = url;
            } else {
                $location.path("/coldStorageAdd");
            }
        })
    }
});