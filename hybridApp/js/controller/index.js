//封装打开新页面
function localtionURL(id,url){
	document.getElementById(id).addEventListener('tap', function() {
	  var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框  
	    webviewShow = plus.webview.create(id+".html");//后台创建webview并打开show.html  
	    webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件  
	        nwaiting.close(); //新webview的载入完毕后关闭等待框
	        webviewShow.show("slide-in-right",300); //把新webview窗体显示出来，显示动画效果为速度300毫秒的右侧移入动画  
	    }, false);  
	});
}
//动态加载数据进行页面跳转
function JumpPage(ClassIdName,Id){
	mui(ClassIdName).on("tap","li",function(){
		mui.openWindow({
		    url: $(this).data('url'),//强制要给li加上自定义属性data-url
		    id: Id,
		    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
		    waiting:{
		      autoShow:true,//自动显示等待框，默认为true
		      title:'正在加载...',//等待对话框上显示的提示内容
		    }
		});
	});
}
var app_url = 'http://120.55.169.194/api';
var img_url = 'http://115.28.180.99:92';
//关闭当前新增页在，刷新父页面opener()。
function parentview(){
	mui.back();
	var parentview = plus.webview.currentWebview().opener();
	parentview.reload(true);
	plus.webview.currentWebview().close();
}
//地址获取截取id方法
var GetRequest = function(url){//获取url，获取id的方法
	  var url = location.search; //获取url中"?"符后的字串
	  var theRequest = new Object();
	 	if (url.indexOf("?") != -1) {
	        var str = url.substr(1);
	        strs = str.split("&");
	        for(var i = 0; i < strs.length; i ++) {
	           theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
	        }
		}
	 return theRequest;
}