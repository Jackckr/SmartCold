"use strict";
var oHtml = document.documentElement;
var _sysconfig={countdown:60,isdebug:true,resize:true};
var screenWidth = oHtml.clientWidth,screenHeight = oHtml.clientHeight;
getFont();$(window).resize(function(event) { if(_sysconfig.resize)getFont();});
var ER = {root:"http://liankur.com",coldroot:"http://www.smartcold.org.cn"};
//var ER = {root:"http://192.168.1.136:8080",coldroot:"http://www.smartcold.org.cn",isdebug:true};
if ($.ajax) {jQuery.ajaxSetup({xhrFields:{withCredentials:true}});}
var userjson=window.localStorage.lkuser;if(userjson){window.user=JSON.parse(userjson);}/*else{checktoken();}*/
function backDropTop(ops){$('.topFirst').hide();}
function tourl(url){window.location.href =url;}//去指定的url
function gohome(){window.location.href ="../index.html";};//去首页
function setIOS_hidebar(){ if(window.location.pathname.indexOf("360")==-1){ $(".footer").hide();}}//同步token
function setIOS_token(token){util.setCookie("token",token,"d7");checktoken();}//同步token
function setIOS_deltoken(){ $http.get(ER.root+'/i/user/logout');window.user  = null;util.delCookie("token");window.localStorage.lkuser=null;}//同步token
function gologin(){ window.location.href = "login.html#" + window.location.href;};//去首页
function showErrorInfo(msg){var msgEl=$("#mention");if(msg==null||msg==''){msgEl.hide();msgEl.html('');}else{msgEl.show();msgEl.html(msg);}}
function getUrlParam(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null){return decodeURI(unescape(r[2]));return null;};}
function checkLogin(msg,callback) {if(window.user!=null ){if(callback){callback(); } return true; }else{ window.user = null;window.location.href = "login.html#" + window.location.href; return false;}}
function goback() {if( typeof ios_gohome == 'function'){ios_gohome();return;}if(window.location.pathname.indexOf("login.html")&&window.location.hash.indexOf("user-")!=-1){window.location.href ="user.html";}else{ window.history.back();}}//返回上一级
function getFont(){ screenWidth = oHtml.clientWidth;screenHeight = oHtml.clientHeight;if(screenWidth>screenHeight){screenWidth=screenHeight;}if(screenWidth>=1024){oHtml.style.fontSize="54.61333333333333px";}else{if(screenWidth<=320){oHtml.style.fontSize="17.06666666666667px";}else{oHtml.style.fontSize=screenWidth/(750/40)+"px";}}};
function checktoken(toke){if(window.user==null ){if(toke==undefined){toke=util.getCookie('token');}$.ajax({type:"GET",cache:false,timeout : 5000,dataType:"json",data:{token:toke}, url:ER.root + "/i/user/findUser",success:function(data) {if (data && data.id != 0) {
	window.user = data;
	window.localStorage.lkuser=JSON.stringify(data);
} else {
	window.user = null;
	window.localStorage.lkuser=null;
	}} });}}
function setTime(obj){if(_sysconfig.countdown==0){obj.removeAttribute("disabled");obj.style.background="#438BCB";obj.innerHTML="获取验证码";_sysconfig.countdown=60;return;}else{if($(obj).siblings("input").val().length==0){/*alert("输入不能为空哦~");*/layer.open({content: '输入不能为空哦~',btn: '确定'});return false;}else{obj.setAttribute("disabled",true);obj.style.background="#ccc";obj.innerHTML="重新发送("+_sysconfig.countdown+")";_sysconfig.countdown--;}}setTimeout(function(){setTime(obj);},1000);};
var util = {
    //cook:s20是代表20秒,h是指小时，如12小时则是：h12,d是天数，30天则：d30 
	setCookie:function(a,c,d,e){if(e){util.delCookie(a);}var b=util.getsec(d);var e=new Date();e.setTime(e.getTime()+b*1);document.cookie=a+"="+escape(c)+";expires="+e.toGMTString();},
    getCookie:function(name) {var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");if (arr = document.cookie.match(reg)) { return unescape(arr[2]); } else { return null;} },
    delCookie:function(a) { var c = new Date(); c.setTime(c.getTime() - 1000); var b = util.getCookie(a);if (b != null) { document.cookie = a + "=" + b + ";expires=" + c.toGMTString(); }},
    getsec:function(str) {var str1 = str.substring(1, str.length) * 1; var str2 = str.substring(0, 1); if (str2 == "s") { return str1 * 1e3;} else { if (str2 == "h") { return str1 * 60 * 60 * 1e3;} else {if (str2 == "d") {return str1 * 24 * 60 * 60 * 1e3; }}} },
    setimg: function(em, imgid, callback) { var oFile = $(em)[0].files[0];var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp"; if (!rFilter.test(oFile.type)) { /*alert("格式错误~请选择格式为" + msg + "的图片~")*/layer.open({content: "格式错误~请选择格式为" + msg + "的图片~",btn: '确定'}); return; }var oImage = document.getElementById(imgid); var oReader = new FileReader(); oReader.onload = function(e) {  oImage.src = e.target.result;};  oReader.readAsDataURL(oFile); if (callback != null) { callback();  } },
};
/**
 * 事件
 */
window.onload = function(){
	$(".mySelect select").bind({ click:function(event) { $(this).parent().siblings("i").html("&#xe607;"); },change:function(event) { $(this).parent().siblings("i").html("&#xe60d;"); } });
    $(".next").click(function() { if ($(this).prev().hasClass("black")) {$(this).prev().removeClass("black"); $(this).children().html("&#xe64c;");} else { $(this).prev().addClass("black");$(this).children().html("&#xe68b;");}});
	$("[ng-login]").click(function(){if(window.user){location.href= $(this).attr("ng-login");}else{var whref=window.location.href;window.location.href = "login.html#" +whref.substring(0,whref.lastIndexOf("/")+1)+$(this).attr("ng-login");}});
};




