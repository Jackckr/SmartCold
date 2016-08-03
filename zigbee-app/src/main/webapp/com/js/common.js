'use strict';
var ER={root:"http://liankur.com/"};//var ER={root:"http://192.168.1.136:8080"};
/**
 * 获得url参数
 * @param name
 * @returns
 */
function getUrlParam( name){var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  var r = window.location.search.substr(1).match(reg);  if (r!=null) return unescape(r[2]); return null; } 

var oHtml = document.documentElement;
function getFont(){
	var screenWidth = oHtml.clientWidth;	
	var screenHeight = oHtml.clientHeight;//处理横屏时候字体变大问题
	if(screenWidth>screenHeight){
		screenWidth=screenHeight
	}
	if (screenWidth >= 1024) {
		oHtml.style.fontSize = "54.61333333333333px";//1024/(750/40)
	} else if (screenWidth <= 320) {
		oHtml.style.fontSize = "17.06666666666667px";//320/(750/40)
	} else{
		 oHtml.style.fontSize = screenWidth/(750/40)+'px';
	}
}
getFont();
// 当窗口发生改变的时候去改变根目录的font-size的值
$(window).resize(function(event) {getFont();});
//自动改变页面根目录字体大小
//返回上一级
function goback(){window.history.back();}
/*倒计时获取验证码*/
var countdown=60; 
function setTime(obj) { 
    if (countdown == 0) { 
    	obj.removeAttribute("disabled");    
        obj.style.background='#438BCB';
        obj.innerHTML="获取验证码"; 
        countdown = 60; 
        return;        
    } else { 
    	if ($(obj).siblings('input').val().length==0) {
    		alert('输入不能为空哦~');
    		return false;
    	} else{    		
	        obj.setAttribute("disabled", true); 
	        obj.style.background='#ccc';
	        obj.innerHTML="重新发送(" + countdown + ")"; 
	        countdown--; 
    	}
    } 

	setTimeout(function() {setTime(obj)},1000);
}
$(function() {
	//双箭头js
	$('.next').click(function(){
		if($(this).prev().hasClass('black')){
			$(this).prev().removeClass('black');
			$(this).children().html('&#xe64c;');
		}else{
			$(this).prev().addClass('black');
			$(this).children().html('&#xe68b;');
		}
	});
	//右方向箭头切换下方向箭头
	$(".mySelect select").bind({
    	'click':function(event){
    		$(this).parent().siblings('i').html('&#xe607;')
    	},
    	'change':function(event){
    		$(this).parent().siblings('i').html('&#xe60d;')
    	}
    })
});

