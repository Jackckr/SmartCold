/*
* 用户认证】
* js
* jhy
* 2017-07-06
* */

checkLogin();

angular.module('app', ['ngFileUpload']).controller('approve', function ($scope, Upload, $http) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.user=window.user;
    $scope.approve = function ($event) {
        $scope.totalfiles = [];
        var oIndex = $($event.target).index();
        $($event.target).addClass('collectActive').siblings().removeClass('collectActive');
        $(".approveBox").children('.person').eq(oIndex).show().siblings().hide();
    };

    $scope.totalfiles = [];

    $scope.addFiles = function (files) {
        for (var j = 0, fileLen = files.length; j < fileLen; j++) {
            var _file = files[j].name;
            var i = _file.lastIndexOf('.');
            var len = _file.length;
            var extEndName = _file.substring(i + 1, len);
            var extName = "GIF,BMP,JPG,JPEG,PNG";
            //首先对格式进行验证
            if (extName.indexOf(extEndName.toUpperCase()) == -1) {
                layer.open({content: "只能上传" + extName + "格式的文件", btn: '确定'});
                return false
            } else if (files[j].size > 10485760) {
                layer.open({content: "最大只能上传10M的图片", btn: '确定'});
                return false
            }
        }
        if (files.length == 0) {
            return;
        }
        ;
        var allfiles = $scope.totalfiles.concat(files);
        if (allfiles.length > 10) {/*alert("最多选择10张！")*/
            layer.open({content: '最多选择10张哦', btn: '确定'});
            return;
        }
        $scope.totalfiles = allfiles;
    };
/*    $scope.drophonor = function (honorfile) {
        angular.forEach($scope.totalfiles, function (item, key) {
            if (item == honorfile) {
                $scope.totalfiles.splice(key, 1);
                return false;
            }
        });
    };*/
    $scope.idCheck = function () {
        if(!$scope.idCard || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test($scope.idCard)){
            layer.open({content: '身份证号格式错误', btn: '确定'});
            return false
        }
    };
    function checkSubmit(userFlag){
        if(userFlag==1){//个人
            if(!$scope.realName){
                layer.open({content: '请输入真实姓名', btn: '确定'});
                return false
            }
            $scope.idCheck();
            if(!$scope.totalfiles){
                layer.open({content: '请上传身份证正面照', btn: '确定'});
                return false
            }
        }else{//企业
            if(!$scope.companyName){
                layer.open({content: '请输入企业名称', btn: '确定'});
                return false
            }
            if(!$scope.totalfiles){
                layer.open({content: '请上传营业执照', btn: '确定'});
                return false
            }
        }
        return true
    }
    $scope.submitOwner = function (userFlag) {
        if (checkSubmit(userFlag)) {
            var company='';
            if(userFlag==1){//个人
                company=null;
            }else{//企业
                company=$scope.companyName;
                $scope.idCard=null;
                $scope.realName=null;
            }
            var simdata = {
                id:$scope.user.id,
                idCard:$scope.idCard,
                realname:$scope.realName,
                type:userFlag,
                companyName:company
            };
            var sdata = JSON.stringify(simdata);
            var data = {data: sdata, "authfile": $scope.totalfiles};
            Upload.upload({
                url: ER.root + "/i/user/attestationUser",
                headers: {'Content-Transfer-Encoding': 'utf-8'},
                data: data
            }).then(function (resp) {
                layer.closeAll();
                layer.open({
                    content: resp.data.message
                    , btn: '确定'
                    , shadeClose: false
                    , yes: function () {
                        if (data != null && data != undefined)
                            checktoken();
                            window.location.href = "usercenter.html";
                    }
                });
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        }
        else {
            //alert("请填写标记*的必选项在提交!");
            layer.open({content: '信息未填完整~', btn: '确定'});
        }
    };
});

