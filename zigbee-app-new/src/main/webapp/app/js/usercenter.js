var app = angular.module('app', []);
app.controller('usercl', function ($http, $location, $scope) {
    $scope.user = window.user;
    localStorage.usercenter = 'usercenter';
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.initdata = function () {
        if (window.user != null) {
            checktoken(null, true);
            $scope.userinfo = window.user;
            $scope.usernameObj=($scope.userinfo.username=='' || $scope.userinfo.username == undefined)?$scope.userinfo.nickname:$scope.userinfo.username;
            $http.get(ER.root + "/i/user/isSubmitAuditUser", {params: {userId: window.user.id}}).success(function (data) {
                //返回值 // -1：未通过   // 0：未审核过   // 1：已通过   // 2：审核中
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.user = window.user;
                        $scope.checkState = data.status;
                    });
                }, 200);
            });
            return;
        };
    };
    $scope.initdata();
    $("#headImg").change(function () {
        util.setimg(this, 'user_img');
        var value = $("input[type='file']")[0].files[0];
        $scope.savedata("fileData", value);
    });
    $scope.loginout = function () {
        $http.get(ER.root + '/i/user/logout');
        $scope.user = window.user = null;
        util.delCookie("token");
        localStorage.clear();
        window.location.reload()
    };
    $scope.savedata = function (name, value) {
        var formdata = new FormData();
        formdata.append(name, value);
        formdata.append("id", $scope.userinfo.id);
        $.ajax({
            type: 'POST',
            url: ER.root + "/i/user/updateUser",
            data: formdata,
            processData: false,
            contentType: false,
            success: function (data) {
                if (!data) {
                    alert("修改失败咯，请稍后重试吧~");
                }
                else {
                    window.localStorage.lkuser = JSON.stringify(data);
                }
            }
        });
    };
});

	



