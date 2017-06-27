/*$(".moreBtn").click(function(){
    $(".moreType").slideToggle();
});*/
$(".moreBtn").click(function() {
    var flag=$(".moreType").is(":hidden");
    $(this).children('span').html( flag ?  "收起" : "更多筛选");
    $(this).children('i').html( flag ?  "&#xe630;" : "&#xe62e;");
    $(".moreType").slideToggle();
});
$(".typeList li").click(function () {
    $(this).toggleClass('activeType');
});
jQuery(".picScroll-left").slide({easing:"linear",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true,vis:5});