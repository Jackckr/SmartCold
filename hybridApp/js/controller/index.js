var smartCold = "http://cold360.cn/";
if(localStorage.user){
	var user = JSON.parse(localStorage.user);
}else{
	LocalUrl();
}
function LocalUrl(){
	clearCookie();
	mui.openWindow({
	    url: 'login.html',
	    id: 'login.html',
	    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    waiting:{
	      autoShow:true,//自动显示等待框，默认为true
	      title:'正在加载...',//等待对话框上显示的提示内容
	    }
	});
}
//时间格式化
 var formatTime = function(timeString) {
    if (typeof (timeString) == "string") {
        return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "");
    } else {
        return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "");
    }
};
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function formatTimeToMinute(timeString) {
    return formatTime(timeString).substring(0, 16);
}
function formatTimeToDay(timeString){
    return formatTime(timeString.substring(0,10)).substring(0,10)
}

var getFormatTimeString = function (delta) {
    delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
}
function clearCookie(){//清除cookie和localstorage
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    localStorage.clear();
    if (keys) {
        for (var i =  keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }    
}
