$(".sidebar").height($(document).height());
function secLi(ops,url){
	$(ops).addClass('highlight').siblings().removeClass('highlight');
	$(".sidebar").height(0);
	$(".sidebar").height($(document).height());
	window.location.href=url;
}
window.onresize = function(){
	var view_width = window.innerWidth;
	$(".sidebar").height(0);
	$(".sidebar").height($(document).height());
	//console.log(view_width)
	if(view_width<768){
		$(".sidebar").hide();
		$(".side_toggle").show();
	}else{
		$(".sidebar").show();
		$(".side_toggle").hide();
	}
}
$(".side_toggle").click(function(){
	$(this).hide();
	$(".sidebar").show();
})