var smartCold = "http://www.smartcold.org.cn/";
if(localStorage.user){
	var user = JSON.parse(localStorage.user);
}else{
	LocalUrl();
}
function LocalUrl(){
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
 function formatTimeToMinute(timeString) {
    return formatTime(timeString).substring(0, 16);
}

var getFormatTimeString = function (delta) {
    delta = delta ? delta + 8 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/, "")
}