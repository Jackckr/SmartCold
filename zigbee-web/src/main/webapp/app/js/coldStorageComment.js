/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageComment', function ($rootScope, $scope, $cookies, $http, $location, $state) {

    $scope.goColdStorageDetail = function (storageID) {
        document.getElementById('detail').setAttribute("class", "active");
        document.getElementById('coldStorageDetail').setAttribute("class", "tab-pane active");
        document.getElementById('comment').removeAttribute("class");
        document.getElementById('coldStorageComment').removeAttribute("class");
        document.getElementById('coldStorageComment').setAttribute("class", "tab-pane");
        console.log(storageID);
    }
    $scope.goColdStorageComment = function (storageID) {
        document.getElementById('comment').setAttribute("class", "active");
        document.getElementById('coldStorageComment').setAttribute("class", "tab-pane active");
        document.getElementById('detail').removeAttribute("class");
        document.getElementById('coldStorageDetail').removeAttribute("class");
        document.getElementById('coldStorageDetail').setAttribute("class", "tab-pane");
        console.log(storageID);
    }


    $scope.load = function () {
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
        map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));     //2D图，卫星图   //左上角， 地图类型控件

        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint("哈尔滨市香坊区哈平路集中区青岛路3号", function (point) {
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
                    $scope.goColdStorageDetail();
                });
            } else {
                alert("您选择地址没有解析到结果!");
            }
        }, "哈尔滨市");
    }
    $scope.load();
});