/*$(".moreBtn").click(function(){
    $(".moreType").slideToggle();
});*/
/*样式组件*/
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

/*功能组件*/
var pagination={currentPage:1,pageSize:5,pageCount:0};
function getRdcList() {
    $.ajax({url:"/i/rdc/newGetRDCList",type:"post",data:{"pageNum":pagination.currentPage,"pageSize":pagination.pageSize},success:function (data) {
        pagination.pageCount=data.total;
    }});
}
layui.use(['laypage', 'layer'], function(){
    var laypage = layui.laypage
    laypage({
        cont: 'demo2'
        ,pages: pagination.pageCount
        ,skin: '#1E9FFF',
        jump:function (obj) {
            pagination.currentPage=obj.curr;
            getRdcList();
        }
    });
});
$(function () {
    getRdcList();
});
