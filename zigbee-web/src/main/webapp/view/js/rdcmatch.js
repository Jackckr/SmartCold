var pagination = {pageCount: -1, oldPageCount: -1};
var screenParam = {
    flag: null,
    uid: null,
    goodtype: null,
    sqm: null,
    dataType: 3,
    typeCode: 1,
    keyword: null,
    provinceid: null,
    cityid: null,
    managetype: null,
    storagetempertype: null,
    pageNum: 1,
    pageSize: 10
};
var rentDates = ['', '1个月以下', '1~3个月', '3~6个月', '6~9个月', '1年以上', '两年以上', '三年以上', '五年以上'];
var goodsAllType = [''];
var unitPush = ['吨', 'kg', '吨'];
/*===============================================================出租求租=================================================================================*/
/*初始化冷库出租求租筛选条件*/
function initColdParam() {
    var manageType = ['<li type="manage" value="0" class="activeType">不限</li>'];
    var tempType = ['<li type="temp" value="0" class="activeType">不限</li>'];
    var provinceList = [];
    supportForeach();
    if (screenParam.flag < 2) {
        $.ajax({
            url: "/i/rdc/findAllManageType", type: "get", success: function (data) {
                data.forEach(function (val, index) {
                    manageType.push('<li type="manage" value="' + val.id + '">' + val.type + '</li>');
                });
                $("#managetype").empty().append(manageType.join(''));
                if (screenParam.managetype != null && screenParam.managetype != "") {
                    $("#managetype li").removeClass("activeType");
                    screenParam.managetype.split(",").forEach(function (sval, index) {
                        $("#managetype li[value='" + sval + "']").addClass('activeType');
                    });
                }
            }
        });
        $.ajax({
            url: "/i/rdc/findAllTemperType", type: "get", success: function (data) {
                data.forEach(function (val, index) {
                    tempType.push('<li type="temp" value="' + val.id + '">' + val.type + '</li>');
                });
                $("#storagetempertype").empty().append(tempType.join(''));
                if (screenParam.storagetempertype != null && screenParam.storagetempertype != "") {
                    $("#storagetempertype li").removeClass("activeType");
                    screenParam.storagetempertype.split(",").forEach(function (sval, index) {
                        $("#storagetempertype li[value='" + sval + "']").addClass('activeType');
                    });
                }
            }
        });

    } else if (screenParam.flag < 4) {
        var goodsType = ['<li type="goodsType" value="0" class="activeType">不限</li>'];
        $.ajax({
            url: "/i/ShareRdcController/getGDFilterData", type: "get", success: function (data) {
                supportForeach();
                goodsAllType = [''];
                data.entity.gt.forEach(function (val, index) {
                    goodsType.push('<li type="goodsType" value="' + val.type_code + '">' + val.type_name + '/' + val.type_desc + '</li>');
                    goodsAllType.push(val.type_name);
                });
                $("#goodsType").empty().append(goodsType.join(''));
                if (screenParam.goodtype != null && screenParam.goodtype != "") {
                    $("#goodsType li").removeClass("activeType");
                    screenParam.goodtype.split(",").forEach(function (sval, index) {
                        $("#goodsType li[value='" + sval + "']").addClass('activeType');
                    });
                }
                initGoodsList();
            }
        });
    }
    $.ajax({
        url: "/i/city/findProvinceList", type: "get", success: function (data) {
            provinceList=['<li value="-100" class="fl activeType" type="radio">不限</li>']
            data.forEach(function (val, index) {
                provinceList.push('<li type="radio" class="fl" value="' + val.provinceId + '">' + val.provinceName + '</li>');
            });
            $("ul[name=provinceid]").empty().append(provinceList.join(''));
            if (screenParam.provinceid != null && screenParam.provinceid != "") {
                $("ul[name=provinceid] li").removeClass("activeType");
                screenParam.provinceid.split(",").forEach(function (sval, index) {
                    $("ul[name=provinceid] li[value='" + sval + "']").addClass('activeType');
                });
                $(".ul_cityid").empty().show().append(window.localStorage.match_list_city);
                if( screenParam.cityid){
                    $(".ul_cityid li").removeClass("activeType");
                    screenParam.cityid.split(",").forEach(function (a, b) {
                        $(".ul_cityid li[value='" + a + "']").addClass('activeType');
                    });
                }
            }
        }
    });
    if (screenParam.sqm != null && screenParam.sqm != "") {
        $("#sqm li").removeClass("activeType");
        screenParam.sqm.split(",").forEach(function (sval, index) {
            $("#sqm li[value='" + sval + "']").addClass('activeType');
        });
    }
    if (screenParam.keyword != "" && screenParam.keyword != null) {
        $("[name=keyword]").val(screenParam.keyword);
    }
}

/*省市筛选*/
function changeProvince() {
    if($(this).hasClass('activeType')){
        screenParam.provinceid = $(this).val();
    }else{
        screenParam.provinceid=''
    }
    screenParam.pageNum = 1;
    if(screenParam.provinceid==''||screenParam.provinceid==-100){
        screenParam.cityid = '';
        screenParam.provinceid = '';
        $(".ul_cityid").empty().hide();
    }else{
        //初始化城市
        $.ajax({
            url: "/i/city/findCitysByProvinceId",data:{provinceID:screenParam.provinceid},type: "get", success: function (data) {
                var cityArr = ['<li class="fl activeType" value="-100">全部</li>'];
                data.forEach(function (val, index) {
                    cityArr.push('<li class="fl" value="' + val.cityID + '">' + val.cityName + '</li>');
                });
                window.localStorage.match_list_city = cityArr.join('');
                $(".ul_cityid").empty().show().append(window.localStorage.match_list_city);
            }
        });
    }
    screenParam.dataType == 3 ? initRentRdc() : initGoodsList();
}
function changecity() {
    var slval = [],aLI=$(this).parent().children(".activeType");
    aLI.each(function (a, b) {slval.push(b.value);});
    var slvalue = slval.join(",");
    if(slvalue==-100){slvalue=null}
    screenParam.cityid = slvalue;
    screenParam.pageNum = 1;
    screenParam.dataType == 3 ? initRentRdc() : initGoodsList();
}
/*获得冷库经营类型*/
function getManageType() {
    if ($(this).val() == 0) {
        screenParam.managetype = null;
    } else {
        var storageManage = [];
        if (screenParam.managetype != null && screenParam.managetype != "") {
            storageManage = screenParam.managetype.split(',');
        }
        var index = storageManage.contains($(this).val() + "");
        index == -1 ? storageManage.push($(this).val()) : storageManage.splice(index, 1);
        screenParam.managetype = storageManage.join();
    }
    screenParam.pageNum = 1;
    initRentRdc();
}

/*获得冷库温度类型*/
function getTempType() {
    if ($(this).val() == 0) {
        screenParam.storagetempertype = null;
    } else {
        var storageTemp = [];
        if (screenParam.storagetempertype != null && screenParam.storagetempertype != "") {
            storageTemp = screenParam.storagetempertype.split(',');
        }
        var index = storageTemp.contains($(this).val() + "");
        index == -1 ? storageTemp.push($(this).val()) : storageTemp.splice(index, 1);
        screenParam.storagetempertype = storageTemp.join();
    }
    screenParam.pageNum = 1;
    initRentRdc();
}

/*获取关键字*/
function getKeyword() {
    screenParam.pageNum = 1;
    if (screenParam.dataType == 3) {
        screenParam.keyword = $("#keyword").val();
        initRentRdc();
    } else {
        screenParam.keyword = $("#goodsKeyword").val();
        initGoodsList();
    }
}

/*获得可出租面积*/
function getRdcSqm() {
    if ($(this).val() == 0) {
        screenParam.sqm = null;
    } else {
        var rentSqm = [];
        if (screenParam.sqm != null && screenParam.sqm != "") {
            rentSqm = screenParam.sqm.split(',');
        }
        var index = rentSqm.contains($(this).val() + "");
        index == -1 ? rentSqm.push($(this).val()) : rentSqm.splice(index, 1);
        screenParam.sqm = rentSqm.join();
    }
    screenParam.pageNum = 1;
    initRentRdc();
}

/*初始化出租求租冷库列表*/
function initRentRdc() {
    PageUtil.setHashStringArgs(screenParam);
    if (window.lkuser) {
        screenParam.uid = window.lkuser.id;
    }
    var sqmmode = ["", "<1000", "1000~3000", "3000~6000", "6000~12000", "12000~20000", ">20000"];
    var saveSqm = screenParam.sqm;
    if (screenParam.sqm != null) {
        var sqmDetail = [];
        $.each(screenParam.sqm.split(), function (index, val) {
            sqmDetail.push(sqmmode[val]);
        });
        screenParam.sqm = sqmDetail.join();
    }
    var rentRdcArr = ['<ul class="msgHeader clearfix"><li></li><li class="msgTitle">冷库信息</li><li>面积·㎡</li><li>单价</li><li>温度类型</li><li>租期</li><li>操作</li></ul>'];
    $.ajax({
        url: "/i/ShareRdcController/newGetSERDCList",
        async: false,
        type: "post",
        data: screenParam,
        success: function (data) {
            pagination.pageCount = data.totalPages;
            screenParam.sqm = saveSqm;
            $.each(data.data, function (index, rentRdc) {
                var collectWords = '<button class="collect" onclick="collection(this,' + rentRdc.id + ')"><i class="iconfont orange">&#xe634;</i><em>收藏</em></button>';
                if (rentRdc.collectType == 1) {
                    collectWords = '<button class="collect" onclick="collection(this,' + rentRdc.id + ')"><i class="iconfont orange isLike">&#xe637;</i><em>已收藏</em></button>';
                }
                var oStart = formatTime.mseconds(rentRdc.validStartTime);
                var oEnd = formatTime.mseconds(rentRdc.validEndTime);
                var today = new Date().getTime();
                var deadline = oEnd - oStart;
                var days = deadline / 1000 / 60 / 60 / 24;
                var daysRound = Math.floor(days);//租期
                var showDate = Math.floor((today - oStart) / 1000 / 60 / 60 / 24);
                var showTime = null;
                var usefulDate = rentDates[rentRdc.rentdate];//有效期
                if (rentRdc.rentdate == undefined || rentRdc.rentdate == null || rentRdc.rentdate == 0) {
                    if (daysRound <= 30) {
                        usefulDate = '1个月以下';
                    } else {
                        if (daysRound / 30 >= 12) {
                            if (daysRound / 30 >= 12) {
                                usefulDate = '1年以上'
                            } else if (daysRound / 30 >= 24) {
                                usefulDate = '两年以上'
                            } else if (daysRound / 30 >= 36) {
                                usefulDate = '三年以上'
                            } else {
                                usefulDate = '五年以上'
                            }
                            usefulDate = (daysRound / 30 / 12).toFixed(1) + '年'
                        } else {
                            if (daysRound / 30 < 3) {
                                usefulDate = '1~3个月'
                            } else if (daysRound / 30 < 6) {
                                usefulDate = '3~6个月'
                            } else if (daysRound / 30 < 9) {
                                usefulDate = '6~9个月'
                            } else if (daysRound / 30 < 12) {
                                usefulDate = '9~12个月'
                            }
                        }
                    }
                }
                var price="",rdcAddress='';
                rentRdc.cityname==0||rentRdc.cityname==undefined?rdcAddress=rentRdc.provincename:rdcAddress=rentRdc.provincename+'-'+rentRdc.cityname;
                rdcAddress==undefined?rdcAddress=rentRdc.detlAddress:rdcAddress=rdcAddress;
                if(rentRdc.unit1&&rentRdc.unit2&&rentRdc.unit1!=""&&rentRdc.unit2!=""){
                    price = rentRdc.unitPrice == 0 ? '面议' : rentRdc.unitPrice+"元/"+rentRdc.unit1+"·"+rentRdc.unit2;
                }else {
                    price = rentRdc.unitPrice == 0 ? '面议' : rentRdc.unitPrice+"元/天·平方米";
                }
                rentRdcArr.push('<ul class="msgBody clearfix"><li><img src="' + rentRdc.logo + '" onclick="openurl(' + rentRdc.id + ')"></li><li class="msgTitle"><p class="blue" onclick="openurl(' + rentRdc.id + ')">' + rentRdc.title + '</p>' +
                    '<p><i class="iconfont">&#xe648;</i>' + rdcAddress + '</p></li><li>' + rentRdc.sqm + '</li><li>' + price + '</li>' +
                    '<li>' + rentRdc.codeLave2 + '</li><li>' + usefulDate + '</li>' +
                    '<li><button class="look" onclick="openurl(' + rentRdc.id + ')"><i class="iconfont">&#xe610;</i>查看</button>' + collectWords + '</li></ul>');
            });
            //rentRdcArr.push('<div id="coldPage" class="listPage"></div>');
            if (rentRdcArr.length > 1) {
                if (screenParam.typeCode == 1) {//出租
                    $("#coldList").show().empty().append(rentRdcArr.join(''));
                    $("#applyList").hide();
                } else {//求租
                    $("#applyList").show().empty().append(rentRdcArr.join(''));
                    $("#coldList").hide();
                }
            } else {
                if (screenParam.typeCode == 1) {//出租
                    $("#coldList").show().empty().append('<div class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></div>');
                    $("#applyList").hide();
                } else {//求租
                    $("#applyList").show().empty().append('<div class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></div>');
                    $("#coldList").hide();
                }
            }
            if (pagination.oldPageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                flushPage('coldPage');
            }
        }
    });
}
/*===============================================================出售求购=================================================================================*/

function openurl(id) {
    location.href="rdcmatchinfo.html?id=" + id;
}
/*获得商品种类型*/
function getGoodsType() {
    if ($(this).val() == 0) {
        screenParam.goodtype = null;
    } else {
        var goodsTypeParam = [];
        if (screenParam.goodtype != null && screenParam.goodtype != "") {
            goodsTypeParam = screenParam.goodtype.split(',');
        }
        var index = goodsTypeParam.contains($(this).val() + "");
        index == -1 ? goodsTypeParam.push($(this).val()) : goodsTypeParam.splice(index, 1);
        screenParam.goodtype = goodsTypeParam.join();
    }
    screenParam.pageNum = 1;
    initGoodsList();
}
var rentDate = ['', '1个月以下', '1~3个月', '3~6个月', '6~9个月', '1年以上', '两年以上', '三年以上', '五年以上'];
/*初始化出售求购列表*/
function initGoodsList() {
    PageUtil.setHashStringArgs(screenParam);
    if (window.lkuser) {
        screenParam.uid = window.lkuser.id;
    }
    var goodsArr = ['<ul class="msgHeader clearfix"><li></li><li class="msgTitle">货品信息</li><li>数量</li><li>单价</li><li>品类</li><li>发布时间</li><li>报价截止日</li><li>操作</li></ul>'];
    $.ajax({
        url: "/i/ShareRdcController/newGetSERDCList",
        async: false,
        type: "post",
        data: screenParam,
        success: function (data) {
            pagination.pageCount = data.totalPages;
            $.each(data.data, function (index, goods) {

                var oStart = formatTime.mseconds(goods.validStartTime);
                var oEnd = formatTime.mseconds(goods.validEndTime);
                var today = new Date().getTime();
                var validStartTime = formatTime.standTime(goods.validStartTime).getFullYear() + '-' +
                    (formatTime.standTime(goods.validStartTime).getMonth() + 1 < 10 ? '0' + (1 + formatTime.standTime(goods.validStartTime).getMonth()) : formatTime.standTime(goods.validStartTime).getMonth() + 1)
                    + '-' + formatTime.standTime(goods.validStartTime).getDate();
                var validEndTime = formatTime.standTime(goods.validEndTime).getFullYear() + '-' +
                    (formatTime.standTime(goods.validEndTime).getMonth() + 1 < 10 ? '0' + (1 + formatTime.standTime(goods.validEndTime).getMonth()) : formatTime.standTime(goods.validEndTime).getMonth() + 1)
                    + '-' + formatTime.standTime(goods.validEndTime).getDate();
                var deadline = oEnd - oStart;
                var days = deadline / 1000 / 60 / 60 / 24;
                var daysRound = Math.floor(days);//租期
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
                var usefulDate = rentDate[goods.rentdate];//有效期
                if (goods.rentdate == undefined || goods.rentdate == null || goods.rentdate == 0) {
                    if (daysRound < 30) {
                        usefulDate = daysRound + 1 + '天'
                    } else {
                        if (daysRound / 30 > 12) {
                            usefulDate = (daysRound / 30 / 12).toFixed(1) + '年'
                        } else {
                            usefulDate = (daysRound / 30).toFixed(1) + '个月'
                        }
                    }
                }

                var collectWords = '<button class="collect" onclick="collection(this,' + goods.id + ')"><i class="iconfont orange">&#xe634;</i><em>收藏</em></button>';
                if (goods.collectType == 1) {
                    collectWords = '<button class="collect" onclick="collection(this,' + goods.id + ')"><i class="iconfont orange isLike">&#xe637;</i><em>已收藏</em></button>';
                }
                var price = goods.unitPrice == 0 ? '面议' : goods.unitPrice + '元/' + unitPush[goods.publishunit],rdcAddress='';
                goods.cityname==0||goods.cityname==undefined?rdcAddress=goods.provincename:rdcAddress=goods.provincename+'-'+goods.cityname;
                rdcAddress==undefined?rdcAddress=goods.detlAddress:rdcAddress=rdcAddress;
                goodsArr.push('<ul class="msgBody clearfix"><li><img src="' + goods.logo + '" onclick="openurl(' + goods.id + ')"></li><li class="msgTitle"><p class="blue" onclick="openurl(' + goods.id + ')">' + goods.title + '</p>' +
                    '<p><i class="iconfont">&#xe648;</i>' + rdcAddress + '</p></li><li>' + goods.sqm + unitPush[goods.publishunit] + '</li>' +
                    '<li>' + price + '</li><li>' + goodsAllType[goods.codeLave1] + '</li><li>' + validStartTime + '</li><li>' + validEndTime + '</li>' +
                    '<li><button class="look"  onclick="openurl(' + goods.id + ')"><i class="iconfont">&#xe610;</i>查看</button>' + collectWords + '</li></ul>');
            });
            if (goodsArr.length > 1) {
                if (screenParam.typeCode == 1) {//出售
                    $("#goodsList").show().empty().append(goodsArr.join(''));
                    $("#applygoodsList").hide();
                } else {//求租
                    $("#applygoodsList").show().empty().append(goodsArr.join(''));
                    $("#goodsList").hide();
                }
            } else {
                if (screenParam.typeCode == 1) {
                    $("#goodsList").show().empty().append('<div class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></div>');
                    $("#applygoodsList").hide();
                } else {//求租
                    $("#applygoodsList").show().empty().append('<div class="nodata"><img src="../img/nodata.png" alt=""><p>暂无数据~</p></div>');
                    $("#goodsList").hide();
                }
            }
            if (pagination.oldPageCount == -1 || pagination.oldPageCount != pagination.pageCount) {
                flushPage('goodsPage');
            }
        }
    });
}

/*跳至发布页面*/
var addUrl = ['rdcrelease.html', 'applyrent.html', 'salegoods.html', 'applygoods.html'];
function toAddInfo() {
    sessionStorage.submitRdcStatus = 0;
    var url;
    if (screenParam.dataType == 3) {
        url = screenParam.typeCode == 1 ? addUrl[0] : addUrl[1];
    }
    if (screenParam.dataType == 1) {
        url = screenParam.typeCode == 1 ? addUrl[2] : addUrl[3];
    }
    window.location.href = url;
}

/*清除筛选数据*/
function clearParam() {
    pagination.oldPageCount = -1;
    screenParam.pageNum = 1;
    screenParam.sqm = null;
    screenParam.keyword = null;
    screenParam.provinceid = null;
    screenParam.cityid = null;
    screenParam.managetype = null;
    screenParam.storagetempertype = null;
    screenParam.goodtype = null;
    localStorage.removeItem('match_list_city')
}

/*初始化分页*/
function flushPage(em) {
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage
            , layer = layui.layer;
        laypage({
            cont: em
            , pages: pagination.pageCount
            , skin: '#1E9FFF',
            curr: screenParam.pageNum,
            jump: function (obj, first) {
                screenParam.pageNum = obj.curr;
                pagination.oldPageCount = pagination.pageCount;
                if (first != true) {
                    if(em=='goodsPage'){
                        initGoodsList();
                    }else{
                        initRentRdc();
                    }
                    window.scroll(0, 0);//跳到顶部
                }
            }
        });
    });
}

/*将url中的参数赋给页面*/
function inithostfilter() {
    var histdata = PageUtil.getHashStringArgs(), key = null, val = null, em = null, type = null, nem = null;
    if (!histdata.pageNum) {
        return;
    }
    for (key in histdata) {
        val = histdata[key];
        screenParam[key] = val;
    }
}
$(function () {
    if (screenParam.flag != null) {
        clearParam();
    }
    inithostfilter();
    initColdParam();
    if (screenParam.flag != null) {//刷新页面记录刷新之前位置
        var oIndex = screenParam.flag;
        if (oIndex < 4) {
            $('.btnGroup button').eq(oIndex).addClass('active').siblings().removeClass('active');
            if (oIndex < 2) {
                $(".rentToggle").show().siblings('.goodsToggle').hide();//加载出租求租列表
                initRentRdc();
            } else if (oIndex < 4) {
                $(".goodsToggle").show().siblings('.rentToggle').hide();//加载出售求购列表
            }
        } else {
            initRentRdc();
        }
    } else {
        screenParam.flag = 0;
        initRentRdc();
    }
    $(".btnGroup button").click(function () {
        $(".ul_cityid").empty().hide();
        screenParam.flag = $(this).val();
        initColdParam();
        var oIndex = $(this).index();
        if (oIndex < 4) {
            $(this).addClass('active').siblings().removeClass('active');
            if (oIndex < 2) {
                $(".rentToggle").show().siblings('.goodsToggle').hide();//加载出租求租列表
                if (oIndex == 0) {
                    //console.log('初始化出租列表');
                    screenParam.dataType = 3;
                    screenParam.typeCode = 1;
                } else if (oIndex == 1) {
                    //console.log('初始化求租列表');
                    screenParam.dataType = 3;
                    screenParam.typeCode = 2;
                }
                clearParam();
                initRentRdc();
            } else if (oIndex < 4) {
                $(".goodsToggle").show().siblings('.rentToggle').hide();//加载出售求购列表
                if (oIndex == 2) {
                    //console.log('初始化出售列表');
                    screenParam.dataType = 1;
                    screenParam.typeCode = 1;
                } else if (oIndex == 3) {
                    //console.log('初始化求购列表');
                    screenParam.dataType = 1;
                    screenParam.typeCode = 2;
                }
                clearParam();
            }
        } else {
            console.log('发布共享信息');
        }
    });

    $(document).on('click', '.typeList li', function () {
        var oIndex = $(this).index();
        if (oIndex == 0) {//不限
            $(this).addClass('activeType').siblings('li').removeClass('activeType');
        } else {
            if("radio" == $(this).attr("type")){
                if ($(this).hasClass("activeType")) {
                    $(this).removeClass('activeType');
                    $(this).parent().children('li').eq(0).addClass('activeType');
                    screenParam.provinceid='';
                    $(".ul_cityid").empty().hide();
                    localStorage.removeItem('match_list_city');
                } else {
                    $(this).addClass('activeType').siblings().removeClass('activeType');
                }
                screenParam.cityid = '';
            }else{
                $(this).toggleClass('activeType');
                if ($(this).hasClass('activeType') == false && $(this).siblings('li').hasClass('activeType') == false) {
                    $(this).parent().children().eq(0).addClass('activeType');
                } else {
                    $(this).parent().children().eq(0).removeClass('activeType');
                }
            }

        }
    });

    $(document).on('click', 'li[type=manage]', getManageType);
    $(document).on('click', 'li[type=temp]', getTempType);
    $(document).on('click', 'li[type=sqm]', getRdcSqm);
    $(document).on('click', 'li[type=goodsType]', getGoodsType);
    $("i[name=search]").bind('click', getKeyword);
    $("input[class=keyword]").keydown(function () {
        if (event.keyCode == "13") {
            getKeyword();
        }
    });
    $(document).on('click', '#ul_provinceid li', changeProvince);
    $(document).on('click', '#goodsProvince li', changeProvince);
    $(document).on('click', '.ul_cityid li', changecity);
    PageUtil.initialize();
});
function collection(mark, id) {
    checkLogin();
    var olike = $(mark).children('i');
    if (olike.hasClass('isLike')) {//已收藏
        $.ajax({
            url: "/i/collect/delByCollect",
            type: "post",
            data: {uid: window.lkuser.id, collectId: id, collectType: 2}
        });
        olike.html("&#xe634;");
        olike.removeClass('isLike');
        $(mark).children('em').html('收藏');
    } else {//未收藏
        $.ajax({
            url: "/i/collect/addCollectRdc",
            type: "post",
            data: {uid: window.lkuser.id, collectId: id, collectType: 2}
        });
        olike.html("&#xe637;");
        olike.addClass('isLike');
        $(mark).children('em').html('已收藏');
    }
}
