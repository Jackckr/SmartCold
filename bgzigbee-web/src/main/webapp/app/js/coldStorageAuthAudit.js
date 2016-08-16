coldWeb.controller('coldStorageAuthAudit', function ($rootScope, $scope, $state, $cookies, $http, $stateParams, $uibModal, $log) {

    $scope.rdcId = $stateParams.rdcId;
    $scope.authUserId = undefined;

        $http.get('/i/rdc/findRDCDTOByRDCId', {
        params: {
            "rdcID": $scope.rdcId
        }
    }).success(function (data) {
        $scope.name = data[0].name;
                $scope.authPicShow = data[0].authPics;
    });

    $scope.returnStorageManage = function(){
        $state.go('coldStoragelist', {});
    }

    $scope.updateSelected = function(userId){
        $scope.authUserId = userId;
    }

    $scope.submit = function () {
        if ($scope.authUserId == undefined){
            alert("必须选择一个用户的认证,才能提交审核!");
        } else {
            $http({
                method: 'POST',
                url: '/i/rdc/updateRdcAuth',
                params: {
                    'rdcId': $scope.rdcId,
                    'authUserId': $scope.authUserId
                }
            }).success(function (data) {
                alert(data.message);
                $state.go('coldStoragelist', {});
            });
        }
    }

    $scope.zoomPic = function(item){
        var modalInstance = $uibModal.open({
            templateUrl: 'myModelContent.html',  //指向上面创建的视图
            controller: 'ModalInstanceCtrl',// 初始化模态范围
            resolve: {
                itemPic: function () {
                    return item;
                }
            }
        })
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date())
        })
    }

});

coldWeb.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, itemPic) { //依赖于modalInstance
    $scope.itemPic = itemPic;
    $scope.ok = function () {
        $uibModalInstance.close(); //关闭并返回当前选项
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel'); // 退出
    }

})