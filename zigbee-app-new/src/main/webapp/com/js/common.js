"use strict";
if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)||//ie6,7,8,9,10
    (navigator.userAgent.indexOf('Trident') >= 0)||//ie11
    (navigator.userAgent.indexOf('Edge') >= 0)){//ie Edge
    console.log('你使用的是IE');
    if(location.href.indexOf("index")>=0){
        var divalert='<div class="divalert"><div class="alertBox"><div class="alertTxt"><p>hi,您访问的是手机版链库网站，由于您当前的浏览器版本过低，可能存在安全风险，</p>' +
            '<p>建议升级浏览器：</p>'+
            '<a href="http://sw.bos.baidu.com/sw-search-sp/software/b168073fdd275/ChromeStandalone_60.0.3112.90_Setup.exe">谷歌 Chrome</a>'+
            '<a href="http://sw.bos.baidu.com/sw-search-sp/software/95ea25cc4f539/Firefox_55.0.0.6424_setup.exe">火狐 Firefox</a>'+
            '<p>或者访问<span>电脑端链库</span>网站:<a href="http://lianku.org.cn">http://lianku.org.cn/</a></p>'+
            '<p>您也可以直接使用<span>链库APP</span>进行浏览</p>'+
            '<div><img src="com/img/ios.png" alt=""><img src="com/img/android.png" alt=""></div></div></div></div>'
    }else{
        var divalert='<div class="divalert"><div class="alertBox"><div class="alertTxt"><p>hi,您当前的浏览器版本过低，可能存在安全风险，</p><p>建议升级浏览器：</p>'+
            '<a href="http://sw.bos.baidu.com/sw-search-sp/software/b168073fdd275/ChromeStandalone_60.0.3112.90_Setup.exe">谷歌 Chrome</a>'+
            '<a href="http://sw.bos.baidu.com/sw-search-sp/software/95ea25cc4f539/Firefox_55.0.0.6424_setup.exe">火狐 Firefox</a>'+
            '<p>或者访问<span>电脑端链库</span>网站:<a href="http://lianku.org.cn">http://lianku.org.cn/</a></p>'+
            '<p>或者直接使用<span>链库APP</span>进行浏览</p>'+
            '<div><img src="../com/img/ios.png" alt=""><img src="../com/img/android.png" alt=""></div></div></div></div>'
    }
    document.write(divalert);
}else{
    console.log('浏览器审核通过！')
}
var oHtml = document.documentElement;

var _sysconfig={countdown:60,isdebug:true,resize:true};
var screenWidth = oHtml.clientWidth,screenHeight = oHtml.clientHeight;
getFont();$(window).resize(function(event) { if(_sysconfig.resize)getFont();});
//var ER = {root:"http://www.liankur.com/",coldroot:"http://www.smartcold.org.cn"};
var ER = {root:"http://192.168.1.114:8080",coldroot:"http://www.smartcold.org.cn"};
if ($.ajax) {jQuery.ajaxSetup({cache:false,xhrFields:{withCredentials:true}});}//支持ajax跨域
if(localStorage.length>=14){for(var i in localStorage ){if(i.indexOf("BMap_")>=0){ localStorage.removeItem(i);}}}
if(window.user==undefined ||window.user==null){
	if(window.localStorage.logtime&&(new Date().getTime()-window.localStorage.logtime)/60000>1){
		checktoken();
	}else if(window.user==""){
        window.user=undefined;
    }
	var userjson=window.localStorage.lkuser;
	if(userjson){window.user=JSON.parse(userjson);userjson=undefined;
}else{
	 window.user=null;
	}
}

function backDropTop(ops){$('.topFirst').hide();}
function tourl(url){window.location.href =url;}//去指定的url
function gohome(){window.location.href ="../index.html";};//去首页
function setIOS_hidebar(){ if(window.location.pathname.indexOf("360")==-1){ $(".footer").hide();}}//同步token
function setIOS_token(token){util.setCookie("token",token,"d7");checktoken();}//同步token
function setIOS_deltoken(){ $http.get(ER.root+'/i/user/logout');window.user  = null;util.delCookie("token");util.delCookie("lkuser");}//同步token
function gologin(){ window.location.href = "login.html#" + window.location.href;};//去首页
function showErrorInfo(msg){var msgEl=$("#mention");if(msg==null||msg==''){msgEl.hide();msgEl.html('');}else{msgEl.show();msgEl.html(msg);}}
function getmsg(){if(window.user&&window.user.id!=0){$.post(ER.root+"/i/message/getMsgCountByUID", {userID:window.user.id},  function(data) {
	localStorage.msgTotalNum = data;
	if(localStorage.msgTotalNum&&localStorage.msgTotalNum!=0){$("#msgTotalNumReset a").append('<span class="countNum" > '+localStorage.msgTotalNum+'</span>');}
	});
}}
function getUrlParam(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null){return decodeURI(unescape(r[2]));return null;};}
function getCookie(name){var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");if(arr=document.cookie.match(reg))return unescape(arr[2]);else	return null;}
function checkLogin(msg,callback) {if(window.user!=null ){if(callback){callback(); } return true; }else{ window.user = null;window.location.href = "login.html"; return false;}}
function checkLocal() {
    if(localStorage){
        if(localStorage.list_cache_storehouse){
            localStorage.removeItem("list_cache_storehouse")
        }else if(localStorage.list_cache_goodlist){
            localStorage.removeItem("list_cache_goodlist")
        }else if(localStorage.list_cache_coldlist){
            localStorage.removeItem("list_cache_coldlist")
        }else if(localStorage.saveRdcID){
            localStorage.removeItem("saveRdcID")
        }
    }
}
checkLocal();
function goback() {
	if (typeof ios_gohome == 'function') {
		ios_gohome();return;
	}
    checkLocal();
	if (window.location.pathname.indexOf("login.html")!=-1 ) {
		if( window.location.hash.indexOf("user-") != -1){
			window.location.href = "user.html";return;
		}else if(window.location.hash.indexOf("cold360") != -1){
			window.location.href = "../index.html";return;
		}else if(
				window.location.hash.indexOf("releasekutable") != -1||window.location.hash.indexOf("releasestorage") != -1||window.location.hash.indexOf("releasegoods") != -1||window.location.hash.indexOf("releasecoldtransport") != -1){
			window.location.href = "release.html";
			return;
		}else if(window.location.hash.indexOf("commentdetail") != -1){
			window.history.back(2);return;
		}
		window.history.back();return;
	} else {
		window.history.back();return;
	}
}//返回上一级
//格式化CST日期的字串
function formatCSTDate(strDate,format){
  return formatDate(new Date(strDate),format);
}

//格式化日期,
function formatDate(date,format){
  var paddNum = function(num){
    num += "";
    return num.replace(/^(\d)$/,"0$1");
  }
  //指定格式字符
  var cfg = {
     yyyy : date.getFullYear() //年 : 4位
    ,yy : date.getFullYear().toString().substring(2)//年 : 2位
    ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
    ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
    ,d  : date.getDate()   //日 : 如果1位的时候不补0
    ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
    ,hh : date.getHours()  //时
    ,mm : paddNum(date.getMinutes()+0) //分
    ,ss : paddNum(date.getSeconds()+0) //秒
  }
  format || (format = "yyyy-MM-dd hh:mm:ss");
  return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
}
function getFont(){ screenWidth = oHtml.clientWidth;screenHeight = oHtml.clientHeight;if(screenWidth>screenHeight){screenWidth=screenHeight;}if(screenWidth>=1024){oHtml.style.fontSize="54.61333333333333px";}else{if(screenWidth<=320){oHtml.style.fontSize="17.06666666666667px";}else{oHtml.style.fontSize=screenWidth/(750/40)+"px";}}};
function checktoken(toke,isupdate) {
    if (toke == undefined) {
        toke = localStorage.token;
    }
    $.ajax({
        type: "GET",
        cache: false,
        timeout: 5000,
        data: {token: toke,isupdate:isupdate},
        url: ER.root + "/i/user/findUser",
        success: function (data) {
            if (data && data.id != 0) {
                window.localStorage.logtime = new Date();
                window.user = data;
                window.localStorage.lkuser = JSON.stringify(data);
            } else {
                window.localStorage.logtime = undefined;
                window.user = null;
                window.localStorage.removeItem("lkuser");
            }
        }
    });
}

function setTime(obj) {
    if (_sysconfig.countdown == 0) {
        obj.removeAttribute("disabled");
        obj.style.background = "#438BCB";
        obj.innerHTML = "获取验证码";
        _sysconfig.countdown = 60;
        return;
    } else {
        if ($(obj).siblings("input").val().length == 0) {/*alert("输入不能为空哦~");*/
            layer.open({content: '输入不能为空哦~', btn: '确定'});
            return false;
        } else {
            obj.setAttribute("disabled", true);
            obj.style.background = "#ccc";
            obj.innerHTML = "重新发送(" + _sysconfig.countdown + ")";
            _sysconfig.countdown--;
        }
    }
    setTimeout(function () {
        setTime(obj);
    }, 1000);
};
var util = {
	setCookie:function(a,b,c){localStorage.setItem(a, b);},getCookie:function(a) {return localStorage.getItem(a);},  delCookie:function(a) {localStorage.removeItem(a);},
	setCookies:function (name,value){var Days = 30, exp = new Date();exp.setTime(exp.getTime() + Days*24*60*60*1000);document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();},
    setimg : function(em, imgid, callback) {
		var oFile = $(em)[0].files[0];
		var rFilter = /^(image\/jpeg|image\/png|image\/gif|image\/bmp|image\/jpg)$/i;
		var msg = "*.gif,*.jpg,*.jpeg,*.png,*.bmp";
		if (!rFilter.test(oFile.type)) {
			layer.open({content : "格式错误~请选择格式为" + msg + "的图片~",btn : '确定'}); return;
		}else if(oFile.size > 10485760){
    		layer.open({content : "最大只能上传10M的图片",btn : '确定'}); return;
		}
		var oImage = document.getElementById(imgid);
		var oReader = new FileReader();
		oReader.onload = function(e) {oImage.src = e.target.result;};  oReader.readAsDataURL(oFile);
		if (callback != null) {callback();}
	},
};
/*点击图片隐藏div*/
function imgBoxHide(){
	 document.getElementById("baguetteBox-overlay").addEventListener("click", function(e) {
		 if (e.target.tagName == "IMG") {
			 $("#baguetteBox-overlay").hide();
			 return false;
		 }
	 }, false);
}
/**
 * 事件
 */
/*检查输入的数字是否为》0   2017-3-13*/
function checkNum(){
	var numLen = $("input[type='number']");
	for(var i=0;i<numLen.length;i++){
		if(numLen[i].value<0){
			$(".mybtn").attr('disabled',true);
			numLen[i].style.color = "red";
			return false
		}else{
			numLen[i].style.color = "#555";
		}
	}
}
window.onload = function(){
	getmsg();
	//$(".mySelect select").bind({ click:function(event) { $(this).parent().siblings("i").html("&#xe603;"); },change:function(event) { $(this).parent().siblings("i").html("&#xe697;"); } });
    $(".next").click(function() { if ($(this).prev().hasClass("black")) {$(this).prev().removeClass("black"); $(this).children().html("&#xe64c;");} else { $(this).prev().addClass("black");$(this).children().html("&#xe68b;");}});
    $("[ng-login]").click(function(){if(window.user){location.href= $(this).attr("ng-login");}else{var whref=window.location.href;window.location.href = "login.html#" +whref.substring(0,whref.lastIndexOf("/")+1)+$(this).attr("ng-login");}});
	$(window).scroll(function(event) {if ($(window).scrollTop() >= $(window).height()) {$('.goTop').show();} else {$('.goTop').hide();}});$('.goTop').click(function(event) {$('html,body').stop().animate({'scrollTop':0}, 800); });//一键回到顶部

	/*检查输入的数字是否为》0   2017-3-13*/
	$("input[type='number']").blur(function(){
   		if($(this).val()<0){
   			$(this).css("color","red")
   			$(".mybtn").attr('disabled',true)
   			layer.open({content: '输入的数字不能为负数哦',btn: '确定'});
   			return false
   		}else{
   			$(this).css("color","#555");
   			if(checkNum()==false){
   				layer.open({content: '其他地方的输入数字也不能为负数哦，请检查',btn: '确定'});
	   		}else{
	   			$(".mybtn").attr('disabled',false);
	   			$("input[type='number']").css("color","#555")
	   			return true;
	   		}
   		}
   	})
};
/*联系电话的验证*/
function checkMobile(str) {
   var  reg = /^1\d{10}$/,//手机号
   		reg1 = /^0\d{2,3}-?\d{7,8}$/; //座机号
   if (reg.test(str) || reg1.test(str)) {
       return true
   } else {
       return false
   }
}
/*分享功能*/
var flagPC = true;
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flagPC = false;
            break;
        }
    }
    return flagPC;
}
function weixinShare() {
    IsPC();
    if(flagPC){alert('你当前使用的不是手机浏览器，无法使用该功能~');return false}
    var wx='<div class="wxShare"><span class="bgClose" onclick="bgClose(this)"></span></div>';
    var web='<div class="webShare"><span class="bgClose" onclick="bgClose(this)"></span></div>';
    if(isWeiXin()){//微信浏览器
        $("body").append(wx);
    }else{//手机浏览器
        $("body").append(web);
       // alert(window.navigator.userAgent)
    }
}
function bgClose(ops) {
    $(ops).parent('div').hide();
}
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'||ua.match(/QQ/i) == 'qq'&&ua.match(/QQ/i) == 'mqq'){
     //   alert(ua)
        return true;
    }else{
        return false;
    }
}
/*safari时间不支持解决*/
var formatTime = {
    standTime:function (date) {
        return new Date(Date.parse(date.replace(/-/g, "/")))
    },
    mseconds:function (date) {
        return new Date(Date.parse(date.replace(/-/g, "/"))).getTime()
    }
};

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}/* 获取URL参数 */