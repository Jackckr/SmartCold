var $form;
var form;
var $;
var oFile;
/**
*
* 个人信息
 *
* */
/*获得所有的省市*/
function getProvinceList() {
    var provinceList = [];
    /*$.ajax({
        url: "/i/city/findProvinceList", type: "get", success: function (data) {
            provinceList.push('<option value=""></option>');
            supportForeach();
            data.forEach(function (val, index) {
                provinceList.push('<option value="' + val.provinceId + '">' + val.provinceName + '</option>');
            });
            $form.find('#hometownid').append(provinceList.join(''));
            $form.find('#addressid').append(provinceList.join(''));
            form.render();
            initForm();
        }
    });*/
    form.render();
    initForm();
}
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
                //flushUser (window.lkuser.id);
                window.location.reload();
            }});
        }
    });
}
var pageCurrent = 1;
var pagination={pageCount:-1,oldPageCount:-1};
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
                changePage();
            }
            var rdc = data.data;
            $.each(rdc, function (index, item) {
                rdcList.push('<li><div class="oImg fl"><img src="' + item.logo + '" alt=""></div>' +
                    '<div class="oTxt fl"><h2 class="omg"><a class="blue" href="rdcinfo.html?rdcId=' + item.id + '">' + item.name + '</a></h2>' +
                    '<h4 class="omg"><i class="iconfont orange">&#xe61c;</i>' + item.address + '</h4>' +
                    '<p class="omg">' + item.addtime + '</p><div class="txt-right">' +
                    '<button class="layui-btn layui-btn-normal layui-btn-small"><a href="rdcinfo.html?rdcId=' + item.id + '">查看</a></button>' +
                    '<button class="layui-btn layui-btn-small"><a href="rdcaddcold.html?rdcId=' + item.id + '">修改</a></button>' +
                    '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteRdc('+item.id+')"><a href="javascript:;">删除</a></button></div></div></li>')
            });
            $("#rdcList").empty().append(rdcList.join(''));
    });
}
function changePage() {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
            , layer = layui.layer;
        laypage({
            cont: 'page1'
            , pages: pagination.pageCount
            , first: false
            , last: false
            ,jump: function (obj,first) {
                pageCurrent = obj.curr;
                pagination.oldPageCount = pagination.pageCount;
                if(first!=true){
                    getRdcList();
                    window.scroll(0,0);//跳到顶部
                }
            }
        });
    });
}
function search() {//搜索
    pageCurrent=1;
    getRdcList();
}
function deleteRdc(rdcID){//删除
    var r=confirm("删除该条数据？");
    if(r){
        $.ajax({
            type: "POST",
            url: "/i/rdc/deleteByRdcID",
            data: {rdcID:rdcID,uid:window.lkuser.id},
            success: function(data){
                if(data.status == 0){
                    layer.alert('删除成功', {
                        skin: 'layui-layer-molv' //样式类名
                        ,closeBtn: 0
                    }, function(index){
                        getRdcList();
                        layer.close(index);
                    });
                }else{
                    layer.alert('删除失败，请稍后重试');
                }
            }
        });
    }
}

/**
*
* 出租求租列表
*
* */
var rentDate=['','1个月以下','1~3个月','3~6个月','6~9个月','1年以上','两年以上','三年以上','五年以上'];
function info(id) {//冷库详情
    $.get('/i/ShareRdcController/getSEByID.json',{id: id}, function (data) {
        var obj = data.entity,address='',len=0;
        obj.files==undefined?len=0:len=obj.files.length;
        var imglist='<ul id="infoImg" class="infoImg clearfix layer-photos-demo">',i=0;
        for(i; i<len; i++){
            imglist = imglist + '<li><img src="'+obj.files[i]+'"></li>'
        }
        imglist=imglist+'</ul>';
        if(len==0){imglist=''}
        obj.typeCode==1?address=obj.address:address=obj.detlAddress;
        layer.open({
            type: 1
            , title: obj.typeText+'详情'
            , area: ['60%', '50%']
            , shadeClose: true
            , shade: 0.6
            , maxmin: true
            , content: '<div class="infoModal">'+imglist+'<h3 class="orange">基本信息</h3><ol>' +
            '<li><div>描述：</div><div>'+address+'</div></li>' +
            '<li><div>地址：</div><div>'+obj.title+'</div></li>' +
            '<li><div>电话：</div><div>'+obj.telephone+'</div></li>' +
            '<li><div>'+obj.typeText+'面积：</div><div>'+obj.sqm+'㎡</div></li>' +
            '<li><div>单价：</div><div>'+obj.unitPrice+obj.unit+'</div></li>' +
            '<li><div>有效期：</div><div>'+rentDate[obj.rentdate]+'</div></li>' +
            '<li><div>开始时间：</div><div>'+obj.validStartTime+'</div></li>' +
            '<li><div>结束时间：</div><div>'+obj.validEndTime+'</div></li>' +
            '<li><div>温度类型：</div><div>'+obj.codeLave2+'</div></li>' +
            '<li><div>经营类型：</div><div>'+obj.codeLave1+'</div></li>' +
            '<li><div>备注：</div><div>'+obj.note+'</div></li></ol></div>'
            , btn: ['关闭'] //只是为了演示
            , yes: function () {
                layer.closeAll();
            }
        });
        layer.photos({
            photos: '#infoImg'
        });
    });
}
function changePageRent() {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
            , layer = layui.layer;
        laypage({
            cont: 'page2'
            , pages: pagination.pageCount
            , first: false
            , last: false
            ,jump: function (obj,first) {
                pageCurrent = obj.curr;
                pagination.oldPageCount = pagination.pageCount;
                if(first!=true){
                    getRentList();
                    window.scroll(0,0);//跳到顶部
                }
            }
        });
    });
}
function getRentList() {
    var rentList=[];
    $.get('/i/ShareRdcController/newGetSEListByUID',
        {
            userID: window.lkuser.id,
            username:window.lkuser.name,
            dataType:3,
            pageNum: pageCurrent,
            pageSize: 10,
            keyword: $(".rdcSearch input").val().trim()
        }, function (data) {
            if(data.success){
                pagination.pageCount = data.totalPages;
                if (pagination.pageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                    changePageRent();
                }
                var rent = data.data;
                $.each(rent, function (index, item) {
                    rentList.push('<li><div class="oImg fl"><img src="'+item.logo + '" alt="图片跑丢了~"></div>' +
                        '<div class="oTxt fl"><h2 class="omg"><a class="blue" onclick="info('+item.id+')">['+item.typeText+']' + item.title + '</a></h2>' +
                        '<h4 class="omg"><i class="iconfont orange">&#xe61c;</i>' + item.detlAddress + '</h4>' +
                        '<p class="omg">' + item.updatetime + '</p><div class="txt-right">' +
                        '<button class="layui-btn layui-btn-normal layui-btn-small"><a onclick="info('+item.id+')">查看</a></button>' +
                        '<button class="layui-btn layui-btn-small"><a href="javascript:;">修改</a></button>' +
                        '<button class="layui-btn layui-btn-danger layui-btn-small" onclick="deleteRent('+item.id+')"><a href="javascript:;">删除</a></button></div></div></li>')
                });
                $("#rentList").empty().append(rentList.join(''));
            }else{
                layer.alert(data.message, {
                    icon:6,
                    skin: 'layui-layer-molv' //样式类名
                    ,closeBtn: 0
                }, function(index){
                    sessionStorage.clear();
                    window.location.href='login.html';
                    layer.close(index);
                });
            }
        });
}
function deleteRent(id){//删除
    var r=confirm("删除该条数据？");
    if(r){
        $.ajax({
            type: "POST",
            url: "/i/ShareRdcController/delShareInfoByUid",
            data: {rdcID:id,uid:window.lkuser.id},
            success: function(data){
                if(data.success){
                    layer.alert('删除成功', {
                        skin: 'layui-layer-molv' //样式类名
                        ,closeBtn: 0
                    }, function(index){
                        getRdcList();
                        layer.close(index);
                    });
                }else{
                    layer.alert('删除失败，请稍后重试');
                }
            }
        });
    }
}
/**
*
* 出售求购列表
*
* */
layui.use(['jquery', 'form', 'element', ], function () {
    var element = layui.element();
    $ = layui.jquery;
    form = layui.form();
    $form = $('form');
    checkLogin(1, initForm);
    $("#reset").bind("click", function () {
        initForm();
    });
    $('.tabNav>li').click(function () {
        pageCurrent=1;
        var oIndex = $(this).index();
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
            getRentList();
            break;
        default:
            return
        }
    })
});
var userinfo={
    initUser: function () {
        initForm();
    },
    initRdc: function () {
        pageCurrent=1;
        getRdcList();
    },
    initRent: function () {
        getRentList();
    },
    initGoods: function () {
        getGoodsList();
    },
    initCollect: function () {
        getCollectList();
    }
    
}
