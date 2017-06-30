/**
 * Created by wellsea on 6/21/0021.
 */
var sUserAgent = navigator.userAgent.toLowerCase();
var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
var bIsMidp = sUserAgent.match(/midp/i) == "midp";
var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
var bIsAndroid = sUserAgent.match(/android/i) == "android";
var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
/*document.writeln("您的浏览设备为：");*/
if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    window.location.href="http://m.liankur.com"; /* 链接到不同的网址  这个是手机的 */
}
$('.navSmall').hover(function() {//导航下拉菜单
    $(this).children('ul').stop().toggle();
});
$("#loginUser").hover(function () {
    $(this).children('dl').stop().toggle();
})
$(document).scroll(function () {//吸附导航
    var sTop = document.body.scrollTop || document.documentElement.scrollTop;
    var oTop = 86;
    if(sTop>oTop){
        $('.header').addClass('fixed');
        $(".banner").css('marginTop',oTop);
    }else{
        $('.header').removeClass('fixed');
        $(".banner").css('marginTop',0);
    }
});
/*获取URL参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
/*获取用户对象*/
function findUser() {
    $.ajax({url:"/i/user/findUser",type:"get",dataType:"json",success:function (data) {
        if (data.username){
            window.sessionStorage.user=data;
            // $("#loginUser").show().find('.username').html(data.username);
            $("#loginUser").show().find('img').attr('src',data.avatar);
            $("#noLoginUser").hide();
        }else {
            $("#noLoginUser").show();
            $("#loginUser").hide();
        }
    }});
}
/*登出系统*/
function logout() {
    $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/logout'}).success(function(data){});
    window.sessionStorage.user=null;//清除系统user;
    window.location.href="../../index.htm";
};
/*判断数组中是否有重复元素*/
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
}

$(function () {
    findUser();
});