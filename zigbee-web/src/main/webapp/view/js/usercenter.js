var $form;
var form;
var $;
/*获得所有的省市*/
function getProvinceList() {
    var provinceList = [];
    $.ajax({
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
    });
}
var oFile;
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
    var phoneRex=/^1[34578]\d{9}$/;
    var phone = type == 1 ? $("#oldPhone").val().trim() : $("#newPhone").val().trim();
    if (!phoneRex.test(phone)){
        layer.open({content: "请输入正确格式的手机号！", btn: '确定'});
        return;
    }
    if (type == 1) {
        $('#oldPhone').attr('readonly', 'readonly');
        $('#oldPhoneBtn').attr('disabled', 'disabled').css('backgroundColor', '#cccccc');
    } else {
        if($("#newPhone").val().trim()==$("#oldPhone").val().trim()){
            layer.open({content: "新手机号不能与旧手机号相同！", btn: '确定'});
            return;
        }
        if(window.oldCode!=$("#oldCode").val()){
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
                window.stoken=data.entity;
                layer.open({content: data.message, btn: '确定'});
            }
        }
    });
}

function updateTelephone() {
    if(window.newCode!=$("#newCode").val()){
        layer.open({content: "验证码输入有误！", btn: '确定'});
        return;
    }
    $.ajax({url:"/i/user/resetPhoneById",type:"post",data:{telephone:$("#newPhone").val().trim(),id:window.lkuser.id,toke:$("#newCode").val(),stoken:window.stoken},success:function (data) {
        layer.open({content: "保存成功！", btn: '确定'});
        flushUser(window.lkuser.id);
        window.location.reload();
    }});
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
            layer.open({content: "保存成功！", btn: '确定'});
            flushUser(window.lkuser.id);
            window.location.reload();
        }
    });
}
layui.use(['jquery', 'form'], function () {
    $ = layui.jquery;
    form = layui.form();
    $form = $('form');
    checkLogin(1, getProvinceList);
    $("#reset").bind("click", function () {
        location.reload();
        initForm();
    });
});
