coldWeb.controller('coldStorageAuth', function ($rootScope, $scope, $cookies, $http, $location, $state, $stateParams, Upload) {

    $scope.rdcId = $stateParams.rdcID;

    $scope.totalauthfiles = [];
    $scope.isDisabled = false;

    $scope.addAuthFiles = function (files) {
        if ($scope.totalauthfiles.length + files.length > 1) {
            alert("最多上传1张图片");
            return;
        }
        $scope.totalauthfiles = $scope.totalauthfiles.concat(files);
        var objUrl = getObjectURL(files[0]) ;
        console.log("objUrl = "+objUrl) ;
        if (objUrl) {
            $("#img0").attr("src", objUrl) ;
        }
    }

    $scope.dropauth = function (authfile) {
        angular.forEach($scope.totalauthfiles, function (item, key) {
            if (item == authfile) {
                $scope.totalauthfiles.splice(key, 1);
                $("#img0").removeAttr("src") ;
            }
        })
    }

    //建立一个可存取到该file的url
    function getObjectURL(file) {
        var url = null ;
        if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        } else if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        }
        return url ;
    }

    function checkCommit(){
        if($scope.totalauthfiles.length !== 1)
            return false;
        else
            return true;
    }

    $scope.submit = function () {
        if (checkCommit()) {
            $scope.isDisabled = true;
            var data = {
                authfile0: null,
                rdcId: $stateParams.rdcID
            }
            data["authfile" + 0] = $scope.totalauthfiles[0];

            Upload.upload({
                url: '/i/rdc/authRdc',
                headers: {'Content-Transfer-Encoding': 'utf-8'},
                data: data
            }).then(function (resp) {
                $scope.isDisabled = false;
                alert("提交成功,等待审核");
                $state.go('coldStorageComment', {rdcID: $stateParams.rdcID});
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        } else {
            alert("请上传冷库认证图片再提交!");
        }
    }

});
