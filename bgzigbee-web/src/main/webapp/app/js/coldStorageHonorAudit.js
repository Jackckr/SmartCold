coldWeb.controller('coldStorageHonorAudit', function ($rootScope, $scope, $state, $cookies, $http, $stateParams) {

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
        console.log($scope.selected);
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
});