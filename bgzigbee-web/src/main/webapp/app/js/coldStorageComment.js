/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('coldStorageComment', function ($rootScope, $scope, $cookies, $http, $location, $state, $stateParams, $uibModal, $log) {

    $scope.rdcId = $stateParams.rdcID;

    // 获取省列表
    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });

    // 获取冷库经营类型
    $http.get('/i/rdc/findAllManageType').success(function (data) {
        $scope.manageTypes = data;
    });

    // 获取商品存放类型
    $http.get('/i/rdc/findAllTemperType').success(function (data) {
        $scope.temperTypes = data;
    });

    // 获取冷库温度类型
    $http.get('/i/rdc/findAllStorageType').success(function (data) {
        $scope.storageTypes = data;
    });

    /*// 获取冷链设施类型
    $http.get('/i/rdc/findAllCompanyDevice').success(function (data) {
        $scope.companyDevices = data;
    });
*/
    // 制冷剂类型
    $http.get('/i/rdc/findAllStorageRefreg').success(function (data) {
        $scope.storageRefregs = data;
    });

    function findRDCByRDCId(rdcID) {
        // 获取当前冷库的详情
        $http.get('/i/rdc/findRDCDTOByRDCId', {
            params: {
                "rdcID": rdcID
            }
        }).success(function (data) {
            console.log("RdcDetail: " + data[0]);
            $scope.score = data[0].score;
            $scope.userRecommendPercent = data[0].userRecommendPercent;
            $scope.userCommentCount = data[0].userCommentCount;
            /*if ($scope.score === undefined) {
             $scope.score = (Math.random() + 4).toFixed(1);
             }
             if ($scope.userRecommendPercent === undefined) {
             $scope.userRecommendPercent = (Math.random() * 5 + 95).toFixed(0);
             }
             if ($scope.userCommentCount === undefined) {
             $scope.userCommentCount = (Math.random() * 1000 + 9000).toFixed(0);
             }*/
            $scope.recommentCount = data[0].recommentCount;
            $scope.rdcPositionScore = data[0].rdcPositionScore;
            $scope.rdcFacility = data[0].rdcFacilityScore;
            $scope.rdcService = data[0].rdcServiceScore;
            $scope.rdcHealth = data[0].rdcHealthScore;
            $scope.name = data[0].name;
            $scope.address = data[0].address;
            $scope.provinceId = data[0].provinceId;
            $scope.storagePicLocation = JSON.parse(data[0].storagePicLocation);
            for(var j=0, len = $scope.storagePicLocation.length;j < 5 - len;j++){
            	$scope.storagePicLocation.push("app/img/rdc.png");
            }
            for (var i = 0, len = $scope.provinces.length; i < len; i++) {
                if ($scope.provinces[i].provinceId === $scope.provinceId) {
                    $scope.provinceName = $scope.provinces[i].provinceName;
                    break;
                }
            }

            $scope.cityId = data[0].cityId;
            // 根据省ID查询城市列表
            $http.get('/i/city/findCitysByProvinceId', {
                params: {
                    "provinceID": $scope.provinceId
                }
            }).success(function (data) {
                $scope.citys = data;
                for (var i = 0, len = $scope.citys.length; i < len; i++) {
                    if ($scope.citys[i].cityID === $scope.cityId) {
                        $scope.cityName = $scope.citys[i].cityName;
                        break;
                    }
                }
            });

            $scope.area = data[0].area;
            
            $scope.structure = data[0].structure;
            for (var i = 0, len = $scope.structures.length; i < len; i++) {
                if ($scope.structures[i].id === $scope.structure) {
                    $scope.structure = $scope.structures[i].type;
                    break;
                }
            }
            $scope.manageType = data[0].manageType;
            for (var i = 0, len = $scope.manageTypes.length; i < len; i++) {
                if ($scope.manageTypes[i].id === $scope.manageType) {
                    $scope.manageType = $scope.manageTypes[i].type;
                    break;
                }
            }
            $scope.storageType = data[0].storageType;
            for (var i = 0, len = $scope.storageTypes.length; i < len; i++) {
                if ($scope.storageTypes[i].id === $scope.storageType) {
                    $scope.storageType = $scope.storageTypes[i].type;
                    break;
                }
            }
            $scope.temperType = data[0].temperType;
            for (var i = 0, len = $scope.temperTypes.length; i < len; i++) {
                if ($scope.temperTypes[i].id === $scope.temperType) {
                    $scope.temperType = $scope.temperTypes[i].type;
                    break;
                }
            }
            $scope.phoneNum = data[0].phoneNum;
            //$scope.telphoneNum = data[0].telphoneNum;
            $scope.remark = data[0].remark;
            //$scope.tonnage = data[0].tonnage;
            $scope.structure = data[0].structure;
            //$scope.companyDevice = data[0].companyDevice;
            /*for (var i = 0, len = $scope.companyDevices.length; i < len; i++) {
                if ($scope.companyDevices[i].id === $scope.companyDevice) {
                    $scope.companyDevice = $scope.companyDevices[i].type;
                    break;
                }
            }*/
            $scope.platform = data[0].platform;
            if ($scope.platform === 0){
                $scope.platform = "无";
            } else {
                $scope.platform = "有";
            }
            $scope.lihuoRoom = data[0].lihuoRoom;
            if ($scope.lihuoRoom === 0) {
                $scope.lihuoRoom = "无";
                $scope.hasLihuoRoom = true;
            } else {
                $scope.lihuoRoom = "有";
                $scope.hasLihuoRoom = false;
            }

            $scope.lihuoArea = data[0].lihuoArea;
            $scope.lihuoTemperCtr = data[0].lihuoTemperCtr;
            if ($scope.lihuoTemperCtr === 0){
                $scope.lihuoTemperCtr = "无";
            } else {
                $scope.lihuoTemperCtr = "有";
            }
            $scope.storageRefreg = data[0].storageRefreg;
            for (var i = 0, len = $scope.storageRefregs.length; i < len; i++) {
                if ($scope.storageRefregs[i].id === $scope.storageRefreg) {
                    $scope.storageRefreg = $scope.storageRefregs[i].type;
                    break;
                }
            }
            $scope.temperRecord = data[0].temperRecord;
            if ($scope.temperRecord === 0){
                $scope.temperRecord = "无";
            } else {
                $scope.temperRecord = "有";
            }
            $scope.capacity1 = data[0].capacity1;
            $scope.capacity2 = data[0].capacity2;
            $scope.capacity3 = data[0].capacity3;
            $scope.capacity4 = data[0].capacity4;
            $scope.capacity5 = data[0].capacity5;
            $scope.height1 = data[0].height1;
            $scope.height2 = data[0].height2;
            $scope.height3 = data[0].height3;
            $scope.height4 = data[0].height4;
            $scope.height5 = data[0].height5;
            $scope.coldTruck1 = data[0].coldTruck1;
            $scope.coldTruck2 = data[0].coldTruck2;
            $scope.coldTruck3 = data[0].coldTruck3;
            $scope.coldTruck4 = data[0].coldTruck4;
            $scope.facility = data[0].facility;
            console.log("name: " + data[0].name);
            console.log("provinceId: " + data[0].provinceId);
            console.log("cityId: " + data[0].cityId);
            console.log("address: " + data[0].address);
            console.log("area: " + data[0].area);
            console.log("manageType: " + data[0].manageType);
            console.log("storageType: " + data[0].storageType);
            console.log("temperType: " + data[0].temperType);
            console.log("coldTruck1: " + data[0].coldTruck1);
            console.log("coldTruck2: " + data[0].coldTruck2);
            console.log("coldTruck3: " + data[0].coldTruck3);
            console.log("coldTruck4: " + data[0].coldTruck4);
            console.log("phoneNum: " + data[0].phoneNum);
            //console.log("telphoneNum: " + data[0].telphoneNum);
            console.log("remark: " + data[0].remark);

            console.log("tonnage: " + data[0].tonnage);
            console.log("structure: " + data[0].structure);
            console.log("companyDevice: " + data[0].companyDevice);
            console.log("platform: " + data[0].platform);
            console.log("lihuoRoom: " + data[0].lihuoRoom);
            console.log("lihuoArea: " + data[0].lihuoArea);
            console.log("lihuoTemperCtr: " + data[0].lihuoTemperCtr);
            console.log("storageRefreg: " + data[0].storageRefreg);
            console.log("temperRecord: " + data[0].temperRecord);
            console.log("capacity1: " + data[0].capacity1);
            console.log("capacity2: " + data[0].capacity2);
            console.log("capacity3: " + data[0].capacity3);
            console.log("capacity4: " + data[0].capacity4);
            console.log("capacity5: " + data[0].capacity5);
            console.log("facility: " + data[0].facility);
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
                "npoint": 100
            }
        }).success(function (data) {
            var size = data.length;
            for (var i = 0; i < data.length; i++) {
                console.log("data:" + data[i].content + data[i].commerID + data[i].addTime + data[i].commerName);
                data[i].commentsum = parseInt((Math.random() * 5 + 5).toFixed(0));
                data[i].usefulCnt = parseInt((Math.random() * 10 + 5).toFixed(0));
            }
            angular.forEach(data, function (item) {
            	console.log(item);
                item.piclocation = JSON.parse(item.picLocation);
            })
            $scope.comments = data;
            console.log(data);
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
            $scope.rdcCityId = data[0].cityid;
            //alert($scope.rdcCityId); // 根据cityId进行查询cityName
            var cityName = '';
            $http.get('/i/city/findCityById', {
                params: {
                    "CityID": $scope.rdcCityId
                }
            }).success(function (data) {
                cityName = data.cityName;
                var address = cityName + $scope.rdcAddress;
                var name = $scope.rdcName;

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
                            //alert("去查看冷库详情");
                            console.log("去查看冷库" + name + "详情");
                            $scope.goColdStorageDetail($stateParams.rdcID);
                        });
                    } else {
                        //alert("您选择地址没有解析到结果!");
                        console.log("地址" + address + "没有解析到结果!");
                    }
                }, "");

            })

        });

    }
    $scope.load();

    $scope.goDetail = function (rdcID) {
        console.log("rdcID" + rdcID);
        $state.go('coldStorageComment', {"rdcID": rdcID});
    }

    $scope.goEditRdc = function (rdcID) {
        $state.go('coldStorageEdit', {"rdcID": rdcID});
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

/*
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

})*/
