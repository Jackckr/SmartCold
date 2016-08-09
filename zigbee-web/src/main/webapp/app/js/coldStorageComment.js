coldWeb.controller('coldStorageComment', function ($rootScope, $scope, $cookies, $http, $location, $state, $stateParams, $uibModal, $log, $cookieStore) {
	
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

    // 获取冷链设施类型
    $http.get('/i/rdc/findAllCompanyDevice').success(function (data) {
        $scope.companyDevices = data;
    });

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
            $scope.score = data[0].score;
            $scope.userRecommendPercent = data[0].userRecommendPercent;
            $scope.userCommentCount = data[0].userCommentCount;
            $scope.recommentCount = data[0].recommentCount;
            $scope.rdcPositionScore = data[0].rdcPositionScore;
            $scope.rdcFacility = data[0].rdcFacilityScore;
            $scope.rdcService = data[0].rdcServiceScore;
            $scope.rdcHealth = data[0].rdcHealthScore;
            $scope.name = data[0].name;
            $scope.address = data[0].address;
            $scope.provinceId = data[0].provinceId;
            $scope.storagePics = data[0].storagePics;
            $scope.storageHonorPics = data[0].storageHonorPics;
            $scope.storageGallery = new Array();
            //小于两张图片添加默认
            for(var j=0, len = $scope.storagePics.length;j < 2 - len;j++){
            	$scope.storagePics.push({location:"app/img/rdc.png"});
            }
            for(j=0; j<$scope.storagePics.length; j++){
            	$scope.storageGallery.push({thumb:$scope.storagePics[j].location ,img:$scope.storagePics[j].location})
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
            $scope.tonnage = data[0].tonnage;
            $scope.structure = data[0].structure;
            $scope.companyDevice = data[0].companyDevice;
            for (var i = 0, len = $scope.companyDevices.length; i < len; i++) {
                if ($scope.companyDevices[i].id === $scope.companyDevice) {
                    $scope.companyDevice = $scope.companyDevices[i].type;
                    break;
                }
            }
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
            $scope.coldTruck1 = data[0].coldTruck1;
            $scope.coldTruck2 = data[0].coldTruck2;
            $scope.coldTruck3 = data[0].coldTruck3;
            $scope.coldTruck4 = data[0].coldTruck4;
            $scope.facility = data[0].facility;

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
            var temper = parseFloat(result[0].powerCosume).toFixed(1);
            $scope.curtemper = temper;
        });
    }

    $scope.tabs = ['detail', 'comment', 'publish'];

    $scope.changeTab = function (selectedTab) {
        angular.forEach($scope.tabs, function (tab) {
            if (tab == selectedTab) {
                angular.element(document.getElementById(tab)).addClass('active');
                angular.element(document.getElementById('coldStorage' + tab)).addClass('active');
            } else {
                angular.element(document.getElementById(tab)).removeClass('active');
                angular.element(document.getElementById('coldStorage' + tab)).removeClass('active');
            }
        })
    }

    $scope.goColdStorageDetail = function (storageID) {
        $scope.rdcId = storageID;
        findRDCByRDCId(storageID);
        $scope.changeTab($scope.tabs[0]);
    }

    $scope.goColdStorageComment = function (storageID) {
        $scope.changeTab($scope.tabs[1]);

        // 获取当前冷库的评论列表
        $http.get('/i/comment/findCommentsByRDCId', {
            params: {
                "rdcID": storageID,
                "npoint": 100
            }
        }).success(function (data) {
            for (var i = 0; i < data.length; i++) {
                data[i].commentsum = parseInt((Math.random() * 5 + 5).toFixed(0));
                data[i].usefulCnt = parseInt((Math.random() * 10 + 5).toFixed(0));
            }
            angular.forEach(data, function (item) {
                item.reviewPics = item.reviewPics;
            })
            $scope.comments = data;
        });
    }

    $scope.maxSize = 10;	// 显示最大页数
    $scope.bigTotalItems = 0; // 总条目数(默认每页十条)
    $scope.bigCurrentPage = 1;  // 当前页
    $scope.goColdStoragePublish = function (storageID) {
        $scope.changeTab($scope.tabs[2]);
        $scope.getPSlist(storageID);
    }

    $scope.getPSlist = function(storageID) {
        $http.get('/i/ShareRdcController/getSEListByRdcID', {
            params: {
                "rdcID": storageID,
                "pageNum" : $scope.bigCurrentPage,
                "pageSize" : $scope.maxSize,
                "datatype": "3,1"
            }
        }).success(function (data) {
            $scope.pslist = data.data;
            $scope.bigTotalItems = data.total;
        });
    }

    $scope.pageChanged = function () {
        $scope.getPSlist($scope.rdcId);
    };


    $scope.load = function () {
    	
        $scope.goColdStorageDetail($stateParams.rdcID);
        // 获取当前冷库的详情
        $http.get('/i/rdc/findRDCByRDCId', {
            params: {
                "rdcID": $stateParams.rdcID
            }
        }).success(function (data) {
            $scope.rdcName = data[0].name;
            $scope.rdcAddress = data[0].address;
            $scope.rdcCityId = data[0].cityid;
            $scope.rdcUserId = data[0].userid;
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
    
	if($location.search().referrer == "review"){
		$scope.goColdStorageComment($scope.rdcId);
	}		

    $scope.goDetail = function (rdcID) {
        $state.go('coldStorageComment', {"rdcID": rdcID});
    }
    
      
    $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data){
        $rootScope.user = data;
	 });

    function checkRdcidAndUserid(){
    	if($scope.rdcUserId==$rootScope.user.id){
    		return true;
    	}
    	return false;
    }
    
    $scope.goEditRdc = function (rdcID) {
         if($rootScope.user == null || $rootScope.user.id == 0){
                  url = "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageComment/"+rdcID;
                  window.location.href = url;
          } else {
        	     if(checkRdcidAndUserid()){
                   $state.go('coldStorageEdit', {"rdcID": rdcID});
        	     }
        	     else{
        	    	 alert("没有修改该冷库的权限");
        	     }
           }
    }

    $scope.goSearch = function () {
        var content = $scope.query;

        // 获取当前冷库的评论列表
        $http.get('/i/comment/findCommentsByRDCId', {
            params: {
                "rdcID": $scope.rdcId,
                "npoint": 100
            }
        }).success(function (data) {
            var size = data.length;
            var result = [];
            if (size > 0){
                angular.forEach(data, function (item) {
                    if ((item.content).indexOf(content) > -1) {
                       result.push(item);
                    }
                })
            }
            $scope.comments = result;
        });
        $scope.query = "";
    }


    //设置cookie
    function setCookie(key, value) {
        var exp = new Date();
        exp.setTime(exp.getTime() + 30 * 60 * 1000);//过期时间 30分钟
        document.cookie = ('commentid' + key) + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    //获取cookie的值
    function getCookie(key) {
        if (document.cookie.length) {
            var cookies = ' ' + document.cookie;
            var start = cookies.indexOf(' ' + ('commentid' + key) + '=');
            if (start == -1) {
                return null;
            }
            var end = cookies.indexOf(";", start);
            if (end == -1) {
                end = cookies.length;
            }
            end -= start;
            var cookie = cookies.substr(start, end);
            return unescape(cookie.substr(cookie.indexOf('=') + 1, cookie.length - cookie.indexOf('=') + 1));
        }
        else {
            return null;
        }
    }

    $scope.addSupport = function (id) {
        if (getCookie(id) == null) {
            $http({
                url: '/i/comment/addUsefulCnt',
                method: "POST",
                data: 'id=' + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK')
                    .success(function (data) {
                        setCookie(id, data.ip);
                    });
                angular.forEach($scope.comments, function (comment) {
                    if (comment.id == id) {
                        comment.usefulcnt += 1;
                    }
                })
                console.log("支持成功");
            }).error(function (data) {
                console.log("支持失败");
            });
        } else {
            $http.jsonp('http://ipinfo.io/?callback=JSON_CALLBACK')
                .success(function (data) {
                    if (getCookie(id) == data.ip) {
                        console.log("您已经支持过了");
                        return;
                    }
                });
        }
    }

    $scope.goComment = function () {
        $location.path("/coldStorage/" + $stateParams.rdcID + "/review");
    }

    $scope.pubSerdc = function () {
        $state.go('releaseItem',{dataid:$scope.rdcId, _cuttid: 3});
    }

    $scope.pubGoods = function () {
        $state.go('releaseItem',{dataid:$scope.rdcId, _cuttid: 1});
    }

});
