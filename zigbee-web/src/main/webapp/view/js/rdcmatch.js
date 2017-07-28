var pagination={pageCount:-1,oldPageCount:-1};
var screenParam={goodtype:null,sqm:null,dataType:3,typeCode:1,keyword:null,provinceid:null,managetype:null,storagetempertype:null,pageNum:1,pageSize:10};
var rentDates=['','1个月以下','1~3个月','3~6个月','6~9个月','1年以上','两年以上','三年以上','五年以上'];
var goodsAllType=[''];
var unitPush=['吨','kg','吨'];
var storageManage=[];
var storageTemp=[];
var rentSqm=[];
var goodsTypeParam=[];
/*===============================================================出租求租=================================================================================*/
/*初始化冷库出租求租筛选条件*/
function initColdParam() {
    var manageType=['<li type="manage" value="0" class="activeType">不限</li>'];
    var tempType=['<li type="temp" value="0" class="activeType">不限</li>'];
    var provinceList=['<option value="">全部</option>'];
    $.ajax({url:"/i/rdc/findAllManageType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            manageType.push('<li type="manage" value="'+val.id+'">'+val.type+'</li>');
        });
        $("#manageType").empty().append(manageType.join(''));
    }});
    $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            tempType.push('<li type="temp" value="'+val.id+'">'+val.type+'</li>');
        });
        $("#temperType").empty().append(tempType.join(''));
    }});

    $.ajax({url:"/i/city/findProvinceList",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            provinceList.push('<option value="'+val.provinceId+'">'+val.provinceName+'</option>');
        });
        $("select[name=province]").empty().append(provinceList.join(''));
    }});

}


/*省市筛选*/
function changeProvince() {
    screenParam.provinceid=$(this).val();
    screenParam.pageNum=1;
    screenParam.dataType==3?initRentRdc():initGoodsList();
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
    screenParam.pageNum=1;
    initRentRdc();
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
    screenParam.pageNum=1;
    initRentRdc();
}

/*获取关键字*/
function getKeyword() {
    screenParam.pageNum=1;
    if(screenParam.dataType==3){
        screenParam.keyword=$("#keyword").val();
        initRentRdc();
    }else{
        screenParam.keyword=$("#goodsKeyword").val();
        initGoodsList();
    }
}

/*获得可出租面积*/
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
        rentSqm.splice(0,rentSqm.length);
        screenParam.sqm=null;
    }else {
        var index = rentSqm.contains(area);
        index==-1?rentSqm.push(area):rentSqm.splice(index,1);
        screenParam.sqm=rentSqm.join();
    }
    screenParam.pageNum=1;
    initRentRdc();
}

/*初始化出租求租冷库列表*/
function initRentRdc() {
    var rentRdcArr=['<ul class="msgHeader clearfix"><li></li><li class="msgTitle">冷库信息</li><li>面积·㎡</li><li>单价·元/天/㎡</li><li>温度类型</li><li>租期</li><li>操作</li></ul>'];
    $.ajax({url:"/i/ShareRdcController/newGetSERDCList",async:false,type:"post",data:screenParam,success:function (data) {
        pagination.pageCount=data.totalPages;
        $.each(data.data, function (index, rentRdc) {
            var collectWords='<button class="collect" onclick="collection(this,'+rentRdc.id+')"><i class="iconfont orange">&#xe634;</i><em>收藏</em></button>';
            for(var j=0;j<rentRdc.collectUserIds.length;j++){
                if(window.lkuser){
                    if(rentRdc.collectUserIds[j]==window.lkuser.id){
                        collectWords='<button class="collect" onclick="collection(this,'+rentRdc.id+')"><i class="iconfont orange isLike">&#xe637;</i><em>已收藏</em></button>';
                    }
                }
            }
            rentRdcArr.push('<ul class="msgBody clearfix"><li><img src="'+rentRdc.logo+'" alt=""></li><li class="msgTitle"><p>'+rentRdc.title+'</p><p><i class="iconfont">&#xe648;</i>'+rentRdc.detlAddress+'</p></li><li>'+rentRdc.sqm+'</li><li>'+rentRdc.unitPrice+'</li><li>'+rentRdc.codeLave2+'</li><li>'+rentDates[rentRdc.rentdate]+'</li><li><button class="look" onclick="showRdcDetail('+rentRdc.id+')"><i class="iconfont">&#xe610;</i>查看</button>'+collectWords+'</li></ul>');
        });
        //rentRdcArr.push('<div id="coldPage" class="listPage"></div>');
        $("#coldList").empty().append(rentRdcArr.join(''));
        if (pagination.oldPageCount==-1||pagination.oldPageCount!=pagination.pageCount){flushPage('coldPage');}
    }});
}

function showRdcDetail(id) {
    $.ajax({url:"/i/ShareRdcController/getSEByID.json",type:"get",data:{id:id},success:function (data) {
        var share=data.entity;
        var modalHtml=['<div class="infoModal"><ul id="infoImg" class="infoImg clearfix layer-photos-demo">'];
        if(share.files){
            $.each(share.files,function (index, file) {
               modalHtml.push('<li><img src="'+file+'" alt=""></li>');
            });
        }else {
            modalHtml.push('<li><img src="'+share.logo+'" alt=""></li>');
        }
        var phone;
        if(window.lkuser){
            phone=share.telephone;
        }else {
            localStorage.OURL=window.location.href;
            phone='<a href="login.html">登录后显示</a>';
        }
        modalHtml.push('</ul><h3 class="orange">基本信息</h3><ol><li><div>联系电话:</div><div>'+phone+'</div></li>');
        if(share.rdcID&&share.rdcID!=0){
            var isAudit='<b class="reachStand"><i class="iconfont">&#xe63b;</i>未认证</b>';
            var isStand='';
            if(share.audit==2){isAudit='<b class="approve"><i class="iconfont">&#xe6ac;</i>已认证</b>';}
            if(share.istemperaturestandard==1){isStand='<b class="reachStand"><i class="iconfont">&#xe6e9;</i>冷链委温度达标库</b>';}
            modalHtml.push('<li><div>关联冷库:</div><div>'+share.name+'</div>'+isAudit+isStand+'</li>');
            modalHtml.push('<li><div>地址:</div><div>'+share.address+'</div></li>');
            modalHtml.push('<li><div>信息完整度:</div><div>'+share.infoIntegrity+'%</div></li></ol>');

        }
        modalHtml.push('<h3 class="orange">其他信息</h3><ol>');
        var note=clearUndefined(share.note);
        if(screenParam.dataType==3){
            if(screenParam.typeCode==1){
                modalHtml.push('<li><div>出租面积:</div><div>'+share.sqm+'平方米</div></li>');
            }else {
                modalHtml.push('<li><div>求租面积:</div><div>'+share.sqm+'平方米</div></li>');
            }
            modalHtml.push('<li><div>单价:</div><div>'+share.unitPrice+'元/天·平方米</div></li>');
            modalHtml.push('<li><div>租期:</div><div>'+rentDates[share.rentdate]+'</div></li>');
            modalHtml.push('<li><div>经营类型:</div><div>'+share.codeLave1+'</div></li>');
            modalHtml.push('<li><div>温度类型:</div><div>'+share.codeLave2+'</div></li>');
        }
        if(screenParam.dataType==1){
            modalHtml.push('<li><div>品类:</div><div>'+share.codeLave1+'</div></li>');
            modalHtml.push('<li><div>数量:</div><div>'+share.sqm+unitPush[share.publishunit]+'</div></li>');
            modalHtml.push('<li><div>单价:</div><div>'+share.unitPrice+'元/'+unitPush[share.publishunit]+'</div></li>');
        }
        modalHtml.push('<li><div>开始时间:</div><div>'+share.validStartTime+'</div></li>');
        modalHtml.push('<li><div>结束时间:</div><div>'+share.validEndTime+'</div></li>');
        modalHtml.push('<li><div>备注:</div><div>'+note+'</div></li></ol></div>');
        info(modalHtml.join(''),share.title);
    }});
}
/*===============================================================出售求购=================================================================================*/

/*初始化出售求购筛选条件*/
function initGoodsParam() {
    var goodsType=['<li type="goodsType" value="0" class="activeType">不限</li>'];
    $.ajax({url:"/i/ShareRdcController/getGDFilterData",type:"get",success:function (data) {
        supportForeach();
        goodsAllType=[''];
        data.entity.gt.forEach(function (val, index) {
            goodsType.push('<li type="goodsType" value="'+val.type_code+'">'+val.type_name+'/'+val.type_desc+'</li>');
            goodsAllType.push(val.type_name);
        });
        $("#goodsType").empty().append(goodsType.join(''));
        initGoodsList();
    }});
}

/*获得商品种类型*/
function getGoodsType() {
    if($(this).val()==0){
        goodsTypeParam.splice(0,storageTemp.length);
        screenParam.goodtype=null;
    }else {
        var index = goodsTypeParam.contains($(this).val());
        index==-1?goodsTypeParam.push($(this).val()):goodsTypeParam.splice(index,1);
        screenParam.goodtype=goodsTypeParam.join();
    }
    screenParam.pageNum=1;
    initGoodsList();
}

/*初始化出售求购列表*/
function initGoodsList() {
    var goodsArr=['<ul class="msgHeader clearfix"><li></li><li class="msgTitle">货品信息</li><li>数量</li><li>单价</li><li>品类</li><li>发布时间</li><li>报价截止日</li><li>操作</li></ul>'];
    $.ajax({url:"/i/ShareRdcController/newGetSERDCList",async:false,type:"post",data:screenParam,success:function (data) {
        pagination.pageCount=data.totalPages;
        $.each(data.data, function (index, goods) {
            var oStart = new Date(goods.validStartTime).getTime(), oEnd = new Date(goods.validEndTime).getTime(),
                today = new Date().getTime();
            var deadline = oEnd - oStart;
            var days = deadline / 1000 / 60 / 60 / 24;
            var daysRound = Math.floor(days);//租期
            var hours = deadline / 1000 / 60 / 60 - (24 * daysRound);
            var hoursRound = Math.floor(hours);
            var minutes = deadline / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
            var minutesRound = Math.floor(minutes);
            var seconds = deadline / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
            var showDate = Math.floor((today - oStart) / 1000 / 60 / 60 / 24);
            var showTime = null;
            if (showDate >= 30) {
                showTime = Math.floor(showDate / 30) + '个月前发布';
            } else {
                if (showDate > 1) {
                    showTime = showDate + '天前发布';
                } else {
                    showTime = '刚刚发布';
                }
            }
            var collectWords='<button class="collect" onclick="collection(this,'+goods.id+')"><i class="iconfont orange">&#xe634;</i><em>收藏</em></button>';
            for(var j=0;j<goods.collectUserIds.length;j++){
                if(window.lkuser){
                    if(goods.collectUserIds[j]==window.lkuser.id){
                        collectWords='<button class="collect" onclick="collection(this,'+goods.id+')"><i class="iconfont orange isLike">&#xe637;</i><em>已收藏</em></button>';
                    }
                }
            }
            goodsArr.push('<ul class="msgBody clearfix"><li><img src="'+goods.logo+'" alt=""></li><li class="msgTitle"><p>'+goods.title+'</p><p><i class="iconfont">&#xe648;</i>'+goods.detlAddress+'</p></li><li>'+goods.sqm+unitPush[goods.publishunit]+'</li><li>'+goods.unitPrice+'元/'+unitPush[goods.publishunit]+'</li><li>'+goodsAllType[goods.codeLave1]+'</li><li>'+showTime+'</li><li>'+goods.validEndTime+'</li><li><button class="look" onclick="showRdcDetail('+goods.id+')"><i class="iconfont">&#xe610;</i>查看</button>'+collectWords+'</li></ul>');
        });
        $("#goodsList").empty().append(goodsArr.join(''));
        if (pagination.oldPageCount==-1||pagination.oldPageCount!=pagination.pageCount){flushPage('goodsPage');}
    }});
}



/*跳至发布页面*/
var addUrl=['rdcrelease.html','applyrent.html','salegoods.html','applygoods.html'];
function toAddInfo() {
    if(checkLogin()){
        var url;
        if(screenParam.dataType==3){
            url=screenParam.typeCode==1?addUrl[0]:addUrl[1];
        }
        if(screenParam.dataType==1){
            url=screenParam.typeCode==1?addUrl[2]:addUrl[3];
        }
        window.location.href=url;
    }
}

/*清除筛选数据*/
function clearParam() {
    pagination.oldPageCount=-1;
    screenParam.pageNum=1;
    screenParam.sqm=null;
    screenParam.keyword=null;
    screenParam.provinceid=null;
    screenParam.managetype=null;
    screenParam.storagetempertype=null;
    screenParam.goodtype=null;
}

/*初始化分页*/
function flushPage(em) {
    layui.use(['laypage', 'layer'], function(){
        var laypage = layui.laypage
            ,layer = layui.layer;
        laypage({
            cont: em
            ,pages: pagination.pageCount
            ,skin: '#1E9FFF',
            jump:function (obj,first) {
                screenParam.pageNum=obj.curr;
                pagination.oldPageCount=pagination.pageCount;
                if(first!=true){
                    initRentRdc();
                    window.scroll(0,300);//跳到顶部
                }
            }
        });
    });
}
$(function () {
    initColdParam();
    initRentRdc();
    $(".btnGroup button").click(function () {
        var oIndex = $(this).index();
        if(oIndex<4){
            $(this).addClass('active').siblings().removeClass('active');
            if (oIndex < 2) {
                $(".rentToggle").show().siblings('.goodsToggle').hide();//加载出租求租列表
                if (oIndex == 0) {
                    //console.log('初始化出租列表');
                    clearParam();
                    screenParam.dataType=3;
                    screenParam.typeCode=1;
                    initRentRdc();
                } else if (oIndex == 1) {
                    //console.log('初始化求租列表');
                    clearParam();
                    screenParam.dataType=3;
                    screenParam.typeCode=2;
                    initRentRdc();
                }
            } else if(oIndex<4){
                initGoodsParam();
                $(".goodsToggle").show().siblings('.rentToggle').hide();//加载出售求购列表
                if (oIndex == 2) {
                    //console.log('初始化出售列表');
                    screenParam.dataType=1;
                    screenParam.typeCode=1;
                    clearParam();
                } else if (oIndex == 3) {
                    //console.log('初始化求购列表');
                    screenParam.dataType=1;
                    screenParam.typeCode=2;
                    clearParam();
                }
            }
        }else{
            console.log('发布共享信息');
        }

    });

    $(document).on('click','.typeList li',function () {
        var oIndex = $(this).index();
        if (oIndex == 0) {//不限
            $(this).addClass('activeType').siblings('li').removeClass('activeType');
        } else {
            $(this).toggleClass('activeType');
            if ($(this).hasClass('activeType') == false && $(this).siblings('li').hasClass('activeType') == false) {
                $(this).parent().children().eq(0).addClass('activeType');
            } else {
                $(this).parent().children().eq(0).removeClass('activeType');
            }
        }
    });

    $(document).on('click','li[type=manage]',getManageType);
    $(document).on('click','li[type=temp]',getTempType);
    $(document).on('click','li[type=sqm]',getRdcSqm);
    $(document).on('click','li[type=goodsType]',getGoodsType);
    $("i[name=search]").bind('click',getKeyword);
    $("input[class=keyword]").keydown(function () {if(event.keyCode == "13") {getKeyword();}});
    $("#coldProvince,#goodsProvince").bind('change',changeProvince);
});
function collection(mark,id) {
    checkLogin();
    var olike = $(mark).children('i');
    if(olike.hasClass('isLike')){//已收藏
        $.ajax({
            url:"/i/collect/delByCollect",
            type:"post",
            data:{uid: window.lkuser.id,collectId: id, collectType: 2}
        });
        olike.html("&#xe634;");
        olike.removeClass('isLike');
        $(mark).children('em').html('收藏');
    }else {//未收藏
        $.ajax({
            url:"/i/collect/addCollectRdc",
            type:"post",
            data:{uid: window.lkuser.id,collectId: id, collectType: 2}
        });
        olike.html("&#xe637;");
        olike.addClass('isLike');
        $(mark).children('em').html('已收藏');
    }
}
function info(contentHtml,title) {
    layer.open({
        type: 1 //此处以iframe举例
        , title: title
        , area: ['60%', '50%']
        , shadeClose: true
        , shade: 0.6
        , maxmin: true
        , content: contentHtml
        , btn: ['关闭'] //只是为了演示
        , yes: function () {
            layer.closeAll();
        }
    });
    layer.photos({
        photos: '#infoImg'
        //,anim:3//0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
    });
}
