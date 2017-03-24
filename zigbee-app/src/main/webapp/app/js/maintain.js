checkLogin();
var app = angular.module('app', []);
app.controller('maintain', function ($scope, $location, $http,$timeout) {
	var pageNum =  totalPages = 0;
    $scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    $scope.alarmTotalCnt = 0;
    $scope.alarmMsgs = []; 

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
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                }
            } else {
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

    $scope.smgroid = null;
    $scope.sytime = undefined;
    $scope.viewStorage = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {
            params: {
                "rdcId": $scope.rdcId
            }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
            }
        });
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(function (data) {
            $scope.compressorGroups = data;
            var oid = [];
            angular.forEach($scope.compressorGroups, function (item) {
                oid.push(item.id);
                $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(function (data) {
                    item.compressors = data;
                })
            })
            $scope.smgroid = oid.join(',');
            $http.get(ER.coldroot + '/i/physicalController/getCompressorinfo', {params: {oids: $scope.smgroid}}).success(function (data) {
                $scope.sytime = data.entity;
                angular.forEach($scope.compressorGroups, function (item) {
                    angular.forEach(item.compressors, function (obj) {
                        obj.sytm = $scope.aredayTime(obj);
                    });
                });
            });
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.aredayTime = function (obj) {
        if (obj.maintenancetime && obj.lastMaintainTime) {
            var sytime = $scope.sytime[obj.id];
            if (sytime <= 0) {
                return '已超保养期' + sytime;
            }
            return "还剩  " + parseInt(sytime) + "小时";
        } else {
            return "未设置保养时间";
        }
    };

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

    /*tab切换*/
    $(".mylog").click(function (event) {
        var $index = $(this).index();
        $('.mainTainBottomL>div').eq($index).show().siblings().hide();
        $(this).addClass('current').siblings().removeClass('current');
    })
    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.alarmTotalCnt = 0;
        $scope.viewStorage(rdc.id);
    }

    function checkInput() {
        var flag = true;
        // 检查必须填写项
        if ($scope.unitname == undefined || $scope.unitname == '') {flag = false;}
		if ($scope.reason == undefined || $scope.reason == '') {flag = false;}
		if ($scope.ordertime == undefined || $scope.ordertime == '') {flag = false;}
        return flag;
    }
    function checkTime(){
		var d = new Date();//Date.parse($scope.updateMaintenance0.ordertime.replace(/-/g,"/"))
		var today = Date.parse((d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()).replace(/-/g,"/"));//今天的毫秒数
		var orderDay = new Date($scope.ordertime).getTime();
		if(orderDay < today){
			alert("预约时间不能晚于今天哦~")
			return false
		}else{
			return true
		}
	}
    $scope.addMaintenance = function () {
    	if($scope.rdcId==undefined||$scope.rdcId==null||$scope.rdcId==''){return;}
        if (checkInput()) {
        	if (checkTime()) {
	            $http({
	                method: 'POST',
	                url: ER.coldroot + '/i/maintenance/addMaintenance',
	                params: {
	                	rdcId: $scope.rdcId,
	                    unitname: encodeURI($scope.unitname, "UTF-8"),
	                    reason: encodeURI($scope.reason, "UTF-8"),
	                    ordertime: $("input[ng-model='ordertime']").val()
	                }
	            }).success(function (data) {
	                if (data) {
	                    alert("添加成功");
	//                    window.location.reload();
	                    $scope.getMaintenances0();
	                    $scope.getMaintenances1();
	                    $scope.unitname = $scope.reason=$scope.ordertime=null;
	                }
	                else {
	                    alert("添加失败");
	                }
	            });
        	}
        } else {
            alert("您有未填项哦~");
        }
    };

    // 显示最大页数
    $scope.maxSize = 6;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 6;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.bigCurrentPage1 = 1;
    $scope.Maintenances0 = [];
    $scope.Maintenances1 = [];
    $scope.updateMaintenance0 = {};
    $scope.getMaintenances0 = function () {
//    	if($scope.rdcId==undefined||$scope.rdcId==null||$scope.rdcId==''){return;}
        $http({
            method: 'POST',
            url: ER.coldroot + '/i/maintenance/findAllMaintenance',
            params: {
                rdcId: $scope.rdcId,
                audit: 0,
                keyword: decodeURI(encodeURI($scope.keyword,"UTF-8"))
            }
        }).success(function (data) {
            $scope.Maintenances0 = data.list;
        });
    };

    $scope.getMaintenances1 = function () {
//    	if($scope.rdcId==undefined||$scope.rdcId==null||$scope.rdcId==''){return;}
        $http({
            method: 'POST',
            url: ER.coldroot + '/i/maintenance/findMaintenanceList',
            params: {
                pageNum: $scope.bigCurrentPage1,
                pageSize: $scope.maxSize,
                rdcId: $scope.rdcId,
                audit: 1,
                keyword: decodeURI(encodeURI($scope.keyword,"UTF-8"))
            }
        }).success(function (data) {
           pageNum = data.pageNum;
          totalPages = data.pages;
          
          $scope.Maintenances1 = data.list;
          $('.pagination').jqPagination({
        	  link_string : '/?page={page_number}',
        	  current_page: pageNum, //设置当前页 默认为1
        	  max_page : totalPages , //设置最大页 默认为1
        	  page_string : '当前第'+pageNum+'页,共'+totalPages+'页',
        	  paged : function(page) {
        		  $scope.bigCurrentPage1=page;
        		  $scope.getMaintenances1();
        	      }
        	});
          
        });
    };

  
    $scope.pageChanged0 = function () {
        $scope.getMaintenances0();
    };
    $scope.pageChanged1 = function () {
        $scope.getMaintenances1();
    };

    $scope.auditChanged = function (optAudiet) {
        $scope.getMaintenances0();
        $scope.getMaintenances1();
    };
    $scope.goSearch0 = function () {
        $scope.getMaintenances0();
    };
    $scope.goSearch1 = function () {
    	if($scope.keyword ==""){
    		alert("请输入需要搜索的机组名称~");
    	}else{
    		
    		$scope.getMaintenances1();
    	}
    };

    function delcfm() {
        if (!confirm("确认要删除？")) {
            return false;
        }
        return true;
    }

    $scope.goDeleteMaintenance = function (id) {
        if (delcfm()) {
            $http.get(ER.coldroot + '/i/maintenance/deleteMaintenance', {
                params: {
                    "id": id
                }
            }).success(function (data) {
//                window.location.reload();
            	 $scope.getMaintenances0();
                 $scope.getMaintenances1();
            });
        }
    };

    $scope.weixiuapply = function (id) {
        $http.get(ER.coldroot + '/i/maintenance/findMaintenanceByID', {
            params: {
                "id": id
            }
        }).success(function (data) {
            $scope.updateMaintenance0 = data;
            layer.open({
                title: [
                    '维修操作',
                    'background-color:#40AFFE; color:#fff;height:2.2rem;line-height:2.2rem;'
                ]
                , content: '<div class="applyKid textA">' +
                '<p>机组名称:</p>' +
                '<textarea disabled>' + $scope.updateMaintenance0.unitname + '</textarea>' +
                '</div>' +
                '<div class="applyKid textA">' +
                '<p>维修详情:</p>' +
                '<textarea colspan="10" rowspan="10" id="detail" placeholder="请输入维修详情"></textarea>' +
                '</div>' +
                '<div class="applyKid">' +
                '<p>实际维修时间:</p>' +
                '<input class="datainp" style="width:100%;" type="date" id="fixtime" placeholder="请选择维修时间"/>' +
                '</div>' +
                '<div class="applyKid textA">' +
                '<p>备注:</p>' +
                '<textarea colspan="10" rowspan="10" id="note"" placeholder="请输入文字"></textarea>' +
                '</div>'
                , btn: ['确认', '取消']
                , yes: function (index) {
                    var detail = $('#detail').val().trim();
                    var fixtime = $('#fixtime').val();
                    var note = $('#note').val().trim();
                    if (detail === '') {
                        alert("请填写维修详情");
                        return;
                    }
                    if (fixtime === '') {
                        alert("请填写维修时间");
                        return;
                    }
                    if(fixtime>=$scope.updateMaintenance0.ordertime.split(' ',1)){
                    	$scope.submitfix(detail, fixtime, note);
                        layer.close(index);
                    }else{
                    	alert("维修时间不能早于预约时间");
                    }
                    
                }
            });
        });
    };

    $scope.submitfix = function (detail, fixtime, note) {
        $scope.updateMaintenance0.detail = detail;
        $scope.updateMaintenance0.fixtime = fixtime;
        $scope.updateMaintenance0.note = note;
        $scope.updateMaintenance0.audit = 1;
        $http({
            'method': 'POST',
            'url': ER.coldroot + '/i/maintenance/updateMaintenance',
            'params': {
                "id": $scope.updateMaintenance0.id,
                "detail": encodeURI($scope.updateMaintenance0.detail, "UTF-8"),
                "fixtime": $scope.updateMaintenance0.fixtime,
                "note": encodeURI($scope.updateMaintenance0.note, "UTF-8"),
                "audit": 1
            }
        }).success(function (data) {
            if (data) {
                alert("提交成功");
//                window.location.reload();
                $scope.getMaintenances0();
                $scope.getMaintenances1();
            }
            else {
                alert("提交失败");
            }
        });
    };

    $scope.change = function (id, appraise) {
    	if(appraise==""){
    		alert("评价内容不能为空哦~");
    	}else{
	        $http({
	            'method': 'POST',
	            'url': ER.coldroot + '/i/maintenance/updateMaintenanceAppraise',
	            'params': {
	                'id': id,
	                'appraise': appraise
	            }
	        });
    	}
    }; 
	 $scope.initMainit=function(newValue,oldValue){
		   if($scope.rdcId!=undefined){
			    $scope.getMaintenances0();
                $scope.getMaintenances1();
		   }
	  };
	  $scope.$watch('rdcId',$scope.initMainit,true);//监听冷库变化

});
