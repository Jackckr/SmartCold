coldWeb.controller('coldStorageHonorAudit', function ($rootScope, $scope, $state, $cookies, $http, $stateParams, $uibModal, $log) {

    $scope.rdcId = $stateParams.rdcId;
    $scope.submitButtonDisable = false;
    $scope.selected = [];
    $scope.selectedTags = [];

    $http.get('/i/rdc/findAllColdStorageHonor').success(function (data) {
        $scope.honorList = data;
    });

    $http.get('/i/rdc/findRDCDTOByRDCId', {
        params: {
            "rdcID": $scope.rdcId
        }
    }).success(function (data) {
        $scope.name = data[0].name;
        $scope.honorPicShow = data[0].honorPics;
    });

    var updateSelected = function (action, id, name) {
        if (action == 'add' && $scope.selected.indexOf(id) == -1) {
            $scope.selected.push(id);
            $scope.selectedTags.push(name);
        }
        if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
            var idx = $scope.selected.indexOf(id);
            $scope.selected.splice(idx, 1);
            $scope.selectedTags.splice(idx, 1);
        }
    }

    $scope.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id, checkbox.name);
    }

    $scope.isSelected = function (id) {
        return $scope.selected.indexOf(id) >= 0;
    }

    $scope.returnAudit = function(){
        $state.go('coldStorageAudit', {"rdcID": $scope.rdcId});
    }

    $scope.submit = function () {
        $scope.submitButtonDisable = true;
        $http({
            method: 'POST',
            url: '/i/rdc/updateHonorPic',
            params: {
                'rdcId': $scope.rdcId,
                'honorPic': $scope.selected
            }
        }).success(function (data) {
            alert(data.message);
            $state.go('coldStorageAudit', {"rdcID": $scope.rdcId});
        });
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