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
    var oIndex = $(this).index();
    if(oIndex==0){//不限
        $(this).addClass('activeType').siblings('li').removeClass('activeType');
    }else{
        $(this).toggleClass('activeType');
        $(this).parent().children().eq(0).removeClass('activeType');
    }
});
jQuery(".picScroll-left").slide({easing:"linear",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true,vis:5});

/*功能组件*/
var pagination={pageCount:-1,oldPageCount:-1};
var screenParam={sqm:null,audit:null,keyword:null,provinceid:null,goodSaveType:null,managetype:null,storagetempertype:null,istemperaturestandard:null,datatype:3,type:1,pageNum:1,pageSize:5};
var storageManage=[];
var storageTemp=[];
var tempStandard=[];
var audit=[];
var goodSave=[];
var rdcSqm=[];
/*初始化出租冷库列表*/
function getRdcRentList() {
    var rdcRentInfo=[];
    $.ajax({url:"/i/ShareRdcController/newGetSERDCList",async:false,type:"post",data:screenParam,success:function (data) {
        pagination.pageCount=data.totalPages;
        if(pagination.pageCount==-1||pagination.oldPageCount!=pagination.pageCount){flushPage();}
        var rdcRentList=data.data;
        rdcRentList.forEach(function (rdcRent, index) {
            rdcRentInfo.push('<li><div class="rdcImg"><a href="javascript:;"><img src="/'+rdcRent.logo+'" alt=""></a>');
            if(rdcRent.istemperaturestandard==1){rdcRentInfo.push('<i>温度达标冷库</i>');}
            rdcRentInfo.push('</div><div class="rdcInfo"><div class="rdcTxt clearfix"><span class="rdcName omg fl"><a href="javascript:;">'+rdcRent.name+'</a></span><span class="infoPercenty fl">信息完整度:<b>72%</b></span><ul class="stars clearfix fl">');
            for(var i=0;i<5;i++){
                if(i<rdcRent.rdcscore){
                    rdcRentInfo.push('<li><i class="iconfont">&#xe60c;</i></li>');
                }else {
                    rdcRentInfo.push('<li><i class="iconfont">&#xe604;</i></li>');
                }
            }
            rdcRentInfo.push('</ul></div><div class="rdcApprove">');
            rdcRent.audit==2?rdcRentInfo.push('<b class="approve"><i class="iconfont">&#xe6ac;</i>已认证</b>'):rdcRentInfo.push('<b class="reachStand"><i class="iconfont">&#xe63b;</i>未认证</b>');
            if(rdcRent.istemperaturestandard==1){rdcRentInfo.push('<b class="reachStand"><i class="iconfont">&#xe6e9;</i>冷链委温度达标库</b>');}
            rdcRentInfo.push(' <i>3号库实时温度：-17.6℃</i></div><div class="rdcArea"><span>总面积'+rdcRent.rdcSqm+'㎡</span>|<span>'+rdcRent.codeLave1+'</span><span>'+rdcRent.codeLave2+'</span></div><div class="rdcPosition"><b><i class="iconfont">&#xe648;</i>'+rdcRent.detlAddress+'</b></div></div><div class="rdcPrice"><p>可用面积<i class="orange">'+rdcRent.sqm+'</i>㎡</p><p class="rdcPriceNum blue">'+rdcRent.unitPrice+'</p><p>元/㎡/天</p></div><div class="rdcBtn"><button class="collect"><i class="iconfont orange">&#xe639;</i>收藏</button><button class="look"><i class="iconfont">&#xe610;</i>查看</button></div></li>');
        });
        $("#rdcRentList").empty().append(rdcRentInfo.join(''));
    }});
}
/*刷新分页*/
function flushPage() {
    layui.use(['laypage', 'layer'], function(){
        var laypage = layui.laypage
            ,layer = layui.layer;
        laypage({
            cont: 'demo2'
            ,pages: pagination.pageCount
            ,skin: '#1E9FFF',
            jump:function (obj) {
                screenParam.pageNum=obj.curr;
                pagination.oldPageCount=pagination.pageCount;
                getRdcRentList();
            }
        });
    });
}
/*初始化省市列表*/
function getProvinceList() {
    var provinceArr=[];
    $.ajax({url:"/i/city/findProvinceList",type:"get",success:function (data) {
        provinceArr.push('<option value="">全部</option>');
        data.forEach(function (val, index) {
            provinceArr.push('<option value="'+val.provinceId+'">'+val.provinceName+'</option>');
        });
        $("#provinceList").empty().append(provinceArr.join(''));
    }});
}
/*change省市事件*/
function changeProvince() {
    screenParam.provinceid=$(this).val();
    screenParam.pageNum=1;
    getRdcRentList();
}
/*获得冷库经营类型*/
function getManageType() {
    if($(this).val()==0){
        storageManage.splice(0,storageManage.length);
        screenParam.managetype=null;
    }else {
        var index = storageManage.contains($(this).val());
        index==-1?storageManage.push($(this).val()):storageManage.splice(index,1);
        screenParam.managetype=storageManage.join();
    }
    getRdcRentList();
}
/*获得冷库温度类型*/
function getTempType() {
    if($(this).val()==0){
        storageTemp.splice(0,storageTemp.length);
        screenParam.storagetempertype=null;
    }else {
        var index = storageTemp.contains($(this).val());
        index==-1?storageTemp.push($(this).val()):storageTemp.splice(index,1);
        screenParam.storagetempertype=storageTemp.join();
    }
    getRdcRentList();
}
/*获得达标冷库*/
function getTempStandard() {
    if($(this).val()==-1){
        tempStandard.splice(0,tempStandard.length);
        screenParam.istemperaturestandard=null;
    }else {
        var index = tempStandard.contains($(this).val());
        index==-1?tempStandard.push($(this).val()):tempStandard.splice(index,1);
        screenParam.istemperaturestandard=tempStandard.join();
    }
    getRdcRentList();
}
/*获得冷库认证*/
function getAudit() {
    if($(this).val()==-3){
        audit.splice(0,audit.length);
        screenParam.audit=null;
    }else {
        var index = audit.contains($(this).val());
        index==-1?audit.push($(this).val()):audit.splice(index,1);
        if(audit.contains(-2)!=-1){audit.push(-1);audit.push(0);audit.push(1);}
        screenParam.audit=audit.join();
        if(audit.contains(-2)!=-1){audit.splice(audit.contains(-1),3);}
    }
    getRdcRentList();
}
/*获得商品存放类型*/
function getGoodSave() {
    if($(this).val()==0){
        goodSave.splice(0,goodSave.length);
        screenParam.goodSaveType=null;
    }else {
        var index = goodSave.contains($(this).val());
        index==-1?goodSave.push($(this).val()):goodSave.splice(index,1);
        screenParam.goodSaveType=goodSave.join();
    }
    getRdcRentList();
}
/*获取关键字*/
function getKeyword() {
    screenParam.keyword=$("#keyword").val();
    getRdcRentList();
}
/*获取冷库总面积*/
function getRdcSqm() {
    var area;
    switch ($(this).val()){
        case 1:area="<1000";
        break;
        case 2:area="1000~3000";
        break;
        case 3:area="3000~5000";
        break;
    }
    if($(this).val()==0){
        rdcSqm.splice(0,rdcSqm.length);
        screenParam.sqm=null;
    }else {
        var index = rdcSqm.contains(area);
        index==-1?rdcSqm.push(area):rdcSqm.splice(index,1);
        screenParam.sqm=rdcSqm.join();
    }
    getRdcRentList();
}
$(function () {
    getRdcRentList();
    getProvinceList();
    $("#provinceList").bind('change',changeProvince);
    $("li[type=manage]").bind('click',getManageType);
    $("li[type=temp]").bind('click',getTempType);
    $("li[type=tempStandard]").bind('click',getTempStandard);
    $("li[type=isAudit]").bind('click',getAudit);
    $("li[type=goodSave]").bind('click',getGoodSave);
    $("#search").bind('click',getKeyword);
    $("#keyword").keydown(function () {if(event.keyCode == "13") {getKeyword();}});
    $("li[type=rdcSqm]").bind('click',getRdcSqm);
});

