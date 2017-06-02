checkLogin();
var myApp = angular.module('app', ['ngFileUpload']);
myApp.controller('coldRole',function ($scope, $http, Upload) {
    $scope.totalauthfiles = [];
    //$scope.rdcList=0;
	$scope.user = user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.step = 1;
    /*
    * 分步加载模块
    */
    $scope.goStep1 = function () {
        $scope.step = 1;
    };
    $scope.goStep2 = function (type) {
        $scope.user.type=type;
        if (type!=0){
            $scope.selImgFlag=true;
        }else {
            $scope.selImgFlag=false;
        }
        $scope.step = 2;
    };
    $scope.goStep3 = function () {
        var flag=true;
        if(!$scope.rdcId){
            flag=false;
        }
        if($scope.user.type==0&&$scope.totalauthfiles.length==0){
            flag=false;
        }
        if (flag){
            var data = {
                rdcId:$scope.rdcId,
                type:$scope.user.type,
                userId:$scope.user.id,
                userName:$scope.user.username
            };
            if($scope.user.type==0){
                data.authfile = $scope.totalauthfiles[0];
            }
            Upload.upload({
                data: data,
                url: ER.coldroot+'/i/authenUser/attestationRdc',
                headers: {'Content-Transfer-Encoding': 'utf-8'}
            }).then(function (resp) {
                $scope.isDisabled = false;
                $("#auCode").html(resp.data.message);
            });
            $scope.step = 3;
        }else {
            alert("请完善冷库认证信息！");
        }
    };
    $scope.goStep4 = function () {
        $scope.step = 4;
        $scope.searchRdcs('');
    };
    $scope.cancel = function () {
        $(".searchTop").hide();
        $scope.step = 2;
    };
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
        }
    });
    $scope.searchRdcs = function (searchContent) {
        $(".searchTop").show();
        $http.get(ER.coldroot + '/i/rdc/getRdcByName?keywords=' + searchContent).success(function (data) {
            $scope.storages = data;
            if (data && data.length > 0) {
                $scope.rdcList=0;
            }else{
                $scope.rdcList=1;
            }
        });
    };
    $scope.addAuthFiles = function (files) {
        for(var j=0,fileLen=files.length;j<fileLen;j++){
            var _file=files[j].name;
            var i=_file.lastIndexOf('.');
            var len=_file.length;
            var extEndName=_file.substring(i+1, len);
            var extName="GIF,BMP,JPG,JPEG,PNG";
            //首先对格式进行验证
            if(extName.indexOf(extEndName.toUpperCase())==-1) {
                alert("只能上传"+extName+"格式的文件");
                return false;
            }else if(files[j].size > 10485760){
                alert("最大只能上传10M的图片");
                return false;
            }else{
                if ($scope.totalauthfiles.length + files.length > 1) {
                    $scope.totalauthfiles = [];
                }
                $scope.totalauthfiles = $scope.totalauthfiles.concat(files);
            }
        }
    };
    $scope.dropauth = function (authfile) {
        angular.forEach($scope.totalauthfiles, function (item, key) {
            if (item == authfile) {
                $scope.totalauthfiles.splice(key, 1);
                return false;
            }
        })
    }
    $scope.changeRdc = function (rdc) {
        $(".searchTop").hide();
        $scope.step = 2;
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.text;
        $scope.searchContent = "";
    };
});
