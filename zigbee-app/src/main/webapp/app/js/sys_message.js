checkLogin();
var app = angular.module('message', []);
app.controller('message', function($scope, $location, $http, $rootScope){
    $scope.user = user;
    $http.defaults.withCredentials=true;
    $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
    $.ajax({ url: ER.root+"/i/UtilController/setVisited",type: "POST",data:{type:11}});
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    $scope.ischeck=true;
    $scope.prev=0;
    $scope.flag = true;
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var rootRdcId = $.getUrlParam('storageID');

    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + user.id).success(function (data) {

        if (data && data.length > 0) {
            $scope.storages = data;
            if (!rootRdcId) {
                if (localStorage.rdcId) {
                    $scope.rdcId=localStorage.rdcId;
                    findByRdcId(localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                }
            } else {
                findByRdcId(rootRdcId);
                $scope.rdcId=rootRdcId;

            }
            $scope.notReadMessage = $rootScope.notReadMessage;
            $scope.modestate = ['待处理', '已处理'];
            $scope.modestate[-1]="已拒绝";
            $scope.params = {
                userId: user.id,utype: user.type,rdcId: $scope.rdcId,
                type: null,stype: null,isRead: null,status: null,
                page: 1,rows: 10,total: 0,totalPages: 0
            };


            /*
             *无线加载消息列表.
             */
           /* $scope.goScoll = function(){
                var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//隐藏的高度
                localStorage.list_sys=JSON.stringify({totalPages:$scope.params.totalPages,currentPage:$scope.params.page,html:$("#loadList").html(),scrollHeight:scrollHeight});
                alert(localStorage.list_sys);
                event.stopPropagation();
            };*/

            $scope.loadObj = function(value) {
                $scope.value = value;
                var oList =[
                    '<div class="sysInfo" ng-click="goScoll()">'+
                    '<a ng-click="showmsg($index)"><p class="clearfix"><label class="check_icon on fl editSys black" >'+
                    '<input type="checkbox"><i class="iconfont"></i></label>'+
                    '<b class="fl">'+$scope.value.title+'</b>'+
                    '<span class="fr">'+$scope.modestate[value.state]+'</span>'+
                    '<p>'+$scope.value.message+'</p>'+
                    '<p class="msgTime">'+$scope.value.addTime+'</p></a></div>'];
                return oList.join("");
            }

            /*var isLoadRB=false;

            $scope.ajaxObj = function () {
                isLoadRB=true;
                $http({method: 'POST', url: ER.coldroot + '/i/messageRecord/getMessageList', params: $scope.params}).success(function (data) {
                    $scope.params.totalPages=data.totalPages;
                    $scope.params.page++;
                    var ohtml=[];
                    $.each(data.data, function(index, item) {
                        ohtml.push($scope.loadObj(item));
                    });
                    $("#loadList").append(ohtml);
                    isLoadRB=false;
                });
            }
            $scope.initData = function(){//启用无限加载
                if(localStorage.list_sys){
                    var  cachdata=JSON.parse(localStorage.list_sys);
                    $scope.params.totalPages=parseInt(cachdata.totalPages);
                    $scope.params.page= parseInt(cachdata.currentPage);
                    $("#loadList").html(cachdata.html);
                    $(document).scrollTop(	cachdata.scrollHeight );
                }else{
                    $scope.ajaxObj();
                }

            };*/
            //
            /*
             *
             * 无线加载消息列表end
             *
             * */

            $scope.changType = function (type, em) {
                $scope.params.type = type;
                $scope.initmsg();
            };
            $scope.changsType = function (stype, em) {
                $scope.params.stype = stype;
                $scope.initmsg();
            };
            $scope.changstatus = function (status, em) {
                //$scope.ajaxObj();
                $scope.initmsg();
                $scope.prev=1;
                $scope.params.status = status;
            };
            $scope.allmsg = function (em) {
                //$scope.initData();
                $scope.initmsg();
                $scope.prev=1;
                $scope.params.type = null, $scope.params.stype = null, $scope.params.isRead = null, $scope.params.status = null, $scope.params.page = 1, $scope.params.rows = 10;
            };

            $scope.initmsg = function () {
                $http({method: 'POST', url: ER.coldroot + '/i/messageRecord/getMessageList', params: $scope.params}).success(function (data) {
                    $rootScope.msgList = data.data;
                });
            };

            $scope.showmsg = function (idex) {
                $scope.currmsg = $rootScope.msgList[idex];
                if ($scope.currmsg.state == 1 || $scope.currmsg.state == -1) {
                    alert("该条内容您已处理完毕了~")
                    return
                }
                $(".sysModal").fadeIn();
                event.stopPropagation();
            };
            //同意
            $scope.agree = function () {
                var str = [], oid = "";
                if ($scope.currmsg.sType == 1) {
                    $("#ul_storage input[type='checkbox']:checked").each(function () {
                        str.push($(this).val());
                    });
                    if (str.length == 0) {
                        alert("请选择授权的冷库！");
                        return
                    } else {
                        oid = str.toString();
                    }
                }
                $http({
                    method: 'POST',
                    url: ER.coldroot + '/i/authenUser/authorUserByRdcId',
                    params: {
                        id: $scope.currmsg.id,
                        userId: $scope.currmsg.uid,
                        stype: $scope.currmsg.sType,
                        rdcId: $scope.currmsg.rdcId,
                        status: 1,
                        oids: oid
                    }
                }).success(function (data) {
                    $scope.initmsg();
                    $(".sysModal").hide();
                });
            };
            //拒絕
            $scope.refuse = function () {
                $http({
                    method: 'POST',
                    url: ER.coldroot + '/i/authenUser/authorUserByRdcId',
                    params: {
                        id: $scope.currmsg.id,
                        userId: $scope.currmsg.uid,
                        stype: $scope.currmsg.sType,
                        rdcId: $scope.currmsg.rdcId,
                        status: -1,
                        oids: ""
                    }
                }).success(function (data) {
                    $scope.initmsg();
                    $(".sysModal").hide();
                });
            };
            $scope.off = function () {
                $(".sysModal").fadeOut();
            };

            $scope.initmsg();

        }
    });

    function findByRdcId(rdcId) {
        $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rdcId).success(function (data) {
            $scope.currentRdc = data[0];
            $scope.rdcName = data[0].name;
            rootRdcId = data[0].id;
            $scope.viewStorage($scope.rdcId);
        });
    }

    $scope.viewStorage = function (rdcId) {
        localStorage.rdcId = $scope.rdcId;
        $scope.rdcId = rdcId;
        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
            }
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    };
    $scope.searchRdcs = function (searchContent) {
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?type=1&filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                    $('.searchTop').show();
                }
            });
        }
    };
    $scope.changeRdc = function (rdc) {
        $scope.rdcId= rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.viewStorage(rdc.id);
        window.location.reload()
    };
    $scope.goprev = function () {
        $scope.prev=0;
        $('.myedit').html("编辑");
        $(".editSys,.checkAll").hide();
        $scope.flag = true;
    }
    $scope.edit = function (em) {
        if($scope.flag){
            em.target.innerHTML="完成";
            $(".editSys,.checkAll").show();
            $scope.flag = false;
        }else{
            em.target.innerHTML="编辑";
            $(".editSys,.checkAll").hide();
            $scope.flag = true;
        }

    }
});

$(function () {
    /*rdc下拉列表*/
    $(".transion").click(function(){
        $(".one").hide();
        $(".two").show();
        $('.search input').focus()
    });
    $(".cancel").click(function(){
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    });
    $("#searchDara_div input").keyup(function(){
        $('.searchTop').show()
    })
    $(".rdcList li").click(function(){
        $('.searchTop').hide();
        $(".one").children('.txt').text($(this).children('span').html())
        $(".one").show();
        $(".two").hide();
    });

    /*rdc下拉列表*/
})
