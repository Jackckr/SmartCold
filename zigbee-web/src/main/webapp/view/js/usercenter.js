var $form, form, $, oFile;

function changePic(em) {
    oFile = $(em)[0].files[0];
    var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
    var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
    if (!rFilter.test(oFile.type)) {
        layer.open({content: "格式错误~请选择格式为" + msg + "的图片~", btn: '确定'});
        return;
    } else if (oFile.size > 10485760) {
        layer.open({content: "最大只能上传10M的图片", btn: '确定'});
        return;
    }
    var oImage = document.getElementById("headerPic");
    var oReader = new FileReader();
    oReader.onload = function (e) {
        oImage.src = e.target.result;
    };
    oReader.readAsDataURL(oFile);
}
function initUpdatePhone() {
    $("#oldPhone").val(window.lkuser.telephone).attr('readonly', 'readonly');
}
function initForm() {
    $.ajax({
        url: "/i/user/findUserById", type: "post", data: {"userId": window.lkuser.id}, success: function (data) {
            getDataToForm($("#userInfo [name]").not("[name=sex]"), data);
            var sex = data.sex;
            $("input[name=sex][checked=checked]").attr("checked", false);
            $("input[name=sex][value=" + sex + "]").attr("checked", "checked");
            $("#headerPic,#headPic").attr('src', data.avatar);
            $("#rightUserName").html(data.username);
            form.render();
            $.ajax({
                url: "/i/user/isSubmitAuditUser",
                type: "post",
                data: {"userId": window.lkuser.id},
                success: function (result) {
                    if (result.status <= 0) {
                        $("#auditStatus").html('<a href="authentication.html"><i class="iconfont">&#xe647;</i><span>去认证</span></a>');
                    }
                    if (result.status == 1) {
                        $("#auditStatus").html('<a href="#"><i class="iconfont">&#xe647;</i><span>已认证</span></a>');
                    }
                    if (result.status == 2) {
                        $("#auditStatus").html('<a href="#"><i class="iconfont">&#xe647;</i><span>审核中</span></a>');
                    }
                }
            });
        }
    });
}
function getCode(type) {
    var phoneRex = /^1[34578]\d{9}$/;
    var phone = type == 1 ? $("#oldPhone").val().trim() : $("#newPhone").val().trim();
    if (!phoneRex.test(phone)) {
        layer.open({content: "请输入正确格式的手机号！", btn: '确定'});
        return;
    }
    if (type == 1) {
        $('#oldPhone').attr('readonly', 'readonly');
        $('#oldPhoneBtn').attr('disabled', 'disabled').css('backgroundColor', '#cccccc');
    } else {
        if ($("#newPhone").val().trim() == $("#oldPhone").val().trim()) {
            layer.open({content: "新手机号不能与旧手机号相同！", btn: '确定'});
            return;
        }
        if (window.oldCode != $("#oldCode").val()) {
            layer.open({content: "验证码输入有误！", btn: '确定'});
            return;
        }
        $('#newPhone,#oldCode').attr('readonly', 'readonly');
        $('#newPhoneBtn').attr('disabled', 'disabled').css('backgroundColor', '#cccccc');
    }
    $.ajax({
        url: "/i/user/telephoneSIDVerify", type: "post", data: {telephone: phone}, success: function (data) {
            if (data.success) {
                var code = getVailCode(data.entity);
                type == 1 ? window.oldCode = code : window.newCode = code;
                window.stoken = data.entity;
                layer.open({content: data.message, btn: '确定'});
            }
        }
    });
}
function updateTelephone() {
    if (window.newCode != $("#newCode").val()) {
        layer.open({content: "验证码输入有误！", btn: '确定'});
        return;
    }
    $.ajax({
        url: "/i/user/resetPhoneById",
        type: "post",
        data: {
            telephone: $("#newPhone").val().trim(),
            id: window.lkuser.id,
            toke: $("#newCode").val(),
            stoken: window.stoken
        },
        success: function (data) {
            layer.open({content: "保存成功！", btn: '确定',yes:function () {
               // flushUser(window.lkuser.id);
                window.location.reload();
            }});
        }
    });
}
function check(ckolpwd) {
    if (ckolpwd) {
        var password = $("#new_password").val().trim();
        var repsword = $("#new_repassword").val().trim();
        if (password.length == "") {
            layer.open({content: "密码不能为空~", btn: '确定'});
            return false;
        } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)) {
            if (password != repsword) {
                layer.open({content: "两次密码输入不一致，请重新输入", btn: '确定'});
                return false;
            }
        } else {
            layer.open({content: "密码长度6-12位,必须是数字字母组合", btn: '确定'});
            return false;
        }
    } else {
        layer.open({content: "旧密码输入有误，请重新输入", btn: '确定'});
        return false;
    }
    return true;
}
function updatePwd() {
    $.ajax({
        url: "/i/user/checkOldPassword",
        type: "post",
        data: {pwd: $("#old_password").val().trim()},
        success: function (data) {
            var check2 = check(data);
            if (check2) {
                var formdata = new FormData();
                formdata.append("id", window.lkuser.id);
                formdata.append("password", $("#new_password").val().trim());
                $.ajax({
                    type: 'POST',
                    url:"/i/user/updateUser",
                    data: formdata, processData: false, contentType: false,
                    success: function (data) {
                        if (!data) {/* alert("修改失败~请稍后重试~"); */
                            layer.open({content: '修改失败~请稍后重试~~', btn: '确定'});
                        } else {
                            layer.open({content: '修改成功!请重新登录', btn: '确定',yes:function () {
                                logout();
                                window.location.href="login.html";
                            }});
                        }
                    }
                });
            }
        }
    });
}
function saveUser() {
    var formData = new FormData();
    var serializeArray = $("#userInfo").serializeArray();
    $.each(serializeArray, function (index, item) {
        formData.append(item.name, item.value);
    });
    formData.append("fileData", oFile);
    $.ajax({
        type: 'POST',
        url: "/i/user/updateUser",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            layer.open({content: "保存成功！", btn: '确定',yes:function () {
                window.lkuser = data;
                window.sessionStorage.lkuser = JSON.stringify(data);
                window.sessionStorage.longtime = new Date().getTime();
                $("#loginUser").find('img').attr({'src': data.avatar, 'title': data.username});
                window.location.reload();
            }});
        }
    });
}
/*公用声明*/
var pageCurrent = 1;
    pagination={pageCount:-1,oldPageCount:-1},
    urlArry=['/i/rdc/deleteByRdcID','/i/ShareRdcController/delShareInfoByUid','/i/ShareRdcController/delShareInfoByUid','/i/collect/delCollectById'],//0:冷库删除，1：c出租求租删除，2：货源删除，3：收藏取消
    rentDate=['','1个月以下','1~3个月','3~6个月','6~9个月','1年以上','两年以上','三年以上','五年以上'],
    oUnit=['吨','Kg','吨'];
//删除或者分页局部刷新js
function initFn(i,flag) {//这个i  代表分页div的ID
    if(i==0){//冷库
        getRdcList();
    }else if(i==1){//出租datatype,page,domId
        getShareList(3,1,1);
    }else if(i==2){//出售datatype：1,page：2：,domId：2
        getShareList(1,2,2);
    }else{//收藏
        if(flag==0){
            getCollectList(0,3,3);
        }else{
            getCollectList(1,4,4);
        }

    }
}
//公用分页组件
function changePage(i) {//冷库#page0,出租#page1,出售#page2,收藏冷库#page3,收藏需求#page4
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
            , layer = layui.layer;
        laypage({
            cont: $("#page"+i)
            , pages: pagination.pageCount
            ,jump: function (obj,first) {
                pageCurrent = obj.curr;
                pagination.oldPageCount = pagination.pageCount;
                if(first!=true){
                    initFn(i);
                    window.scroll(0,0);//跳到顶部
                }
            }
        });
    });
}
//公用删除js
function deleteData(id,i,flag){//flag转为收藏而设立
    layer.confirm('删除该条数据？', {
        btn: ['确定','取消'] //按钮
    }, function(){//yes
        $.ajax({
            type: "POST",
            url:urlArry[i],
            data: {rdcID:id,id:id,collectId:id,uid:window.lkuser.id},
            success: function(data){
                if(data.status == 0 || data.success || data.status == 1){
                    data.message==undefined?messages='恭喜你，删除成功~':messages=data.message;
                    layer.msg(messages, {icon: 1,time: 1000});
                    initFn(i,flag);
                }else{
                    if(i==3){
                        layer.msg('取消失败，请稍后重试', {icon: 7,time: 1000});//1.0秒关闭
                    }else{
                        layer.msg('删除失败，请稍后重试', {icon: 7,time: 1000});
                    }
                }
              //  layer.closeAll();
            }
        });

    }, function(){//no
        //layer.closeAll();
    });
}
//出租出售公用js
function getShareList(datatype, pageId, domId) {
    var oList = [];
    $.get('/i/ShareRdcController/newGetSEListByUID',
        {
            userID: window.lkuser.id,
            username: window.lkuser.name,
            dataType: datatype,
            pageNum: pageCurrent,
            pageSize: 10
        }, function (req) {
            if (req.success) {
                pagination.pageCount = req.totalPages;
                if (pagination.pageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                    changePage(pageId);
                }
                var data = req.data;
                $.each(data, function (index, item) {
                    var deleteI=null;
                    deleteI=item.dataType==1?2:1;
                    oList.push(['<li><div class="oImg fl"><img src="' , item.logo , '" alt="图片跑丢了~"></div>',
                        '<div class="oTxt fl"><h2 class="omg"><a class="blue" onclick="location.href=\'rdcmatchinfo.html?id=',item.id,'\'">[' , item.typeText , ']' ,item.title , '</a></h2>' ,
                        '<h4 class="omg"><i class="iconfont orange">&#xe61c;</i>', item.detlAddress , '</h4>' ,
                        '<p class="omg">' , item.updatetime.substr(0,19) , '</p><div class="txt-right">' ,
                        '<button class="layui-btn layui-btn-normal layui-btn-small" onclick="location.href=\'rdcmatchinfo.html?id=',item.id,'\'">查看</button>',
                        '<button class="layui-btn layui-btn-small" onclick="goRentRdc(',item.id,',',item.typeCode,',',item.dataType,')">修改</button>' ,
                        '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteData(' , item.id ,',' ,deleteI , ')">删除</button></div></div></li>'].join(""));
                });
                if(oList.length){
                    $("#sharelist"+domId).empty().append(oList.join(''));
                }else{
                    $("#sharelist"+domId).empty().append('<li class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></li>');
                }

            } else {
                layer.alert(req.message, {
                    icon: 6,
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 0
                }, function (index) {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                    layer.close(index);
                });
            }
        });
}


/*进入修改冷库发布页面*/
function goRentRdc(id,typeCode,dataType) {
    sessionStorage.submitRdcStatus=1;
    if(typeCode==1&&dataType==3){
        window.location.href='rdcrelease.html?shareId='+id;
    }else if(typeCode==2&&dataType==3){
        window.location.href='applyrent.html?shareId='+id;
    }else if(typeCode==1&&dataType==1){
        window.location.href='salegoods.html?shareId='+id;
    }else {
        window.location.href='applygoods.html?shareId='+id;
    }
}
/**
*
* 我的冷库列表
*
* */
function getRdcList() {
    var rdcList = [];
    window.sessionStorage.submitRdcStatus=1;//进入修改页面
    $.get('/i/rdc/findRDCDTOByUserId',
        {
            userID: window.lkuser.id,
            keyword: $(".rdcSearch input").val().trim(),
            pageNum: pageCurrent,
            pageSize: 10
        }, function (data) {
            pagination.pageCount = data.totalPages;
            if (pagination.pageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                changePage(0);
            }
            var rdc = data.data;
            $.each(rdc, function (index, item) {
                rdcList.push('<li><div class="oImg fl"><img src="'+item.logo+'" alt=""></div>',
                    '<div class="oTxt fl"><h2 class="omg"><a class="blue" href="rdcinfo.html?rdcId='+item.id + '">'+ item.name+'</a></h2>' ,
                    '<h4 class="omg"><i class="iconfont orange">&#xe61c;</i>'+item.address+'</h4>' ,
                    '<p class="omg">' + formatDateTime(item.addtime) + '</p><div class="txt-right">' ,
                    '<button class="layui-btn layui-btn-normal layui-btn-small" onclick="location.href=\'rdcinfo.html?rdcId='+item.id+'\'">查看</button>' ,
                    '<button class="layui-btn layui-btn-small" onclick="location.href=\'rdcaddcold.html?rdcId='+item.id+'\'">修改</button>' ,
                    '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteData('+item.id+','+0+')">删除</button></div></div></li>')
            });
            if(rdcList.length){
                $("#rdcList").empty().append(rdcList.join(''));
            }else{
                $("#rdcList").empty().append('<li class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></li>');
            }
    });
}
function search() {//搜索
    pageCurrent=1;
    getRdcList();
}


/*
*
* 我的收藏
*
* */
var collectUrl = ['/i/collect/getCollectRdc','/i/collect/getCollectShared'];
function getCollectList(flag,pageId,domId){
    var collectList = [];
    $.get(collectUrl[flag],
        {
            uid: window.lkuser.id,
            pageNum: pageCurrent,
            pageSize: 10
        }, function (data) {
            pagination.pageCount = data.pages;
            if (pagination.pageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                changePage(pageId);
            }
            var data = data.list;
            if(flag==0){//收藏冷库
                $.each(data, function (index, item) {
                    var itemlist = item.rdcEntity;
                    if(itemlist){
                        collectList.push('<li><div class="oImg fl"><img src="'+itemlist.logo + '" alt=""></div>' ,
                            '<div class="oTxt fl"><h2 class="omg"><a class="blue" href="rdcinfo.html?rdcId='+ itemlist.id + '">' + itemlist.name + '</a></h2>' ,
                            '<h4 class="omg"><i class="iconfont orange">&#xe61c;</i>' + itemlist.address + '</h4>' ,
                            '<p class="omg">' + formatDateTime(itemlist.addtime)+ '</p><div class="txt-right">' ,
                            '<button class="layui-btn layui-btn-normal layui-btn-small" onclick="location.href=\'rdcinfo.html?rdcId='+itemlist.id+'\'">查看</button>' ,
                            '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteData('+item.id+','+3+','+flag+')">取消收藏</button></div></div></li>')
                    }else{
                        collectList.push('<li><div class="oImg fl"><img src="http://139.196.189.93:8089/app/rdcHeader.jpg" alt=""></div>' ,
                            '<div class="oTxt fl"><h2 class="omg"><a class="blue">该条内容已被删除~</a></h2>' ,
                            '<h4 class="omg"></h4><p class="omg"></p><div class="txt-right">' ,
                            '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteData('+item.id+','+3,','+flag+')">取消收藏</button></div></div></li>')
                    }
                });
            }else{//收藏需求匹配
                $.each(data, function (index, item) {
                    var itemlist = item.rdcShareDTO;
                    if(itemlist){
                        collectList.push('<li><div class="oImg fl"><img src="' +itemlist.logo + '" alt="图片跑丢了~"></div>' ,
                            '<div class="oTxt fl"><h2 class="omg"><a class="blue" onclick="location.href=\'rdcmatchinfo.html?id='+itemlist.id+'\'">' ,
                            '[' + itemlist.typeText + ']'+ itemlist.title + '</a></h2>' ,
                            '<h4 class="omg"><i class="iconfont orange">&#xe61c;</i>' + itemlist.detlAddress + '</h4>' ,
                            '<p class="omg">' +itemlist.validEndTime + '</p><div class="txt-right">' ,
                            '<button class="layui-btn layui-btn-normal layui-btn-small" onclick="location.href=\'rdcmatchinfo.html?id='+itemlist.id+'\'">查看</button>' ,
                            '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteData('+item.id+','+3+','+flag+')">取消收藏</button></div></div></li>')
                    }else{
                        collectList.push('<li><div class="oImg fl"><img src="http://139.196.189.93:8089/app/rdcHeader.jpg" alt=""></div>' ,
                            '<div class="oTxt fl"><h2 class="omg"><a class="blue">该条内容已被删除~</a></h2>' ,
                            '<h4 class="omg"></h4><p class="omg"></p><div class="txt-right">' ,
                            '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteData('+item.id+','+3+','+flag+')">取消收藏</button></div></div></li>')
                    }

                });
            }
            if(collectList.length){
                $("#sharelist"+domId).empty().append(collectList.join(''));
            }else{
                $("#sharelist"+domId).empty().append('<li class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></li>');
            }
        });
}
layui.use(['jquery', 'form', 'element'], function () {
    var element = layui.element();
    $ = layui.jquery;
    form = layui.form();
    $form = $('form');
    localStorage.OURL=document.URL;
    checkLogin(1, null);
    $("#reset").bind("click", function () {
        initForm();
    });
    $('.tabNav>li').click(function () {
        $("#headPic").attr('src', lkuser.avatar);
        pageCurrent = 1;pagination={pageCount:-1,oldPageCount:-1};
        var oIndex = $(this).index();
        localStorage.liIndex=oIndex;
        $(this).addClass('current').siblings('li').removeClass('current');
        $(".userInfo>li").eq(oIndex).show().siblings('li').hide();
        switch(oIndex)
        {
        case 0://个人信息
            initForm();
            break;
        case 1://我的冷库
            getRdcList();
            break;
        case 2://出租求租
            getShareList(3,1,1);
            break;
        case 3://出售求购
            getShareList(1,2,2);
            break;
        case 4://收藏
            getCollectList(0,3,3);
            break;
        default:
            return
        }
    });
    var hash = location.hash;
    if(localStorage.liIndex&&hash){
        $("#headPic").attr('src', lkuser.avatar);
        pageCurrent = 1;pagination={pageCount:-1,oldPageCount:-1};
        $(".tabNav li").eq(localStorage.liIndex).addClass('current').siblings('li').removeClass('current');
        $(".userInfo>li").eq(localStorage.liIndex).show().siblings('li').hide();
        if(hash=='#user'||hash==''){
            initForm();
        }else if(hash=='#myRdc'){
            getRdcList();
        }else if(hash=='#rent'){
            getShareList(3,1,1);
        }else if(hash=='#goods'){
            getShareList(1,2,2);
        }else if(hash=='#collect'){
            getCollectList(0,3,3);
        }
    }else{
        initForm();
    }
});
