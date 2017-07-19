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
        if($(this).hasClass('activeType')==false && $(this).siblings('li').hasClass('activeType')==false){
            $(this).parent().children().eq(0).addClass('activeType');
        }else{
            $(this).parent().children().eq(0).removeClass('activeType');
        }
    }
});
jQuery(".picScroll-left").slide({easing:"linear",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true,vis:5});

/*功能组件*/
var pagination={pageCount:-1,oldPageCount:-1};
var screenParam={sqm:null,audit:null,hasCar:null,keyword:null,provinceid:null,goodSaveType:null,managetype:null,storagetempertype:null,istemperaturestandard:null,pageNum:1,pageSize:10};
var storageManage=[];
var storageTemp=[];
var tempStandard=[];
var audit=[];
var goodSave=[];
var rdcSqm=[];
var hasCar=[];
/*初始化出租冷库列表*/
function getRdcRentList() {
    var rdcRentInfo=[];
    $.ajax({url:"/i/rdc/newGetRdcList",async:false,type:"post",data:screenParam,success:function (data) {
        pagination.pageCount=data.totalPages;
        if(pagination.pageCount==-1||pagination.oldPageCount!=pagination.pageCount){flushPage();}
        var rdcRentList=data.data;
        supportForeach();
        rdcRentList.forEach(function (rdcRent, index) {
            var tempTypeStr=rdcRent.tempTypeStr?rdcRent.tempTypeStr:"";
            var manageTypeStr=rdcRent.manageTypeStr?rdcRent.manageTypeStr:"";
            rdcRentInfo.push('<li><div class="rdcImg"><a href="../html/rdcinfo.html?rdcId='+rdcRent.id+'"><img src="'+rdcRent.logo+'" alt=""></a>');
            if(rdcRent.istemperaturestandard==1){rdcRentInfo.push('<i>温度达标冷库</i>');}
            rdcRentInfo.push('</div><div class="rdcInfo"><div class="rdcTxt clearfix"><span class="rdcName omg fl"><a href="../html/rdcinfo.html?rdcId='+rdcRent.id+'">'+rdcRent.name+'</a></span><span class="infoPercenty fl">信息完整度:<b>'+rdcRent.infoIntegrity+'%</b></span><ul class="stars clearfix fl">');
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
            rdcRentInfo.push(' <a onclick="realTimeTem('+rdcRent.id+',\''+rdcRent.name+'\')">点击可查看实时库温</a></div><div class="rdcArea"><span>总面积'+rdcRent.sqm+'㎡</span>|<span>'+tempTypeStr+'</span><span>'+manageTypeStr+'</span></div><div class="rdcPosition"><b><i class="iconfont">&#xe648;</i>'+rdcRent.address+'</b></div></div><div class="rdcPrice">');
            var collectWords='<button class="collect" onclick="collection(this,'+rdcRent.id+')"><i class="iconfont orange">&#xe634;</i>收藏</button>';
            for(var j=0;j<rdcRent.collectUserIds.length;j++){
               if(window.lkuser){
                   if(rdcRent.collectUserIds[j]==window.lkuser.id){
                       collectWords='<button class="collect" onclick="collection(this,'+rdcRent.id+')"><i class="iconfont orange isLike">&#xe637;</i>已收藏</button>';
                   }
               }
            }
            if(rdcRent.sharedInfoEntity&&rdcRent.sharedInfoEntity.datatype==3&&rdcRent.sharedInfoEntity.typecode==1){rdcRentInfo.push('<p>可用面积<i class="orange">'+rdcRent.sharedInfoEntity.sqm+'</i>㎡</p><p class="rdcPriceNum blue">'+rdcRent.sharedInfoEntity.unitPrice+'</p><p>元/㎡/天</p>');}else {rdcRentInfo.push('<h3>暂无信息</h3>');}
            rdcRentInfo.push('</div><div class="rdcBtn">'+collectWords+'<button class="look"><a href="../html/rdcinfo.html?rdcId='+rdcRent.id+'"><i class="iconfont">&#xe610;</i>查看</a></button></div></li>');
        });
        $("#rdcRentList").empty().append(rdcRentInfo.join(''));
    }});
}
/*进入修改rdc*/
function updateRdc(rdcId) {
    window.sessionStorage.submitRdcStatus=1;
    window.location.href="/view/html/rdcaddcold.html?rdcId="+rdcId;
}
/*点击查看实时库温*/
function realTimeTem(rdcId,rdcName) {
    layer.open({
        type: 1 //Page层类型
        ,area: ['500px', '300px']
        ,title: rdcName+'实时库温'
        ,shade: 0.6 //遮罩透明度
        ,maxmin: true //允许全屏最小化
        ,anim: 2 //0-6的动画形式，-1不开启
        ,content: '<div style="padding:50px;">'+rdcName+'还没有加入冷库360，请致电400-853-5606联系~</div>'
    });
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
        supportForeach();
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
        case 3:area="3000~6000";
        break;
        case 4:area="6000~12000";
        break;
        case 5:area="12000~20000";
        break;
        case 6:area=">20000";
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
/*获得冷藏车情况*/
function getHasCar() {
    if($(this).val()==-1){
        hasCar.splice(0,hasCar.length);
        screenParam.hasCar=null;
    }else {
        var index = hasCar.contains($(this).val());
        index==-1?hasCar.push($(this).val()):hasCar.splice(index,1);
        screenParam.hasCar=hasCar.join();
    }
    getRdcRentList();
}
/*更改为添加状态*/
function getAddStatus() {
    window.sessionStorage.submitRdcStatus=0;
}

function collection(mark,id) {
    checkLogin();
    var olike = $(mark).children('i');
    if(olike.hasClass('isLike')){//已收藏
        $.ajax({
            url:"/i/collect/delByCollect",
            type:"post",
            data:{uid: window.lkuser.id,collectId: id, collectType: 1}
        });
        olike.html("&#xe634;");
        olike.removeClass('isLike');
    }else {//未收藏
        $.ajax({
            url:"/i/collect/addCollectRdc",
            type:"post",
            data:{uid: window.lkuser.id,collectId: id, collectType: 1}
        });
        olike.html("&#xe637;");
        olike.addClass('isLike');
    }
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
    $("li[type=hasCar]").bind('click',getHasCar);
    $("#search").bind('click',getKeyword);
    $("#keyword").keydown(function () {if(event.keyCode == "13") {getKeyword();}});
    $("li[type=rdcSqm]").bind('click',getRdcSqm);
});

