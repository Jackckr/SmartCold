checkLogin();
app.controller('analysisReport', function ($scope, $location, $http, $rootScope, userService) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};

    $scope.user = window.user;
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var rootRdcId = $.getUrlParam('storageID');
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            if (!rootRdcId) {
                if (window.localStorage.rdcId) {
                	initAllByRdcId(window.localStorage.rdcId);
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                }
            } else {
            	initAllByRdcId(rootRdcId);
                findByRdcId(rootRdcId);
            }
        }
    });

    function findByRdcId(rootRdcId) {
        $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rootRdcId).success(function (data) {
            $scope.currentRdc = data[0];
            $scope.rdcName = data[0].name;
            $scope.rdcId = data[0].id;
            $scope.viewStorage($scope.rdcId);
        });
    }

    $scope.viewStorage = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {
            params: {
                "rdcId": rdcId
            }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
            }
        });
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                $scope.prove = {};
                $.each($scope.mystorages, function (i, vo) {
                    $scope.prove[vo.id] = vo.name;
                });
                $http.get(ER.coldroot + "/i/AnalysisController/getColdStorageDoor", {params: {'rdcId': rdcId}}).success(function (data) {
                    $scope.coldstoragedoor = data;
                });
            }
        });
        // 初始化电量
        $http.get(ER.coldroot + '/i/power/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.powers = data;
            })
        $http.get(ER.coldroot + '/i/platformDoor/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.platformDoors = data;
            })
        // 初始化压缩机组
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(
            function (data) {
                $scope.compressorGroups = data;
                // 初始化压缩机
                angular.forEach($scope.compressorGroups, function (item) {
                    $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(
                        function (data) {
                            item.compressors = data;
                            if ($scope.selectedCompressors == undefined || $scope.selectedCompressors == []) {
                                $scope.selectedCompressorGroupId = item.id;
                                $scope.selectedCompressors = item.compressors;
                            }
                        })
                })
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.searchRdcs = function (searchContent) {
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?type=1&filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                }
            });
        }
    }
    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.viewStorage(rdc.id);
        initAllByRdcId(rdc.id);
    }

    $scope.goTemperature = function () {
        window.location.href = 'analysis.html?storageID=' + $scope.rdcId;
    }
    $scope.goTransport = function () {
        window.location.href = 'analysisTransport.html?storageID=' + $scope.rdcId;
    }
    $scope.goCooling = function () {
        window.location.href = 'analysisCooling.html?storageID=' + $scope.rdcId;
    }

    $scope.goHistoryData = function () {
        window.location.href = 'analysisQuery.html?storageID=' + $scope.rdcId;
    }

    $scope.goReport = function () {
        window.location.href = 'analysisReport.html?storageID=' + $scope.rdcId;
    }

    $scope.getDateTimeStringBefore = function (before) {
        return new Date(new Date().getTime() - before * 24 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/g, '');
    };
    $scope.begin = $scope.getDateTimeStringBefore(3).substr(0, 10), $scope.end = $scope.getDateTimeStringBefore(0).substr(0, 10);
    $scope.slindex = -1, $scope.urlid = 0, $scope.sltit = "日耗电量", $scope.tabletit = null, $scope.rs_msg = null, isSuccess = false, $scope.coldstoragedoor = undefined, $scope.StorageBlower = undefined, $scope.prove = undefined;//冷库门
    //key
    var typemode={
        type:[10,3,2,1,1,4,-1,1,5],
        unit:[null,null,[1,60,60],[60,1,1,1],null,[3600,3600],null,null,[3600,1,60]],//换算单位
        unite:["　(kW·h)","　(T)","","","","","","",""],
        title:["电量","水耗","冷库门","温度分析","热量","冷风机","系统效率","货物因子","制冷运行分析"],
        key:["'TotalPWC'","'WaterCost'","'OpenTimes','TotalTime','AvgTime';次数,时长(min),平均时长(min)","'ChaoWenShiJian','MaxTemp','ChaoWenYinZi','BaoWenYinZi';超温时长(min),最高温度(℃),超温因子(ε),保温因子(τ)","'GoodsHeat','QFrost','QForklift','Qlighting','WallHeat','Qblower','Qctdoor';Q货,Q霜,Q叉,Q照,Q保,Q风,Q门","'RunningTime','DefrosingTime';制冷时间(H),化霜时间(H)","avg","'GoodsLiuTongYinZi'","'RunningTime','RunningCount','avg';运行总时间(H),运行总次数,平均时间(min)"]
    };

    function gettbcltit(value, cl) {//获取标题1
        if (value == null || value == '' || value == 'null')return '<td  colspan="' + cl + '" ></td>'; else return '<td colspan="' + cl + '">' + value + '</td>';
    }

    function getbdltit(value) {//获取标题2
        if (value == null || value == '' || value == 'null') {
            return '<td>0</td>';
        } else {
            if (typeof value == "number" && $scope.slindex != 3) {
                return "<td>" + value.toFixed(2) + "</td>";
            }//排除温度因子
            return "<td>" + value + "</td>";
        }
    }

    //获得配置数据
    function getcofinData() {
        var data = null, datainf = [];
        switch ($scope.slindex) {
            case 0:
                data = $scope.powers;
                break;//电表 -> 日耗电量->ok
            case 1:
                data = $scope.compressorGroups;
                break;//压缩机组 -> 水耗->ok
            case 2:
                data = $scope.coldstoragedoor;
                break;//冷库门->开门
            case 3:
                data = $scope.mystorages;
                break;//冷库->温度分析
            case 4:
                data = $scope.mystorages;
                break;//冷库->热　　量
            case 5:
                data = $scope.StorageBlower;
                break;//blower->冷风机
            case 6:
                data = $scope.qesis;
                break;//系统效率
            case 7:
                data = $scope.mystorages;
                break;//货物因子
            case 8:
                data = $scope.allcompressors;
                break;//制冷运行分析
            default:
                break;
        }
        if (data != null) {
            $.each(data, function (i, vo) {
                datainf.push({id: i, rdcid: vo.id, name: vo.name + typemode.unite[$scope.slindex]});
            });
        }
        $scope.tabletit = datainf;
        return JSON.stringify(datainf);
    }

    $scope.showkeyli = function ($event, index, urlid) {//  urlid==0->单key  1:多key
        $scope.slindex = index, $scope.urlid = urlid;
        $($event.target).addClass('defaultSelect').siblings().removeClass('defaultSelect');
        $scope.sltit = $event.target.innerText;
        $scope.showobjgroup = false;
        $scope.getsldata();
    };
    $scope.getsldata = function () {//拦截未加载数据
        if ($scope.slindex == 2 && $scope.coldstoragedoor == undefined || $scope.slindex == 5 && $scope.StorageBlower == undefined || $scope.slindex == 8 && $scope.allcompressors == undefined || $scope.slindex == 6 && $scope.qesis == undefined) {
            if ($scope.prove == undefined) {
                $scope.prove = {};
                $.each($scope.mystorages, function (i, vo) {
                    $scope.prove[vo.id] = vo.name;
                });
            }
            if ($scope.slindex == 2) {//冷库门->开门
                $http.get(ER.coldroot + "/i/AnalysisController/getColdStorageDoor", {params: {'rdcId': $scope.rdcId}}).success(function (data) {
                    $.each(data, function (i, vo) {
                        vo.name = $scope.prove[vo.coldStorageId] + "-" + vo.name;
                    });
                    $scope.coldstoragedoor = data;
                });
            } else if ($scope.slindex == 5) {//blower->冷风机
                $http.get(ER.coldroot + "/i/AnalysisController/getColdStorageBlower", {params: {'rdcId': $scope.rdcId}}).success(function (data) {
                    $.each(data, function (i, vo) {
                        vo.name = $scope.prove[vo.coldStorageId] + "-" + vo.name;
                    });
                    $scope.StorageBlower = data;
                });
            } else if ($scope.slindex == 6) {//系统效率
                $scope.qesis = [{id: 0, rdcid: 0, name: "系统效率"}];
            } else if ($scope.slindex == 8) {//blower->冷风机
                var data = [];
                $.each($scope.compressorGroups, function (i, vo) {
                    $.each(vo.compressors, function (j, jvo) {
                        jvo.name = vo.name + jvo.name;
                        data.push(jvo);
                    });
                });
                $scope.allcompressors = data;
            }
        }
    };

    $scope.search = function () {//查询数据
        if ($scope.slindex === -1) {
            layer.open({
                content: '没有设置查询对象哦^_^'
                ,btn: '确定'
            });
        } else {
            //将字符串转换为日期
            var begin = new Date($("#startTime").val().replace(/-/g, "/"));
            var end = new Date($("#endTime").val().replace(/-/g, "/"));
            //js判断日期
            if (begin > end) {
                layer.open({
                    content: '开始时间不能小于结束时间哦^_^'
                    , btn: '确定'
                });
                return false;
            }
            isSuccess = false, $scope.rs_msg = null;
            $scope.isLoaddata = true;
            var datainfo = getcofinData();
            $("#rpt_asistb_tit").html($scope.sltit);
            if (datainfo == null || datainfo == "[]") {
                $scope.rs_msg = "当前冷库没有" + typemode.title[$scope.slindex] + "的相关配置！";
                $("#rpt_print").attr("disabled", !isSuccess);
                return;
            }
            $.ajax({
                type: "POST",
                url: ER.coldroot + '/i/AnalysisController/getCasesTotalSISAnalysis',
                data: {
                    rdcid: $scope.rdcId,
                    index: $scope.slindex,
                    urlid: $scope.urlid,
                    isexpt: false,
                    type: typemode.type[$scope.slindex],
                    confdata: datainfo,
                    key: typemode.key[$scope.slindex],
                    unit: typemode.unit[$scope.slindex],
                    startTime: $("#startTime").val(),
                    endTime: $("#endTime").val()
                },
                success: function (data) {
                    if (data.success) {
                        isSuccess = true;
                        if ($scope.urlid == 0 || $scope.urlid == 2) {
                            $scope.dldata(data);
                        } else {
                            $scope.cldata(data);
                        }
                    } else {
                        $scope.rs_msg = data.message;
                    }
                }
            });
        }
    };

    //开始绘制表格
    $scope.dldata = function (data) {//处理单key
        var tbdata = data.entity.tbdata;
        var tit = [], tboy = [];
        tit.push("<td>日期</td>");
        $.each($scope.tabletit, function (i, vo) {
            tit.push(getbdltit(vo.name));
        });
        if (tbdata) {//有数据
            $.each(tbdata, function (i, vo) {
                var tr = "<tr><td>" + i + "</td>";
                $.each(vo, function (j, jvo) {
                    tr += getbdltit(jvo);
                });
                tr += "</tr>";
                tboy.push(tr);
            });
        } else {//没有数据
            tboy.push("<tr><td  colspan='" + tit.length + "'><div class='alert alert-info  text-center'>没有查询到数据！</div></td></tr>");
        }
        $("#rpt_asistb_thead").html(tit.join(""));
        $("#rpt_asistb_tbody").html(tboy.join(""));
    };
    $scope.cldata = function (data) {//处理多key
        var tbdata = data.entity.tbdata;
        var titls = data.entity.titls;
        var keyts = data.entity.keyts;
        var tit = ["<tr><td rowspan='2' style='line-height:5;'>日期</td>"], subtit = ["<tr>"], tboy = [];
        $.each($scope.tabletit, function (i, vo) {
            tit.push(gettbcltit(vo.name, keyts.length));
            $.each(titls, function (j, po) {
                subtit.push(getbdltit(po));
            });//第二栏位标题
        });
        subtit.push("</tr>");
        tit.push("</tr>");
        if (tbdata) {//有数据
            $.each(tbdata, function (i, vo) {
                var tr = "<tr><td>" + i + "</td>";
                $.each(vo, function (j, jvo) {
                    tr += getbdltit(jvo);
                });
                tr += "</tr>";
                tboy.push(tr);
            });
        } else {//没有数据
            tboy.push("<tr><td  colspan='" + (subtit.length - 1) + "'><div class='alert alert-info  text-center'>没有查询到数据！</div></td></tr>");
        }
        $("#rpt_asistb_thead").html(tit.join("") + subtit.join(""));
        $("#rpt_asistb_tbody").html(tboy.join(""));
    }
    jeDate({
        dateCell: "#startTime",
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2008-08-08 08:08:08"
    })
    jeDate({
        dateCell: "#endTime",
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2008-08-08 08:08:08"
    })
});
