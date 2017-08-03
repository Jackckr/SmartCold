/**
 * Created by wellsea on 6/21/0021.
 */
//layer icon: --1:对号，2:叉号，3：问号，4：锁，5：哭脸，6：笑脸，7：叹号
if (sessionStorage.lkuser && new Date().getTime() - sessionStorage.longtime < (30 * 60 * 1000)) {
    window.lkuser = JSON.parse(sessionStorage.lkuser);
    $("#loginUser").show().find('img').attr({'src': lkuser.avatar, 'title': lkuser.username});
    $("#noLoginUser").hide();
} else {
    findUser();
}

function checkLogin(msg, callback) {//检查是否登录
    if (window.lkuser != null) {
        if (callback) {
            callback();
        }
        return true;
    } else {
        localStorage.OURL=document.URL;
        window.lkuser = null;
        window.location.href = "login.html";
        return false;
    }
}
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
    window.location.href = "http://m.liankur.com";
    /* 链接到不同的网址  这个是手机的 */
}

$("#loginUser").hover(function () {
    $(this).children('dl').stop().toggle();
})

/*获取URL参数*/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/*截取验证码*/
function getVailCode(code) {
    var codes=[];
    codes.push(code[code.length-1]);
    codes.push(code[3]);
    codes.push(code[code.length-4]);
    codes.push(code[1]);
    return codes.join('');
}

/*清除显示undefined*/
function clearUndefined(word) {
    return word?word:"";
}



/*刷新缓存用户信息*/
/*function flushUser(id) {*/
    if(window.lkuser){
        $.ajax({url:"/i/user/findUserById",type:"post",data:{"userId":lkuser.id},success:function (data) {
            //window.sessionStorage.lkuser=JSON.stringify(data);
            window.lkuser = data;
        }});
    }
/*}*/

/*获取用户对象*/
function findUser() {
    $.ajax({
        url: "/i/user/findUser", type: "get", dataType: "json", success: function (data) {
            if (data.username && data.id != 0) {
                window.lkuser = data;
                window.sessionStorage.lkuser = JSON.stringify(data);
                window.sessionStorage.longtime = new Date().getTime();
                // $("#loginUser").show().find('.username').html(data.username);
                $("#loginUser").show().find('img').attr({'src': data.avatar, 'title': data.username});
                $("#noLoginUser").hide();
            } else {
                window.sessionStorage.removeItem("lkuser");//清除系统user;
                $("#noLoginUser").show();
                $("#loginUser").hide();
            }
        }
    });
}
/*登出系统*/
function logout() {
    $.ajax({type: "GET", cache: false, dataType: 'json', url: '/i/user/logout'}).success(function (data) {
    });
    localStorage.clear();
    sessionStorage.clear();//清除系统user;
    window.location.href = "../../index.html";
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
function watchNavigator() {///监测浏览器版本
    if(navigator.appName == "Microsoft Internet Explorer"){
        if(navigator.appVersion.match(/7./i)=="7."|| navigator.appVersion.match(/8./i)=="8."|| navigator.appVersion.match(/9./i)=="9."){
            console.log(navigator.appVersion+'--it is IE');
            alert('您的浏览器版本过低，可能部分功能不能完美实现。请更换网页底部推荐的浏览器，来获取更佳体验！')
        }
    }else{
        console.log(navigator.appVersion+'--it is perfect!');
    }
}
/*将所有数据赋值给form表单*/
function getDataToForm(inputArr, data) {
    var nameArr = [];
    $.each(inputArr, function (index, item) {
        if (nameArr.contains($(item).attr("name")) == -1) {
            nameArr.push($(item).attr("name"));
            var val = eval("data." + $(item).attr("name"));
            $(item).val(val);
        }
    });
}
//解决IE8不支持forEach()
//在你调用 forEach 之前 插入下面的代码，在本地不支持的情况下使用 forEach()
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
/*safari时间不支持解决*/
var formatTime = {
    standTime:function (date) {
        return new Date(Date.parse(date.replace(/-/g, "/")))
    },
    mseconds:function (date) {
        return new Date(Date.parse(date.replace(/-/g, "/"))).getTime()
    }
};
/*时间转换成2017-07-19 15:20：20*/
var formatDateTime = function (date) {
    date=new Date(Date.parse(date.replace(/-/g, "/")))
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
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+seconds;
};
/**
 * 工具类
 */
var util={
		  initialize: function() {
	            window.addEventListener('hashchange', function() { this.history.replaceState('hasHash','', window.location.hash); }, false);
	            window.addEventListener('popstate', function(e) {if (e.state) { if(initdata){ initdata(true);}else{ this.location.reload();}  } }, false);
	      },
		 getHashStringArgs:function() {
		    var hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : ""),hashArgs = {},items = hashStrings.length > 0 ? hashStrings.split("&") : [], item = null, name = null, value = null,i = 0,len = items.length;
		    for (i = 0; i < len; i++) {
		       item = items[i].split("=");
		       name = decodeURIComponent(item[0]);
		       value = decodeURIComponent(item[1]);
		       if (name.length > 0) {
		           hashArgs[name] = value;
		       }
		   }
		   return hashArgs;
	   },
	   setHashStringArgs:function(data,prefix,blacklist) {
		   if(prefix==undefined){prefix="";}
		   var val= null,hash=[];
		   for(var key in data){ 
			   if(blacklist&&blacklist.indexOf(key)>-1){continue;}
			   val= data[key];
			   if(val&&val!=""){  hash.push(prefix+key+"="+val); }
			 } 
		   if(hash.length>0){
			   window.location.hash=hash.join("&");
		   }
	   }
};


