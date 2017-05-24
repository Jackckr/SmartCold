var isyzok = false,remote_ip_info = "";
if (location.href != top.location.href) { top.location.href = "../login.jsp";}
//登录
function ckfsstyle(type) {
    if (type == 1) {
        clsyle("#ui", 2, '请输入用户名！');
    } else if (type == 2) {
        clsyle("#up", 2, '请输入密码！');
    }
}
function removelallsyle(em, text) {
    $(em).text(text);
    $(em).removeClass("onok");
    $(em).removeClass("onFocus");
    $(em).removeClass("onError");
    $(em).removeClass("onError1");
}
function clsyle(em, type, text) {
    removelallsyle(em, text);
    if (type == 1) {
        $(em).addClass("onok");
    } else if (type == 2) {
        $(em).addClass("onFocus");
    } else if (type == 3) {
        $(em).addClass("onError");
    } else if (type == 4) {
        $(em).addClass("onError1");
    }
}
function ckuid(type) {
    if (type == 1) {
        var name = $("#userId");
        if (name.val() == "") {
            clsyle("#ui", 3, '请输入用户名！');
            return false;
        } else {
            clsyle("#ui", 1, '');
        }
    } else if (type == 2) {
        var password = $("#upassword");
        if (password.val() == "") {
            clsyle("#up", 3, '请输入密码！');
            return false;
        } else {
            clsyle("#up", 1, '');
        }
    }
}

function login() {
    var adds = "127.0.0.1  本地登录";
    var name = $("#userId");
    var password = $("#upassword");
    if (remote_ip_info != null && remote_ip_info != "") {
        adds = $("#keleyivisitorip").html() + " " + remote_ip_info["province"] + "省" + remote_ip_info["city"] + "市";
    }
    $("#uip").val(adds);
    if (name.val() == "") {
        name.focus();
        return false;
    }
    if (password.val() == "") {
        password.focus();
        return false;
    }
    $("#input_sik").val(new Date().getHours());
    $.ajax({
        url: '/i/admin/login',
        type: 'POST',
        data: $('#sellloginform').serialize(),
        error: function() {  clsyle("#ui", 2, '服务异常！'); },
        success: function(data) {
        	if (data.success) {
                document.cookie = data.message;
                window.sessionStorage.asikey=data.message;
                window.location.href = "main.htm";
                return;
			} else {
				 clsyle("#ui", 4, data.message);
               changCodeImg();
               $("#codeyzm").val('');
               removelallsyle("#yimg", "");
			}
        }
    });

}

