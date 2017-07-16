var app = angular.module('app', []).controller('findPassword', function ($http, $location, $scope) {
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.vsphone = function (telephone) {// 验证手机号码
        var length = (telephone + '').length;
        var mobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
        return telephone && length == 11 && mobile.test(telephone);
    };
    localStorage.goIndex = 1;
    var phoneReg=/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,vifcode=null;
    $scope.vertelephone = function () {// 验证手机号码
        var ct = $scope.vsphone($scope.telephone);
        if (ct) {
            $("#mention1").html("");
        } else {
            $("#mention1").html("手机号格式有误~~");
        }
    };

    $scope.getVerCode = function () {
        if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test($scope.username)){
            layer.open({content: "用户名不能为空并且不能有特殊字符", btn: '确定'});
            return false
        }else if(!/^[a-zA-Z0-9][a-zA-Z0-9]{2,23}$/.test($scope.username)){
            layer.open({content: "用户名不能包含中文和特殊字符，长度不得低于3位~", btn: '确定'});
            return false
        }else{
            if(phoneReg.test($scope.telephone)){
                $('#telNum').attr('readonly','readonly');
                $('#but_vercode').attr('disabled','disabled').css('backgroundColor','#cccccc');
                $.post(ER.root+'/i/user/telephoneSIDVerify',{
                    telephone:$('#telNum').val().trim()
                }, function(data){
                    vifcode=data;
                    layer.open({content: data.message, btn: '确定'});
                });
            }else{
                layer.open({content: "请输入正确的手机号", btn: '确定'});
            }
        }
    };
    $scope.checkData = function ($event) {
        var password = $scope.password;
        var repsword = $scope.password1;
        if (password.length == "") {
            $("#mention1").html("密码不能为空~");
            return false;
        } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)) {
            if (password != repsword) {
                $("#mention1").html("两次密码输入不一致，请重新输入");
                return false;
            } else {
                $("#mention1").html("");1
            }
        } else {
            $("#mention1").html("密码长度6-12位,必须是数字字母组合");
        }
    };
    $scope.savedata = function () {// 修改密码
        if($scope.username==undefined||$scope.telephone==undefined||
            $scope.verrcode==undefined||$scope.password==undefined||
            $scope.password1==undefined){
            layer.open({content: "请完善信息再提交~", btn: '确定'});
            return false
        }
        if($scope.password===$scope.password1){
            if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test($scope.password1)&&/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test($scope.password)){
                $("#mention2").html(""); //防止再次点击
                $.ajax({
                    type: 'POST',
                    data: {
                        username: $scope.username,
                        telephone: $scope.telephone,
                        toke: $scope.verrcode,
                        password: $scope.password,
                        password1: $scope.password1,
                        stoken: vifcode.entity
                    },
                    url: ER.root + "/i/user/resetPwdByUserName",
                    success: function (data) {
                        if (data.success) {
                            layer.open({
                                content: data.message,
                                btn: '确定',
                                yes: function(){
                                    window.location.href = "login.html";
                                }
                            });
                        } else {
                            layer.open({content: data.message, btn: '确定'});
                            $("#mention2").html("修改失败~请稍后重试~");
                        }
                    }
                });
            }else{
                layer.open({content: "密码长度6-12位,必须是数字字母组合", btn: '确定'});
            }
        }else{
            layer.open({content: "两次密码输入不一致，请重新输入", btn: '确定'});
        }
    };
});
