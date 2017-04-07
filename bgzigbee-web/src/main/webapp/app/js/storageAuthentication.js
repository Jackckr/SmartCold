coldWeb.controller('storageAuthentication', function ($scope, $state, $cookies, $http, $location,$uibModal) {
	$scope.filerType =undefined, $scope.maxSize = 10, $scope.bigTotalItems = 10, $scope.bigCurrentPage = 1;
	$scope.initData = function(){
		if($scope.filerType==""){$scope.filerType=undefined;}
	    $http({method:'POST',url:'/i/rdc/getAllAuthentication',params:{pageNum : $scope.bigCurrentPage,pageSize : $scope.maxSize,keyword:$scope.keyword,description:$scope.filerType}}).success(function (data) {
	    	 $scope.bigTotalItems = data.total;
		     $scope.dataList =data.data;
	    });
	};
	
	 $scope.certifiedRdc = function (rdcid,userid) {
			var r=confirm("确认通过该申请？");
			if(!r){return;}
	        if (rdcid==null||userid==null){
	        	alert("当前申请信息已经失效！");
	            return;
	        } else {
	            $http({method: 'POST', url: '/i/rdc/updateRdcAuth', params: {'rdcId': rdcid,'authUserId': userid } }).success(function (data) {
	                alert(data.message);
	            });
	        }
	 };
	
	
	$scope.zoomPic = function(item){
        var modalInstance = $uibModal.open({
            templateUrl: 'myModelContent.html',  //指向上面创建的视图
            controller: 'ModalInstanceCtrl',// 初始化模态范围
            resolve: {
                itemPic: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) { $scope.selected = selectedItem; }, function () { });
    };
    
    
    
	coldWeb.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, itemPic) { //依赖于modalInstance
	    $scope.itemPic = itemPic;
	    $scope.ok = function () {
	        $uibModalInstance.close(); //关闭并返回当前选项
	    };
	    $scope.cancel = function () {  $uibModalInstance.dismiss('cancel');  };
	});
	$scope.initData();
});