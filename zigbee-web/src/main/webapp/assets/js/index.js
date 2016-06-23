$(function() {
	//  侧栏下拉菜单暂时隐藏

	$(".list li").click(function(){
		addShowIFrame('son.html');
		$(this).addClass('highlight').siblings().removeClass('highlight')
		/*$(this).addClass("highlight")			//为当前元素增加highlight类
			.children(".liSon").slideDown().end()			//将子节点的ul元素显示出来并重新定位到上次操作的元素
		.siblings().removeClass("highlight")		//获取元素的兄弟元素，并去掉他们的highlight类
			.children(".liSon").slideUp();	*/			//将兄弟元素下的ul元素隐藏
	});
	$(".list li").first().click();
	$('span.edit').click(function(event) {
		$(this).addClass('editCur');
	});
	$('span.delete').click(function(event) {
		$(this).parent('td').parent('tr').remove();
	});
});
// 编辑按钮
function allSec(ops){
	/*var $span = $('#allSecSon');
	if ($span.prop('checked')) {
		$("tbody tr").find("input[type='checkbox']").prop('checked', false);		
	}else{
		$("tbody tr").find("input[type='checkbox']").prop('checked', true);
	}*/
	var $span = $('#allSecSon');
	if ($span.prop('checked')) {		
		$("tbody tr").find("input[type='checkbox']").prop('checked', true);
	}else{
		$("tbody tr").find("input[type='checkbox']").prop('checked', false);
	}
}
function showFixed(idValue , url){
	clearMenuActive();	
	$("#"+idValue).addClass("active");
	addShowIFrame(url);
}
function addShowIFrame(url){
    var iframe = '<iframe id="fill" name="fill" width=100% height=100% scrolling=auto frameborder="no" border="0" src="'+url+'"></iframe>';
    $("#main").html(iframe);
}

/*var del;
$('.edu_bcsp').click(function() {
	del=$(this).parent('.td260').parent('.bannerAll')
});
$('.btn_sc').click(function(del) {
	$("table").empty(del)
});*/