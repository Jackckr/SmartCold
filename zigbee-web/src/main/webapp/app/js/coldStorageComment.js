/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageComment', function ($rootScope, $scope, $cookies, $http, $location, $state, $stateParams, $uibModal, $log) {

    $scope.rdcId = $stateParams.rdcID;

    function findRDCByRDCId(rdcID) {
        // 获取当前冷库的详情
        $http.get('/i/rdc/findRDCByRDCId', {
            params: {
                "rdcID": rdcID
            }
        }).success(function (data) {
            console.log("RdcDetail: " + data[0]);
            $scope.rdcName = data[0].name;
            $scope.rdcAddress = data[0].address;
            if ($scope.score === undefined) {
                $scope.score = (Math.random() + 4).toFixed(1);
            }
            if ($scope.userRecommendPercent === undefined) {
                $scope.userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
            }
            if ($scope.userRecommendCount === undefined) {
                $scope.userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
            }
            if ($scope.rdcPositionScore === undefined) {
                $scope.rdcPositionScore = (Math.random() + 4).toFixed(1);
                $scope.rdcFacility = (Math.random() + 4).toFixed(1);
                $scope.rdcService = (Math.random() + 4).toFixed(1);
                $scope.rdcHealth = (Math.random() + 4).toFixed(1);
            }

            //$scope.temper();
        });
    }

    $scope.temper = function () {
            // 冷库实时温度,后续在做
            $http.get('/i/rdcPower/findByRdcId', {
                params: {
                    "rdcID": $scope.rdcId,
                    "npoint": 2
                }
            }).success(function (result) {
                console.log("powerCosume:" + result[0].powerCosume);
                var temper = parseFloat(result[0].powerCosume).toFixed(1);
                $scope.curtemper = temper;
            });
    }

    // 获取当前热度冷库的列表
    $http.get('/i/rdc/findRdcList').success(function (data) {
        var size = data.length;
        data.splice(5, size);
        console.log("data:" + data);
        $scope.lookrdcs = data;
        for (var i = 0; i < data.length; i++) {
            console.log("data:" + data[i].name + data[i].addtime);
        }
    });

    $rootScope.goColdStorageDetail = function (storageID) {
        $scope.rdcId = storageID;
        findRDCByRDCId(storageID);
        angular.element(document.getElementById('detail')).addClass('active');
        angular.element(document.getElementById('coldStorageDetail')).addClass('active');
        angular.element(document.getElementById('comment')).removeClass('active');
        angular.element(document.getElementById('coldStorageComment')).removeClass('active');
        console.log(storageID);
    }

    $scope.goColdStorageComment = function (storageID) {
        angular.element(document.getElementById('comment')).addClass('active');
        angular.element(document.getElementById('coldStorageComment')).addClass('active');
        angular.element(document.getElementById('detail')).removeClass('active');
        angular.element(document.getElementById('coldStorageDetail')).removeClass('active');

        console.log(storageID);
        // 获取当前冷库的评论列表
        $http.get('/i/comment/findCommentsByRDCId', {
            params: {
                "rdcID": storageID,
                "npoint": 5
            }
        }).success(function (data) {
            var size = data.length;
            data.splice(5, size);
            console.log("data:" + data);
            for (var i = 0; i < data.length; i++) {
                console.log("data:" + data[i].content + data[i].commerID + data[i].addTime + data[i].commerName);
                data[i].commentsum = parseInt((Math.random() * 5 + 5).toFixed(0));
                data[i].usefulCnt = parseInt((Math.random() * 10 + 5).toFixed(0));
            }
            angular.forEach(data,function(item){
            	item.piclocation = JSON.parse(item.piclocation);
            })
            $scope.comments = data;
        });
    }

    $scope.load = function () {
        $scope.goColdStorageDetail($stateParams.rdcID);

        // 获取当前冷库的详情
        $http.get('/i/rdc/findRDCByRDCId', {
            params: {
                "rdcID": $stateParams.rdcID
            }
        }).success(function (data) {
            console.log("RdcDetail: " + data[0]);
            $scope.rdcName = data[0].name;
            $scope.rdcAddress = data[0].address;
            var address = data[0].address;
            var name = data[0].name;

            //创建Map实例
            var map = new BMap.Map("mapChart");
            var point = new BMap.Point(104.114129, 37.550339);
            map.centerAndZoom(point, 5);
            //添加鼠标滚动缩放
            map.enableScrollWheelZoom();

            //添加缩略图控件
            map.addControl(new BMap.OverviewMapControl({isOpen: false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
            //map.addControl(new BMap.OverviewMapControl({isOpen: true})); //缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图
            //添加缩放平移控件
            map.addControl(new BMap.NavigationControl());
            //添加比例尺控件
            map.addControl(new BMap.ScaleControl());
            //添加地图类型控件
            map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));     //2D图，卫星图   //左上角， 地图类型控件

            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(address, function (point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    //map.addOverlay(new BMap.Marker(point));

                    //设置标注的经纬度
                    //设置标注的图标
                    icon = new BMap.Icon("../../assets/img/icon-orange.jpg", new BMap.Size(100, 100), {
                        anchor: new BMap.Size(9, 25),
                        infoWindowAnchor: new BMap.Size(10, 0)
                    });
                    var marker = new BMap.Marker(point, {icon: icon});
                    map.addOverlay(marker);

                    var content = "<table>";
                    content = content + "<tr><td> 名称：" + name + "</td></tr>";
                    content = content + "<tr><td> 地点：" + address + "</td></tr>";
                    content += "</table>";
                    var infowindow = new BMap.InfoWindow(content);
                    marker.addEventListener("onmouseover", function () {
                        this.openInfoWindow(infowindow);
                    });
                    marker.addEventListener("onmouseout", function () {
                        this.closeInfoWindow(infowindow);
                    });
                    marker.addEventListener("click", function () {
                        this.closeInfoWindow(infowindow);
                        alert("去查看冷库详情");
                        $scope.goColdStorageDetail($stateParams.rdcID);
                    });
                } else {
                    alert("您选择地址没有解析到结果!");
                }
            }, "");

        });

    }
    $scope.load();

    $scope.goDetail = function (rdcID) {
        console.log("rdcID" + rdcID);
        $state.go('coldStorageComment', {"rdcID": rdcID});
    }


    $scope.items = ['html5', 'jq', 'FE-演示平台'];
    $scope.goComment = function (size) {  //打开模态
    	$location.path("/coldStorage/" + $stateParams.rdcID + "/review");
//        var modalInstance = $uibModal.open({
//            templateUrl: 'myModelContent.html',  //指向上面创建的视图
//            controller: 'ModalInstanceCtrl',// 初始化模态范围
//            size: size, //大小配置
//            resolve: {
//                items: function () {
//                    return $scope.items;
//                }
//            }
//        })
//        modalInstance.result.then(function (selectedItem) {
//            $scope.selected = selectedItem;
//        }, function () {
//            $log.info('Modal dismissed at: ' + new Date())
//        })
    }

/*    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        $scope.temper();
    }, 30000);*/
});

coldWeb.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) { //依赖于modalInstance
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function () {
        console.log($scope.commentContent);
        $uibModalInstance.close($scope.commentContent); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel'); // 退出
    }
})