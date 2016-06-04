/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageMap', function ($rootScope, $scope, $state, $cookies, $http, $location) {

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


    $scope.goDetail = function (rdcID) {
        console.log("rdcID" + rdcID);
        $state.go('coldStorageComment', {"rdcID": rdcID});
    }

    $http.get('/i/rdc/findRdcList').success(function (data) {
        var size = data.length;
        console.log("size: " + size);

        // 百度地图API功能
        var map = new BMap.Map("rdcMapChart");
        var point = new BMap.Point(104.114129, 34.550339);
        map.centerAndZoom(point, 5);
        //添加鼠标滚动缩放
        map.enableScrollWheelZoom();

        //添加缩略图控件
        map.addControl(new BMap.OverviewMapControl({isOpen: true})); //缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图
        //添加缩放平移控件
        map.addControl(new BMap.NavigationControl());
        //添加比例尺控件
        map.addControl(new BMap.ScaleControl());
        //添加地图类型控件
        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));     //2D图，卫星图   //左上角， 地图类型控件

        var index = 0;
        var myGeo = new BMap.Geocoder();
        var adds = [];
        for (var i = 0; i < data.length; i++) {
            adds.push({
                id: data[i].id,
                name: data[i].name,
                address: data[i].address
            });
            bdGEO();
        }

        function bdGEO() {
            var add = adds[index];
            geocodeSearch(add);
            index++;
        }

        function geocodeSearch(add) {
            myGeo.getPoint(add.address, function (point) {
                if (point) {
                    var address = new BMap.Point(point.lng, point.lat);
                    //设置标注的图标
                    /*           icon = new BMap.Icon("../../assets/img/icon-orange.jpg", new BMap.Size(100, 100), {
                     anchor: new BMap.Size(9, 25),
                     infoWindowAnchor: new BMap.Size(10, 0)
                     });
                     var marker = new BMap.Marker(address, {icon: icon});*/
                    var marker = new BMap.Marker(address, "");
                    map.addOverlay(marker);

                    var content = "<table>";
                    content = content + "<tr><td> 名称：" + add.name + "</td></tr>";
                    content = content + "<tr><td> 地点：" + add.address + "</td></tr>";
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
                        $state.go('coldStorageComment', {"rdcID": add.id});
                    });
                }
            }, "");
        }
    });


    $scope.goRdcList = function () {
        $state.go('coldStoragelist', {});
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

    $scope.goAddRdc = function () {
        $location.path("/coldStorageAdd");
    }
});