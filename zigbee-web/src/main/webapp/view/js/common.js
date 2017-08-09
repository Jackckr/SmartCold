/**
 * Created by wellsea on 6/21/0021.
 */
// layer icon: --1:对号，2:叉号，3：问号，4：锁，5：哭脸，6：笑脸，7：叹号
/**
 * page工具类
 */
if (window.localStorage.lkuser&& new Date().getTime() - window.localStorage.longtime < 1800000) {
	window.lkuser = JSON.parse(window.localStorage.lkuser);
	$("#noLoginUser").hide();
	$("#loginUser").show().find('img').attr({'src' : lkuser.avatar,'title' : lkuser.username});
}

var PageUtil = {
	get_Cookie:function(name){var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");if(arr=document.cookie.match(reg))return unescape(arr[2]);else	return null;},
	set_Cookie:function (name,value){var Days = 30, exp = new Date();exp.setTime(exp.getTime() + Days*24*60*60*1000);document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();} ,
	del_Cookie:function(name){var exp = new Date();	exp.setTime(exp.getTime() - 1);var cval=PageUtil.get_Cookie(name);if(cval!=null)document.cookie= name + "="+cval+";expires="+exp.toGMTString();},
	del_lS:function(keys){var type=typeof(keys);if("object"==type){ $.each(keys, function(i, vo){ localStorage.removeItem(localStorage.removeItem(vo));});}else if("string"==type){localStorage.removeItem(keys);}else{localStorage.clear();}},	
	initialize:function(){window.addEventListener("hashchange",function(){this.history.replaceState("hasHash","",window.location.hash);},false);window.addEventListener("popstate",function(e){if(e.state){this.location.reload();}},false);},
	refpage:function(){var hiddenProperty="hidden" in document?"hidden":"webkitHidden" in document?"webkitHidden":"mozHidden" in document?"mozHidden":null;var visibilityChangeEvent=hiddenProperty.replace(/hidden/i,"visibilitychange");document.addEventListener(visibilityChangeEvent,DataUtil.getUser);},
	setHashStringArgs:function(data,prefix,blacklist){if(prefix==undefined){prefix="";}var val=null,hash=[];for(var key in data){if(blacklist&&blacklist.indexOf(key)>-1){continue;}val=data[key];if(val&&val!=""){hash.push(prefix+key+"="+val);}}if(hash.length>0){window.location.hash=hash.join("&");}},
	getHashStringArgs:function(){var hashStrings=(window.location.hash.length>0?window.location.hash.substring(1):""),hashArgs={},items=hashStrings.length>0?hashStrings.split("&"):[],item=null,name=null,value=null,i=0,len=items.length;for(i=0;i<len;i++){item=items[i].split("=");name=decodeURIComponent(item[0]);value=decodeURIComponent(item[1]);if(name.length>0){hashArgs[name]=value;}}return hashArgs;},
	goh5:function(){var sUserAgent=navigator.userAgent.toLowerCase(),bIsIpad=sUserAgent.match(/ipad/i)=="ipad",bIsIphoneOs=sUserAgent.match(/iphone os/i)=="iphone os",bIsMidp=sUserAgent.match(/midp/i)=="midp",bIsUc7=sUserAgent.match(/rv:1.2.3.4/i)=="rv:1.2.3.4",bIsUc=sUserAgent.match(/ucweb/i)=="ucweb",bIsAndroid=sUserAgent.match(/android/i)=="android",bIsCE=sUserAgent.match(/windows ce/i)=="windows ce",bIsWM=sUserAgent.match(/windows mobile/i)=="windows mobile";if(bIsIpad||bIsIphoneOs||bIsMidp||bIsUc7||bIsUc||bIsAndroid||bIsCE||bIsWM){window.location.href="http://m.liankur.com";}},
};
var DataUtil = {
    getUser:function(){$.ajax({url : "/i/user/findUser",type : "get",dataType : "json",success : function(data) {DataUtil.chUser(data);}}); },
    delUser:function(){DataUtil.chUser(null);},
    logout:function(){$.ajax({type : "GET",cache : false,dataType : 'json',url : '/i/user/logout'}).success(function(data) {});PageUtil.del_Cookie("token");window.localStorage.clear();window.location.href = "../../index.html";},
    chUser:function(data){if (data&&data.username && data.id != 0) {window.lkuser = data;window.localStorage.lkuser = JSON.stringify(data);window.localStorage.longtime = new Date().getTime();}else{PageUtil.del_Cookie("token");window.lkuser = null;PageUtil.del_lS(['longtime','lkuser']);}DataUtil.chHtml();},
    chHtml:function(){if (window.lkuser) {$("#loginUser").show().find('img').attr({'src' : window.lkuser.avatar,'title' : window.lkuser.username});$("#noLoginUser").hide();} else {$("#noLoginUser").show();$("#loginUser").hide();}},
    getMsg:function(){},
    getToken:function(){},
};


function checkLogin(msg, callback) {// 检查是否登录
	if (window.lkuser != null) {
		if (callback) {
			callback();
		}
		return true;
	} else {
		localStorage.OURL = document.URL;
		window.lkuser = null;
		window.location.href = "/login.html";
		return false;
	}
}

$("#loginUser").hover(function() {
	$(this).children('dl').stop().toggle();
})
function clearUndefined(word) {
	return word ? word : "";
}/* 清除显示undefined */
function getVailCode(code) {
	return [ code[code.length - 1], code[3], code[code.length - 4], code[1] ]
			.join('');
}/* 校验验证码 */
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}/* 获取URL参数 */
/* 登出系统 */
function logout() {DataUtil.logout();};
/* 判断数组中是否有重复元素 */
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return i;
		}
	}
	return -1;
};
function watchNavigator() {// /监测浏览器版本
	if (navigator.appName == "Microsoft Internet Explorer") {
		if (navigator.appVersion.match(/7./i) == "7."
				|| navigator.appVersion.match(/8./i) == "8."
				|| navigator.appVersion.match(/9./i) == "9.") {
			console.log(navigator.appVersion + '--it is IE');
			alert('您的浏览器版本过低，可能部分功能不能完美实现。请更换网页底部推荐的浏览器，来获取更佳体验！');
		}
	} else {
		console.log(navigator.appVersion + '--it is perfect!');
	}
}
/* 将所有数据赋值给form表单 */
function getDataToForm(inputArr, data) {
	var nameArr = [];
	$.each(inputArr, function(index, item) {
		if (nameArr.contains($(item).attr("name")) == -1) {
			nameArr.push($(item).attr("name"));
			var val = eval("data." + $(item).attr("name"));
			$(item).val(val);
		}
	});
}
// 解决IE8不支持forEach()
// 在你调用 forEach 之前 插入下面的代码，在本地不支持的情况下使用 forEach()
function supportForeach() {
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function forEach(callback, thisArg) {
			var T, k;
			if (this == null) {
				throw new TypeError("this is null or not defined");
			}
			var O = Object(this);
			var len = O.length >>> 0;
			if (typeof callback !== "function") {
				throw new TypeError(callback + " is not a function");
			}
			if (arguments.length > 1) {
				T = thisArg;
			}
			k = 0;
			while (k < len) {

				var kValue;
				if (k in O) {
					kValue = O[k];
					callback.call(T, kValue, k, O);
				}
				k++;
			}
		};
	}
}
supportForeach()
/* safari时间不支持解决 */
var formatTime = {
	standTime : function(date) {
		return new Date(Date.parse(date.replace(/-/g, "/")))
	},
	mseconds : function(date) {
		return new Date(Date.parse(date.replace(/-/g, "/"))).getTime()
	}
};
/* 时间转换成2017-07-19 15:20：20 */
var formatDateTime = function(date) {
	date = new Date(Date.parse(date.replace(/-/g, "/")))
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var seconds = date.getSeconds();
	seconds = seconds < 10 ? ('0' + seconds) : seconds;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + seconds;
};
// 手机号加密
function telMd5(tel) {
	if (tel) {
		if (tel.length == 11) {// 手机号
			tel = tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		} else {// 座机
			tel = tel.slice(0, tel.length - 4).concat('****');
		}
	} else {
		tel = '187****2361';// 手机号没有时默认值
	}
	return tel;
}
setInterval(function() {localStorage.removeItem('OURL');}, 60000);
PageUtil.goh5();
PageUtil.refpage();
DataUtil.getUser();