var ajaxcont = 0, ui_laypage, pagination = {pageCount: -1, oldPageCount: -1}
    , sqmmode = ["", "<1000", "1000~3000", "3000~6000", "6000~12000", "12000~20000", ">20000"]
    , screenParam = {
    uid: null,
    sqm: null,
    audit: null,
    hasCar: null,
    keyword: null,
    provinceid: null,
    goodSaveType: null,
    managetype: null,
    storagetempertype: null,
    istemperaturestandard: null,
    pageNum: 1,
    pageSize: 10
};
/*初始化出租冷库列表*/
function getRdcRentList() {
    var rdcRentInfo = [];
    $("#rdcRentList").empty();
    PageUtil.setHashStringArgs(screenParam, "ul_", "sqm");
    if (window.lkuser) {
        screenParam.uid = window.lkuser.id;
    }
    if(screenParam.audit==0){screenParam.audit='0,1';}
    $.ajax({
        url: "/i/rdc/newGetRdcList", type: "post", cache: false, data: screenParam, success: function (data) {
            pagination.pageCount = data.totalPages;
            if(screenParam.audit=='0,1'){screenParam.audit=0;}
            if (pagination.pageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                flushPage();
            }
            var rdcRentList = data.data;
            rdcRentList.forEach(function (rdcRent, index) {
                var tempTypeStr = rdcRent.tempTypeStr ? rdcRent.tempTypeStr : "";
                var manageTypeStr = rdcRent.manageTypeStr ? rdcRent.manageTypeStr : "";
                rdcRentInfo.push('<li><div class="rdcImg"><a href="rdcinfo.html?rdcId=', rdcRent.id, '"><img src="', rdcRent.logo, '" alt=""></a>');
                if (rdcRent.istemperaturestandard == 1) {
                    rdcRentInfo.push('<i>温度达标冷库</i>');
                }
                rdcRentInfo.push('</div><div class="rdcInfo"><div class="rdcTxt clearfix"><span class="rdcName omg fl"><a  href="rdcinfo.html?rdcId=', rdcRent.id, '">', rdcRent.name, '</a></span><span class="infoPercenty fl">信息完整度:<b>', rdcRent.infoIntegrity, '%</b></span><ul class="stars clearfix fl">');
                rdcRentInfo.push('</ul></div><div class="rdcApprove">');
                rdcRent.audit == 2 ? rdcRentInfo.push('<b class="approve"><i class="iconfont">&#xe6ac;</i>已认证</b>') : rdcRentInfo.push('<b class="reachStand"><i class="iconfont">&#xe63b;</i>未认证</b>');
                if (rdcRent.istemperaturestandard == 1) {
                    rdcRentInfo.push('<b class="reachStand"><i class="iconfont">&#xe6e9;</i>冷链委温度达标库</b>');
                }
                if (window.lkuser && window.lkuser.vipType > 0) {
                    rdcRentInfo.push('<a onclick="realTimeTem(', rdcRent.id, ',\'', rdcRent.name, '\')">点击可查看实时库温</a></div><div class="rdcArea"><span>总面积', rdcRent.sqm, '㎡</span>|<span>', tempTypeStr, '</span><span>', manageTypeStr, '</span></div>',
                        '<div class="rdcPosition"><b><i class="iconfont">&#xe648;</i>', rdcRent.address, '</b></div></div><div class="rdcPrice">');
                } else {
                    rdcRentInfo.push('</div><div class="rdcArea"><span>总面积', rdcRent.sqm, '㎡</span>|<span>', tempTypeStr, '</span><span>', manageTypeStr, '</span></div>',
                        '<div class="rdcPosition"><b><i class="iconfont">&#xe648;</i>', rdcRent.address, '</b></div></div><div class="rdcPrice">');
                }
                var collectWords = '<button class="collect" onclick="collection(this,' + rdcRent.id + ')"><i class="iconfont orange">&#xe634;</i><em>收藏</em></button>';
                if (rdcRent.collectType == 1) {
                    collectWords = '<button class="collect" onclick="collection(this,' + rdcRent.id + ')"><i class="iconfont orange isLike">&#xe637;</i><em>已收藏</em></button>';
                }

                if (rdcRent.sharedInfoEntity && rdcRent.sharedInfoEntity.datatype == 3 && rdcRent.sharedInfoEntity.typecode == 1) {
                    var price=rdcRent.sharedInfoEntity.unitPrice==0?'面议</p><p></p>':rdcRent.sharedInfoEntity.unitPrice+'</p><p>元/㎡/天</p>';
                    rdcRentInfo.push('<p>可用面积<i class="orange">', rdcRent.sharedInfoEntity.sqm, '</i>㎡</p><p class="rdcPriceNum blue">', price);
                } else {
                    rdcRentInfo.push('<h3>暂无信息</h3>');
                }
                rdcRentInfo.push('</div><div class="rdcBtn">', collectWords, '<button class="look" onclick="openurl('+rdcRent.id+')"><i class="iconfont">&#xe610;</i>查看</button></div></li>');
            });
            if (rdcRentInfo.length) {
                $("#rdcRentList").append(rdcRentInfo.join(''));
            } else {
                $("#rdcRentList").append('<li class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></li>');
            }

        }
    });
}
function openurl(id) {
    location.href="rdcinfo.html?rdcId="+id;
}
/*点击查看实时库温*/
function realTimeTem(rdcId, rdcName) {
    layer.open({
        type: 1 //Page层类型
        , area: ['500px', '300px']
        , title: rdcName + '实时库温'
        , shade: 0.6 //遮罩透明度
        ,shadeClose: true
        , maxmin: true //允许全屏最小化
        , anim: 2 //0-6的动画形式，-1不开启
        , content: '<div style="padding:50px;">该功能尚未开放，请耐心等待~</div>'
    });
}
/*刷新分页*/
function flushPage() {
    ui_laypage = layui.use(['laypage', 'layer'], function () {
        laypage = layui.laypage;
        laypage({
            cont: 'demo2'
            , pages: pagination.pageCount
//            ,skip:true
            , skin: '#1E9FFF'
            , curr: screenParam.pageNum, //获取hash值为fenye的当前页
            jump: function (obj, first) {
                screenParam.pageNum = obj.curr;
                pagination.oldPageCount = pagination.pageCount;
                if (first != true) {
                    getRdcRentList();
                    window.scroll(0, 300);//跳到顶部
                }
            }
        });
    });
}

/*change省市事件*/
function changeProvince() {
    screenParam.provinceid = $(this).val();
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获得冷库经营类型*/
function getManageType() {
    var slvalue = setStyle("#ul_managetype", this);
    screenParam.managetype = slvalue == -100 ? null : slvalue;
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获得冷库温度类型*/
function getTempType() {
    var slvalue = setStyle("#ul_storagetempertype", this);
    screenParam.storagetempertype = slvalue == -100 ? null : slvalue;
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获得达标冷库*/
function getTempStandard() {
    var slvalue = setStyle("#ul_istemperaturestandard", this);
    screenParam.istemperaturestandard = slvalue == -100 ? null : slvalue;
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获得冷库认证*/
function getAudit() {
    var slvalue = setStyle("#ul_audit", this);
    screenParam.audit = slvalue == -100 ? null : slvalue;
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获得商品存放类型*/
function getGoodSave() {
    var slvalue = setStyle("#ul_goodSaveType", this);
    screenParam.goodSaveType = slvalue == -100 ? null : slvalue;
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获得冷藏车情况*/
function getHasCar() {
    var slvalue = setStyle("#ul_hasCar", this);
    screenParam.hasCar = slvalue == -100 ? null : slvalue;
    getRdcRentList();
}
/*获取冷库总面积*/
function getRdcSqm() {
    var slvalue = setStyle("#ul_rdcsqm", this);
    if (slvalue == -100) {
        screenParam.sqm = null;
        screenParam.rdcsqm = null;
    } else {
        var sqm = [];
        slvalue.split(",").forEach(function (val, index) {
            sqm.push(sqmmode[val]);
        });
        screenParam.sqm = sqm.join();
        screenParam.rdcsqm = slvalue;
    }
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*获取关键字*/
function getKeyword() {
    screenParam.keyword = $("#ul_keyword").val();
    screenParam.pageNum = 1;
    getRdcRentList();
}
/*更改为添加状态*/
function getAddStatus() {
    window.sessionStorage.submitRdcStatus = 0;
}
function collection(mark, id) {
    checkLogin();
    var olike = $(mark).children('i');
    if (olike.hasClass('isLike')) {//已收藏
        $.ajax({
            url: "/i/collect/delByCollect",
            type: "post",
            data: {uid: window.lkuser.id, collectId: id, collectType: 1}
        });
        olike.html("&#xe634;");
        olike.removeClass('isLike');
        $(mark).children('em').html('收藏');
    } else {//未收藏
        $.ajax({
            url: "/i/collect/addCollectRdc",
            type: "post",
            data: {uid: window.lkuser.id, collectId: id, collectType: 1}
        });
        olike.html("&#xe637;");
        olike.addClass('isLike');
        $(mark).children('em').html('已收藏');
    }
}

function setStyle(parent, em) {
    var cutem = $(em), oIndex = cutem.index(), slval = [];
    if (oIndex == 0) {
        cutem.addClass('activeType').siblings('li').removeClass('activeType');
    } else {
        if ("radio" == cutem.attr("type")) {
            if (cutem.hasClass("activeType")) {
                cutem.removeClass('activeType');
                $(parent + " li:first").addClass('activeType');
            } else {
                $(parent + " li").removeClass('activeType');
                cutem.addClass('activeType');
            }
        } else {
            cutem.toggleClass('activeType');
            $(parent + " li.activeType").length == 0 ? $(parent + " li:first").addClass('activeType') : $(parent + " li:first").removeClass('activeType');
        }
    }
    $(parent + " li.activeType").each(function (a, b, c) {
        slval.push(b.value);
    });
    return slval.join(",");
}

function init_filter() {
    //经营类型
    if (window.localStorage.rdc_list_ManageType) {
        $("#ul_managetype").append(window.localStorage.rdc_list_ManageType);
        $("#ul_managetype li").bind('click', getManageType);
        inithostfilter();
    } else {
        $.ajax({
            url: "/i/rdc/findAllManageType", type: "get", success: function (data) {
                var manageList = [];
                data.forEach(function (val, index) {
                    manageList.push('<li  value="' + val.id + '" class="fl">' + val.type + '</li>');
                });
                var cache = manageList.join("");
                $("#ul_managetype").append(cache);
                window.localStorage.rdc_list_ManageType = cache;
                $("#ul_managetype li").bind('click', getManageType);
                inithostfilter();
            }
        });
    }
    //w温度类型
    if (window.localStorage.rdc_list_TemperType) {
        $("#ul_storagetempertype").append(window.localStorage.rdc_list_TemperType);
        $("#ul_storagetempertype li").bind('click', getTempType);
        inithostfilter();
    } else {
        $.ajax({
            url: "/i/rdc/findAllTemperType", type: "get", success: function (data) {
                var manageList = [];
                data.forEach(function (val, index) {
                    manageList.push('<li  value="' + val.id + '" class="fl">' + val.type + '</li>');
                });
                var cache = manageList.join("");
                $("#ul_storagetempertype").append(cache);
                window.localStorage.rdc_list_TemperType = cache;
                $("#ul_storagetempertype li").bind('click', getTempType);
                inithostfilter();
            }
        });
    }
    //商品存放类型
    if (window.localStorage.rdc_list_StorageType) {
        $("#ul_goodSaveType").append(window.localStorage.rdc_list_StorageType);
        $("#ul_goodSaveType li").bind('click', getGoodSave);
        inithostfilter();
    } else {
        $.ajax({
            url: "/i/rdc/findAllStorageType", type: "get", success: function (data) {
                var manageList = [];
                data.forEach(function (val, index) {
                    manageList.push('<li  value="' + val.id + '" class="fl">' + val.type + '</li>');
                });
                var cache = manageList.join("");
                $("#ul_goodSaveType").append(cache);
                window.localStorage.rdc_list_StorageType = cache;
                $("#ul_goodSaveType li").bind('click', getGoodSave);
                inithostfilter();
            }
        });
    }
    //初始化省
    if (window.localStorage.rdc_list_province) {
        $("#ul_provinceid").append(window.localStorage.rdc_list_province);
    } else {
        $.ajax({
            url: "/i/city/findProvinceList", type: "get", success: function (data) {
                var provinceArr = ['<option value="">全部</option>'];
                data.forEach(function (val, index) {
                    provinceArr.push('<option value="' + val.provinceId + '">' + val.provinceName + '</option>');
                });
                window.localStorage.rdc_list_province = provinceArr.join('');
                $("#ul_provinceid").empty().append(window.localStorage.rdc_list_province);

            }
        });
    }
    setTimeout(inithostfilter, 0);
}
function inithostfilter() {
    ajaxcont++;
    if (ajaxcont < 3) {
        return;
    }
    var histdata = PageUtil.getHashStringArgs(), key = null, val = null, em = null, type = null;
    if (!histdata.ul_pageNum) {
        return;
    }
	 screenParam = {
		uid : null,
		sqm : null,
		audit : null,
		hasCar : null,
		keyword : null,
		provinceid : null,
		goodSaveType : null,
		managetype : null,
		storagetempertype : null,
		istemperaturestandard : null,
		pageNum : 1,
		pageSize : 10
	};
    for (key in histdata) {
        val = histdata[key], em = $("#" + key);
        if (em.length > 0) {
            type = em[0].localName;
            if (type == "input" || type == "select") {
                em.val(val);
            } else if (em[0].localName == "ul") {
                $("#" + key + " li").removeClass("activeType");
                val.split(",").forEach(function (sval, index) {
                    $("#" + key + " li[value='" + sval + "']").addClass('activeType');
                });
            }
        }
        screenParam[key.substring(3)] = val;
    }


};


function initdata(isread) {
    if (isread) {
        $("#rdcRentList").empty();
        inithostfilter();
        getRdcRentList();
        flushPage();
    } else {
        init_filter();
        getRdcRentList();
        $("#ul_istemperaturestandard li").bind('click', getTempStandard);
        $("#ul_audit li").bind('click', getAudit);
        $("#ul_hasCar li").bind('click', getHasCar);
        $("#ul_rdcsqm li").bind('click', getRdcSqm);
        $("#ul_provinceid").bind('change', changeProvince);
        $("#search").bind('click', getKeyword);
        $("#ul_keyword").keydown(function () {
            if (event.keyCode == "13") {
                getKeyword();
            }
        });
        $(".moreBtn").click(function () {
            var flag = $(".moreType").is(":hidden");
            $(this).children('span').html(flag ? "收起" : "更多筛选");
            $(this).children('i').html(flag ? "&#xe630;" : "&#xe62e;");
            $(".moreType").slideToggle();
        });

        jQuery(".picScroll-left").slide({
            mainCell: ".bd ul",
            autoPage: true,
            effect: "leftLoop",
            autoPlay: true,
            vis: 5,
            scroll:3,
            delayTime:500,
            trigger: "click"
        });
        PageUtil.initialize();
    }

}
initdata();





   

