'use strict';
/**
 * 获得url参数
 * @param name
 * @returns
 */
function getUrlParam( name){var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  var r = window.location.search.substr(1).match(reg);  if (r!=null) return unescape(r[2]); return null; } 

var oHtml = document.documentElement;
function getFont(){
	var screenWidth = oHtml.clientWidth;
	if (screenWidth >= 1024) {
		oHtml.style.fontSize = "54.61333333333333px";//1024/(750/40)
	} else if (screenWidth <= 320) {
		oHtml.style.fontSize = "17.06666666666667px";//320/(750/40)
	} else{
		 oHtml.style.fontSize = screenWidth/(750/40)+'px';
	}
}
http://localhost:8080/zigbee%5Fmweb/
getFont();
// 当窗口发生改变的时候去改变根目录的font-size的值
$(window).resize(function(event) {getFont();});
//自动改变页面根目录字体大小
//返回上一级
function goback(){window.history.back();}
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
	})
});

