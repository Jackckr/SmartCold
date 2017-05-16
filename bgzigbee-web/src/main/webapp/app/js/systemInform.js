coldWeb.controller('systemInform', function ($scope, $state, $cookies, $http, $location) {
    // 显示最大页数
     $scope.bigTotalItems = 0,$scope.bigCurrentPage = 1,$scope.maxSize = 10;//分页数据
     //数据模型
     $scope.isredMode=[{val:0,text:"未读"},{val:1,text:"已读"}];//isRead
     $scope.isHandleMode=[{val:0,text:"未处理"},{val:1,text:"已处理"}];//status
     $scope.MsgtypeMode=[{val:null,text:"===全部==="},{val:0,text:"系统消息"},{val:1,text:"系统通知"},{val:2,text:"系统告警"}];//type
     $scope.MsgstypeMode= [[],[{val:"1",text:"系统通知"},{val:"2",text:"DEV重置通知"},{val:"3",text:"冷库认证通知"},{val:"4",text:"冷库绑定通知"},{val:"5",text:"冷库认证服务商通知"},{val:"6",text:"冷库绑定货主通知"}],[ {val:"1",text:"DEV断线告警"},{val:"2",text:"DEV低电量告警"},{val:"3",text:"DEV配置异常告警"}]];//stype
     //初始化模型
     $scope.isRead=$scope.isredMode[0].val;  
	 $scope.status= $scope.isHandleMode[0].val;// devkey 
	 $scope.type= $scope.MsgtypeMode[0].val;// devkey 
	 $scope.stype= null;// devkey 
	 
    $scope.getSystemInform = function(){
        $http({
            method:'POST',
            url:'/i/systemInform/getSystemInform',
            params:{
                pageNum : $scope.bigCurrentPage,
                pageSize : $scope.maxSize,
                type:$scope.type,
                stype:$scope.stype,
                isRead:$scope.isRead,
                status:$scope.status,
                keyword:$scope.keyword
            }}).success(function (data) {
            $scope.bigTotalItems = data.total;
            $scope.systemInform = data.list;
        });
    };
  
    $scope.getSystemInform();

    $scope.readSystemInform=function (id) {
        $http({
            method:'POST',
            url:'/i/systemInform/getNewSystemInform',
            params:{
                id:id
            }}).success(function (data) {
            $("span[class='count']").html(data.length);
        });
        $scope.getSystemInform();
    };
    $scope.manage=function (id) {
        var r=confirm("确认处理?");
        if (!r) {
            return;
        }
        var option = $("input:checked");
        var checkId="";
        for(var i=0;i<option.length;i++){
            checkId+=option[i].value+",";
        }
        $http({
            method: 'POST',
            url: '/i/systemInform/manageSystemInform',
            params: {
                id: id,
                checkId:checkId
            }
        }).success(function () {
        	 $scope.getSystemInform();
        });
    };
    $scope.pageChanged = function () {
        $scope.getSystemInform();
    };
});
