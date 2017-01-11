/**
 * Created by sunqiunian on 16/2/26.
 */
coldWeb.controller('coldStorageMap', function ($scope, $location, $stateParams, $http) {

    // 获取当前冷库的列表
    $http.get('/i/rdc/findRdcList').success(function (data) {
        var size = data.length;
        data.splice(10, size);
        for (var i = 0; i < data.length; i++) {
            console.log("data:" + data[i].name + data[i].addtime);
        }
        $scope.rdcs = data;

        //创建Map实例
        var map = new BMap.Map("mapChart");
        var point = new BMap.Point(104.114129, 37.550339);
        map.centerAndZoom(point, 5);
        //添加鼠标滚动缩放
        map.enableScrollWheelZoom();

        //添加缩略图控件
        map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
        //map.addControl(new BMap.OverviewMapControl({isOpen: true})); //缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图
        //添加缩放平移控件
        map.addControl(new BMap.NavigationControl());
        //添加比例尺控件
        map.addControl(new BMap.ScaleControl());
        //添加地图类型控件
        //map.addControl(new BMap.MapTypeControl());
        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));     //2D图，卫星图   //左上角， 地图类型控件

        for (var i = 0; i < data.length; i++) {
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            var name = data[i].name;
            var address = data[i].address;
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(data[i].address, function (point) {
                if (point) {
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
                    });
                } else {
                    //alert("您选择地址没有解析到结果!");
                }
            }, "");
        }
    });


    /* $scope.load = function () {
     //创建Map实例
     var map = new BMap.Map("mapChart");
     var point = new BMap.Point(104.114129, 37.550339);
     map.centerAndZoom(point, 5);
     //添加鼠标滚动缩放
     map.enableScrollWheelZoom();

     //添加缩略图控件
     //map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
     map.addControl(new BMap.OverviewMapControl({isOpen: true})); //缩略地图控件，默认位于地图右下方，是一个可折叠的缩略地图
     //添加缩放平移控件
     map.addControl(new BMap.NavigationControl());
     //添加比例尺控件
     map.addControl(new BMap.ScaleControl());
     //添加地图类型控件
     //map.addControl(new BMap.MapTypeControl());
     map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));     //2D图，卫星图   //左上角， 地图类型控件

     for (var i = 10; i > 0; i--) {
     var x = 80 + Math.random() * 40;
     var y = Math.random() * 20 + 20;
     var markPoint = new BMap.Point(x, y);
     var icon;
     if (y > 30) {
     //设置标注的图标
     icon = new BMap.Icon("../../assets/img/icon-orange.jpg", new BMap.Size(100, 100), {
     anchor: new BMap.Size(9, 25),
     infoWindowAnchor: new BMap.Size(10, 0)
     });
     } else {
     //设置标注的图标
     icon = new BMap.Icon("../../assets/img/icon-green.jpg", new BMap.Size(100, 100), {
     anchor: new BMap.Size(9, 25),
     infoWindowAnchor: new BMap.Size(10, 0)
     });
     }

     //设置标注的经纬度
     var marker = new BMap.Marker(markPoint, {icon: icon});
     //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
     //把标注添加到地图上
     map.addOverlay(marker);
     var content = "<table>";
     content = content + "<tr><td> 名称：浦东冷库</td></tr>";
     content = content + "<tr><td> 地点：上海市浦东新区</td></tr>";
     content = content + "<tr><td> 温度：-15℃</td></tr>";
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
     });
     }

     //点击地图，获取经纬度坐标
     //map.addEventListener("click", function (e) {
     //    document.getElementById("aa").innerHTML = "经度坐标：" + e.point.lng + " &nbsp;纬度坐标：" + e.point.lat;
     //});

     //关键字搜索
     $scope.search = function () {
     var keyword = $("#keyword").get(0).value;
     var local = new BMap.LocalSearch(map, {
     renderOptions: {map: map}
     });
     local.search(keyword);
     }

     }
     $scope.load();*/
});
