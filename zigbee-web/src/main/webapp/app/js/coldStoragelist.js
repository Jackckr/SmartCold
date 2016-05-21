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
            endItem = $scope.bigTotalItems - 1;
        } else {
            startItem = (curPage - 1) * 10;
            endItem = curPage * 10 - 1;
        }
        var curtData = [];
        for (var i = startItem; i <= endItem; i++) {
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

    // 获取当前冷库的列表
    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
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


    $scope.rdcListForm = "list";
    $scope.goRdcMap = function () {
        $scope.rdcListForm = "map";
        $http.get('/i/rdc/findRdcList').success(function (data) {
            var size = data.length;
            console.log("size: " + size);

            // 百度地图API功能
            var map = new BMap.Map("rdcMapChart");
            var point = new BMap.Point(104.114129, 34.550339);
            map.centerAndZoom(point, 5);
            //添加鼠标滚动缩放
            //map.enableScrollWheelZoom();

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
                        icon = new BMap.Icon("../../assets/img/icon-orange.jpg", new BMap.Size(100, 100), {
                            anchor: new BMap.Size(9, 25),
                            infoWindowAnchor: new BMap.Size(10, 0)
                        });
                        var marker = new BMap.Marker(address, {icon: icon});
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
    }


    $scope.goRdcList = function () {
        $scope.rdcListForm = "list";
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


    // 参数查询
    // 1.经营类型
    var searchManageType = [];
    $scope.searchManageType_Default = function () {
        $scope.searchManageType_all = {
            "position": "relative",
            "padding-left": "3px",
            "padding-right": "3px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        $scope.searchManageType_orginPlace_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchManageType_market_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchManageType_storage_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchManageType_homeDelivery_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchManageType_product_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchManageType_centerKitchen_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
    }
    $scope.searchManageType_Default();

    $scope.searchManageType_All = function () {
        $scope.searchManageType_Default();
        searchManageType = [];
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchManageType_orginPlace = function () {
        $scope.searchManageType_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchManageType_orginPlace_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchManageType.indexOf("产地") === -1) {
            searchManageType.push("产地");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchManageType_market = function () {
        $scope.searchManageType_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchManageType_market_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchManageType.indexOf("市场") === -1) {
            searchManageType.push("市场");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }
    $scope.searchManageType_storage = function () {
        $scope.searchManageType_all = {"position": "relative", "margin-left": "3px", "color": "#333"};
        $scope.searchManageType_storage_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchManageType.indexOf("仓储") === -1) {
            searchManageType.push("仓储");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }
    $scope.searchManageType_homeDelivery = function () {
        $scope.searchManageType_all = {"position": "relative", "margin-left": "3px", "color": "#333"};
        $scope.searchManageType_homeDelivery_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchManageType.indexOf("宅配") === -1) {
            searchManageType.push("宅配");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }
    $scope.searchManageType_product = function () {
        $scope.searchManageType_all = {"position": "relative", "margin-left": "3px", "color": "#333"};
        $scope.searchManageType_product_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchManageType.indexOf("生产") === -1) {
            searchManageType.push("生产");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }
    $scope.searchManageType_centerKitchen = function () {
        $scope.searchManageType_all = {"position": "relative", "margin-left": "3px", "color": "#333"};
        $scope.searchManageType_centerKitchen_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchManageType.indexOf("中央厨房") === -1) {
            searchManageType.push("中央厨房");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    // 2.商品存放形式
    var searchGoodStore = [];
    $scope.searchGoodStore_Default = function () {
        $scope.searchGoodStore_all = {
            "position": "relative",
            "padding-left": "3px",
            "padding-right": "3px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        $scope.searchGoodStore_Rack_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchGoodStore_NotRack_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
    }
    $scope.searchGoodStore_Default();

    $scope.searchGoodStore_All = function () {
        $scope.searchGoodStore_Default();
        searchGoodStore = [];
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchGoodStore_Rack = function () {
        $scope.searchGoodStore_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchGoodStore_Rack_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchGoodStore.indexOf("货架存放") === -1) {
            searchGoodStore.push("货架存放");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchGoodStore_NotRack = function () {
        $scope.searchGoodStore_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchGoodStore_NotRack_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchGoodStore.indexOf("非货架存放") === -1) {
            searchGoodStore.push("非货架存放");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    // 3.冷库温度类型
    var searchStorageTemper = [];
    $scope.searchStorageTemper_Default = function () {
        $scope.searchStorageTemper_all = {
            "position": "relative",
            "padding-left": "3px",
            "padding-right": "3px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        $scope.searchStorageTemper_refrigeration_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchStorageTemper_frozen_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
        $scope.searchStorageTemper_lowestTemper_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchStorageTemper_constantTemper_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchStorageTemper_multiTemper_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
    }
    $scope.searchStorageTemper_Default();

    $scope.searchStorageTemper_All = function () {
        $scope.searchStorageTemper_Default();
        searchStorageTemper = [];
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchStorageTemper_refrigeration = function () {
        $scope.searchStorageTemper_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchStorageTemper_refrigeration_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchStorageTemper.indexOf("冷藏") === -1) {
            searchStorageTemper.push("冷藏");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchStorageTemper_frozen = function () {
        $scope.searchStorageTemper_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchStorageTemper_frozen_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchStorageTemper.indexOf("冷冻") === -1) {
            searchStorageTemper.push("冷冻");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchStorageTemper_lowestTemper = function () {
        $scope.searchStorageTemper_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchStorageTemper_lowestTemper_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchStorageTemper.indexOf("超低温") === -1) {
            searchStorageTemper.push("超低温");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchStorageTemper_constantTemper = function () {
        $scope.searchStorageTemper_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchStorageTemper_constantTemper_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchStorageTemper.indexOf("恒温") === -1) {
            searchStorageTemper.push("恒温");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchStorageTemper_multiTemper = function () {
        $scope.searchStorageTemper_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchStorageTemper_multiTemper_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchStorageTemper.indexOf("多温区") === -1) {
            searchStorageTemper.push("多温区");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    // 4.冷库总面积
    var searchTotalArea = [];
    $scope.searchTotalArea_Default = function () {
        $scope.searchTotalArea_all = {
            "position": "relative",
            "padding-left": "3px",
            "padding-right": "3px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        $scope.searchTotalArea_below1k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchTotalArea_below3k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchTotalArea_below6k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchTotalArea_below12k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchTotalArea_below20k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchTotalArea_over20k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };

    }
    $scope.searchTotalArea_Default();

    $scope.searchTotalArea_All = function () {
        $scope.searchTotalArea_Default();
        searchTotalArea = [];
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTotalArea_below1k = function () {
        $scope.searchTotalArea_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTotalArea_below1k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTotalArea.indexOf("1000平方以下") === -1) {
            searchTotalArea.push("1000平方以下");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTotalArea_below3k = function () {
        $scope.searchTotalArea_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTotalArea_below3k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTotalArea.indexOf("1000-3000平方") === -1) {
            searchTotalArea.push("1000-3000平方");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTotalArea_below6k = function () {
        $scope.searchTotalArea_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTotalArea_below6k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTotalArea.indexOf("3000-6000平方") === -1) {
            searchTotalArea.push("3000-6000平方");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTotalArea_below12k = function () {
        $scope.searchTotalArea_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTotalArea_below12k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTotalArea.indexOf("6000-12000平方") === -1) {
            searchTotalArea.push("6000-12000平方");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTotalArea_below20k = function () {
        $scope.searchTotalArea_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTotalArea_below20k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTotalArea.indexOf("12000-20000平方") === -1) {
            searchTotalArea.push("12000-20000平方");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTotalArea_over20k = function () {
        $scope.searchTotalArea_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTotalArea_over20k_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTotalArea.indexOf("20000平方以上") === -1) {
            searchTotalArea.push("20000平方以上");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    // 5.配备冷藏车辆情况
    var searchTruck = [];
    $scope.searchTruck_Default = function () {
        $scope.searchTruck_all = {
            "position": "relative",
            "padding-left": "3px",
            "padding-right": "3px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        $scope.searchTruck_have_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
        $scope.searchTruck_no_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333"
        };
    }
    $scope.searchTruck_Default();

    $scope.searchTruck_All = function () {
        $scope.searchTruck_Default();
        searchTruck = [];
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTruck_have = function () {
        $scope.searchTruck_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTruck_have_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTruck.indexOf("有") === -1) {
            searchTruck.push("有");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchTruck_no = function () {
        $scope.searchTruck_all = {"position": "relative", "padding-left": "3px", "color": "#333"};
        $scope.searchTruck_no_style = {
            "position": "relative",
            "margin-left": "30px",
            "color": "#333",
            "background-color": "#5cb85c"
        };
        if (searchTruck.indexOf("无") === -1) {
            searchTruck.push("无");
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    var searchProvince;
    $scope.provinceChange = function () {
        //alert($scope.provinceSelected);
        searchProvince = $scope.provinceSelected;
        searchManageType = [];
        $scope.searchManageType_Default();
        searchGoodStore = [];
        $scope.searchGoodStore_Default();
        searchStorageTemper = [];
        $scope.searchStorageTemper_Default();
        searchTotalArea = [];
        $scope.searchTotalArea_Default();
        searchTruck = [];
        $scope.searchTruck_Default();
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    $scope.searchFuc = function (searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck) {
        //alert(searchProvince + "," + searchManageType.length + "," + searchGoodStore.length + "," + searchStorageTemper.length + "," + searchTotalArea.length + "," + searchTruck.length);
        if (searchProvince !== undefined) {

        }

        if (searchManageType.length != 0) {
            // 获取当前冷库的列表
            /*            $http.get('/i/rdc/findRdcList').success(function (data) {
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
             $scope.bigTotalItems = size;
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
             });*/
        }
        if (searchGoodStore.length != 0) {

        }
        if (searchStorageTemper.length != 0) {

        }
        if (searchTotalArea.length != 0) {

        }
        if (searchTruck.length != 0) {

        }
    }
});