"use strict";
var countdown = 60;
var oHtml = document.documentElement;
var screenWidth = oHtml.clientWidth;
var screenHeight = oHtml.clientHeight;
var ER = {root:"http://liankur.com",coldroot:""};
if ($.ajax) {jQuery.ajaxSetup({xhrFields:{withCredentials:true}});}
function goback() {window.history.back();}//返回上一级
function tourl(url){window.location.href =url;}//去指定的url
function gohome(){window.location.href ="../index.html";};//去首页
function gologin(){ window.location.href = "login.html#" + window.location.href;};//去首页
function getUrlParam(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null){return unescape(r[2]);}return null;};
function getFont(){if(screenWidth>screenHeight){screenWidth=screenHeight;}if(screenWidth>=1024){oHtml.style.fontSize="54.61333333333333px";}else{if(screenWidth<=320){oHtml.style.fontSize="17.06666666666667px";}else{oHtml.style.fontSize=screenWidth/(750/40)+"px";}}};
function setTime(obj){if(countdown==0){obj.removeAttribute("disabled");obj.style.background="#438BCB";obj.innerHTML="获取验证码";countdown=60;return;}else{if($(obj).siblings("input").val().length==0){alert("输入不能为空哦~");return false;}else{obj.setAttribute("disabled",true);obj.style.background="#ccc";obj.innerHTML="重新发送("+countdown+")";countdown--;}}setTimeout(function(){setTime(obj);},1000);};

function checkLogin(msg) {
	 if(window.user!=null ){return;}
	  $.ajax({
	        type:"GET",
	        cache:false,
	        dataType:"json",
	        url:ER.root + "/i/user/findUser",
	        success:function(data) {
	            if (data && data.id != 0) {
	                window.user = data;
	            } else {
	            	alert(msg?msg:"请登录后再操作！");
	                window.user = null;
	                window.location.href = "login.html#" + window.location.href;
	            }
	        }
	    });
}

/**
 * 事件
 */
getFont();
$(window).resize(function(event) { getFont();});
//自动改变页面根目录字体大小
$(function() {
    $(".next").click(function() {
        if ($(this).prev().hasClass("black")) {
            $(this).prev().removeClass("black");
            $(this).children().html("&#xe64c;");
        } else {
            $(this).prev().addClass("black");
            $(this).children().html("&#xe68b;");
        }
    });
    $(".mySelect select").bind({
        click:function(event) {
            $(this).parent().siblings("i").html("&#xe607;");
        },
        change:function(event) {
            $(this).parent().siblings("i").html("&#xe60d;");
        }
    });
});
var util = {
    //cook:s20是代表20秒,h是指小时，如12小时则是：h12,d是天数，30天则：d30
    setCookie:function(a, c, d) {
        var b = util.getsec(d);
        var e = new Date();
        e.setTime(e.getTime() + b * 1);
        document.cookie = a + "=" + escape(c) + ";expires=" + e.toGMTString();
    },
    getCookie:function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    delCookie:function(a) {
        var c = new Date();
        c.setTime(c.getTime() - 1);
        var b = getCookie(a);
        if (b != null) {
            document.cookie = a + "=" + b + ";expires=" + c.toGMTString();
        }
    },
    getsec:function(str) {
        var str1 = str.substring(1, str.length) * 1;
        var str2 = str.substring(0, 1);
        if (str2 == "s") {
            return str1 * 1e3;
        } else {
            if (str2 == "h") {
                return str1 * 60 * 60 * 1e3;
            } else {
                if (str2 == "d") {
                    return str1 * 24 * 60 * 60 * 1e3;
                }
            }
        }
    },
     setimg:function(em, imgid) {
        var oFile = $(em)[0].files[0];
        var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
        var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
        if (!rFilter.test(oFile.type)) {
            alert("格式错误！请选择格式为" + msg + "的图片!");
            return;
        }
        var oImage = document.getElementById(imgid);
        var oReader = new FileReader();
        oReader.onload = function(e) { oImage.src = e.target.result; };
        oReader.readAsDataURL(oFile);
    }
};