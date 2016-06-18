coldWeb.controller('coldStoragelist', function ($rootScope, $scope, $state, $cookies, $http, $location) {

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
            data[i].score = (Math.random() + 4).toFixed(1);
            data[i].userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
            data[i].userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
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
    $http.get('/i/rdc/findRdcDTOList').success(function (data) {
        var size = data.length;
        $scope.Allrdcs = data;
        $scope.bigTotalItems = size;
        var firstData = [];
        //firstData.splice(10, size);
        for (var i = 0; i < 10; i++) {
            firstData.push(data[i]);
        }
        $scope.rdcs = firstData;
    });

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
    	/*  $http.get('/i/user/findUser').success(function(data){
            $rootScope.user = data;
             if($rootScope.user == null || $rootScope.user.id == 0){
                 url = "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStoragelist";
                 window.location.href = url;
             } else {*/
            	 console.log("rdcID" + rdcID);
                 $state.go('coldStorageComment', {"rdcID": rdcID});
            /* }
         });*/
     }
    	
    	
    /*	if(user.username!=undefined && user.username!=''){
        console.log("rdcID" + rdcID);
        $state.go('coldStorageComment', {"rdcID": rdcID});
    	}
    	else{
    		alert("请先登录");
    	}*/

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
                    if ((data[i].name).indexOf(content) > -1 || (data[i].address).indexOf(content) > -1) {
                        result.push(data[i]);
                    }
                }
            }
            $scope.Allrdcs = result;
            $scope.bigTotalItems = result.length;
            var firstData = [];
            var minSize = Math.min(result.length, 10);
            for (var i = 0; i < minSize; i++) {
                result[i].score = (Math.random() + 4).toFixed(1);
                result[i].userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
                result[i].userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
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
        } else {
            searchManageType = removeItem(searchManageType, "产地");
            $scope.searchManageType_orginPlace_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchManageType === undefined || searchManageType.length ===0){
                $scope.searchManageType_Default();
            }
        }
        $scope.searchFuc(searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck);
    }

    function removeItem(arys,item){
        var newArray = [];
        for(var i=0;i < arys.length;i++) {
            if(item !== arys[i]) {
                newArray.push(arys[i]);
            }
        }
        return newArray;
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
        } else {
            searchManageType = removeItem(searchManageType, "市场");
            $scope.searchManageType_market_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchManageType === undefined || searchManageType.length ===0){
                $scope.searchManageType_Default();
            }
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
        } else {
            searchManageType = removeItem(searchManageType, "仓储");
            $scope.searchManageType_storage_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchManageType === undefined || searchManageType.length ===0){
                $scope.searchManageType_Default();
            }
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
        } else {
            searchManageType = removeItem(searchManageType, "宅配");
            $scope.searchManageType_homeDelivery_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchManageType === undefined || searchManageType.length ===0){
                $scope.searchManageType_Default();
            }
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
        } else {
            searchManageType = removeItem(searchManageType, "生产");
            $scope.searchManageType_product_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchManageType === undefined || searchManageType.length ===0){
                $scope.searchManageType_Default();
            }
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
        } else {
            searchManageType = removeItem(searchManageType, "中央厨房");
            $scope.searchManageType_centerKitchen_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchManageType === undefined || searchManageType.length ===0){
                $scope.searchManageType_Default();
            }
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
        } else {
            searchGoodStore = removeItem(searchGoodStore, "货架存放");
            $scope.searchGoodStore_Rack_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchGoodStore === undefined || searchGoodStore.length ===0){
                $scope.searchGoodStore_Default();
            }
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
        } else {
            searchGoodStore = removeItem(searchGoodStore, "非货架存放");
            $scope.searchGoodStore_NotRack_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchGoodStore === undefined || searchGoodStore.length ===0){
                $scope.searchGoodStore_Default();
            }
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
        } else {
            searchStorageTemper = removeItem(searchStorageTemper, "冷藏");
            $scope.searchStorageTemper_refrigeration_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchStorageTemper === undefined || searchStorageTemper.length ===0){
                $scope.searchStorageTemper_Default();
            }
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
        } else {
            searchStorageTemper = removeItem(searchStorageTemper, "冷冻");
            $scope.searchStorageTemper_frozen_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchStorageTemper === undefined || searchStorageTemper.length ===0){
                $scope.searchStorageTemper_Default();
            }
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
        } else {
            searchStorageTemper = removeItem(searchStorageTemper, "超低温");
            $scope.searchStorageTemper_lowestTemper_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchStorageTemper === undefined || searchStorageTemper.length ===0){
                $scope.searchStorageTemper_Default();
            }
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
        } else {
            searchStorageTemper = removeItem(searchStorageTemper, "恒温");
            $scope.searchStorageTemper_constantTemper_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchStorageTemper === undefined || searchStorageTemper.length ===0){
                $scope.searchStorageTemper_Default();
            }
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
        } else {
            searchStorageTemper = removeItem(searchStorageTemper, "多温区");
            $scope.searchStorageTemper_multiTemper_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchStorageTemper === undefined || searchStorageTemper.length ===0){
                $scope.searchStorageTemper_Default();
            }
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
        } else {
            searchTotalArea = removeItem(searchTotalArea, "1000平方以下");
            $scope.searchTotalArea_below1k_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTotalArea === undefined || searchTotalArea.length ===0){
                $scope.searchTotalArea_Default();
            }
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
        } else {
            searchTotalArea = removeItem(searchTotalArea, "1000-3000平方");
            $scope.searchTotalArea_below3k_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTotalArea === undefined || searchTotalArea.length ===0){
                $scope.searchTotalArea_Default();
            }
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
        } else {
            searchTotalArea = removeItem(searchTotalArea, "3000-6000平方");
            $scope.searchTotalArea_below6k_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTotalArea === undefined || searchTotalArea.length ===0){
                $scope.searchTotalArea_Default();
            }
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
        }  else {
            searchTotalArea = removeItem(searchTotalArea, "6000-12000平方");
            $scope.searchTotalArea_below12k_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTotalArea === undefined || searchTotalArea.length ===0){
                $scope.searchTotalArea_Default();
            }
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
        }  else {
            searchTotalArea = removeItem(searchTotalArea, "12000-20000平方");
            $scope.searchTotalArea_below20k_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTotalArea === undefined || searchTotalArea.length ===0){
                $scope.searchTotalArea_Default();
            }
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
        } else {
            searchTotalArea = removeItem(searchTotalArea, "20000平方以上");
            $scope.searchTotalArea_over20k_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTotalArea === undefined || searchTotalArea.length ===0){
                $scope.searchTotalArea_Default();
            }
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

        if (searchTruck !== undefined && searchTruck.length !==0){
            if (searchTruck.indexOf("有") === -1) {
                searchTruck.push("有");
            } else {
                searchTruck = removeItem(searchTruck, "有");
                $scope.searchTruck_have_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
                if (searchTruck === undefined || searchTruck.length ===0){
                    $scope.searchTruck_Default();
                }
            }
        } else {
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
        } else {
            searchTruck = removeItem(searchTruck, "无");
            $scope.searchTruck_no_style = {"position": "relative", "margin-left": "30px", "color": "#333"};
            if (searchTruck === undefined || searchTruck.length ===0){
                $scope.searchTruck_Default();
            }
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


    $scope.RdcDtos;
    $http.get('/i/rdc/findAllRdcDtos').success(function (data) {
        $scope.RdcDtos = data;
    });

    $scope.searchFuc = function (searchProvince, searchManageType, searchGoodStore, searchStorageTemper, searchTotalArea, searchTruck) {
        //alert(searchProvince + "," + searchManageType.length + "," + searchGoodStore.length + "," + searchStorageTemper.length + "," + searchTotalArea.length + "," + searchTruck.length);
        var data = $scope.RdcDtos;
        var result = [];
        var size = data.length;

        for (var i = 0; i < size; i++) {
            if (searchProvince !== undefined) {
                if (data[i].provinceId !== parseInt(searchProvince)) {
                    continue;
                }
            }
            if (searchManageType !== undefined && searchManageType.length !== 0 && searchManageType.length !== 6) {
                if (data[i].companykind.indexOf(searchManageType) === -1) {
                    continue;
                }
            }
            if (searchGoodStore !== undefined && searchGoodStore.length !== 0 && searchGoodStore.length !== 2) {
                if (data[i].storagetype.indexOf(searchGoodStore) === -1) {
                    continue;
                }
            }
            if (searchStorageTemper !== undefined && searchStorageTemper.length !== 0 && searchStorageTemper.length !== 5) {
                if (data[i].storagetempertype.indexOf(searchStorageTemper) === -1) {
                    continue;
                }
            }
            if (searchTotalArea !== undefined && searchTotalArea.length !== 0 && searchTotalArea.length !== 6) {
                var sqm = parseInt(data[i].sqm.toFixed(0));
                var totalArea = "";
                if (sqm >= parseInt(0) && sqm <= parseInt(1000)) {
                    totalArea = "1000平方以下";
                } else if (sqm >= parseInt(1000) && sqm <= parseInt(3000)) {
                    totalArea = "1000-3000平方";
                } else if (sqm >= parseInt(3000) && sqm <= parseInt(6000)) {
                    totalArea = "3000-6000平方";
                } else if (sqm >= parseInt(6000) && sqm <= parseInt(12000)) {
                    totalArea = "6000-12000平方";
                } else if (sqm >= parseInt(12000) && sqm <= parseInt(20000)) {
                    totalArea = "12000-20000平方";
                } else if (sqm >= parseInt(20000)) {
                    totalArea = "20000平方以上";
                } else {
                    console.error("面积不能小于0平方");
                }
                if (searchTotalArea.indexOf(totalArea) === -1) {
                    continue;
                }
            }
            if (searchTruck !== undefined && searchTruck.length !== 0 && searchTruck.length !== 2) {
                if (data[i].storagetruck.indexOf(searchTruck) === -1) {
                    continue;
                }
            }
            result.push(addScore(data[i].rdcEntity));
        }
        console.log("result: " + result.length)
        //$scope.rdcs = result;

        var size = result.length;
        $scope.Allrdcs = result;
        $scope.bigTotalItems = size;
        var firstData = [];
        if (result.length !== 0){
            if (result.length > 10){
                for (var i = 0; i < 10; i++) {
                    firstData.push(result[i]);
                }
            } else {
                for (var i = 0; i < result.length; i++) {
                    firstData.push(result[i]);
                }
            }

        }
        $scope.rdcs = firstData;
    }

    function addScore(rdc) {
        rdc.score = (Math.random() + 4).toFixed(1);
        rdc.userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
        rdc.userRecommendCount = (Math.random() * 1000 + 9000).toFixed(0);
        return rdc;
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