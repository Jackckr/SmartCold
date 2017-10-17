/**
 * 冷库列表
 */
$().ready(function () {
    var maxSize = 10;
    localStorage.isStand = $("#isstand").val();
    var totalPages = currentPage = 1;  // 当前页
    var isLoadRB = false;
    var ul_select = $("#ul_rdcsL_list");
    var match={area:'',mantype:'',temtype:'',sqm:'',goodtype:'',audit:''};
    var myFilter=null;
    if (getUrlParam("key")) {
        $("#searchDara_div input").val(window.localStorage.getItem("shdatakey"));
        window.localStorage.removeItem("shdatakey");
    }
    if(localStorage.RDC) {
        myFilter = JSON.parse(localStorage.RDC);
        myFilter.pageNum=1;
    }
    gosharedile = function (sharid) {
        window.location.href = "colddetail.html?id=" + sharid;
    };


    initevg = function () {
        $(".transion").click(function () {
            $(".one").hide();
            $(".two").show();
        });
        $(".cancel").click(function () {
            $(".one").show();
            $(".two").hide();
            localStorage.removeItem('RDC');
            localStorage.removeItem('cityShow');
            window.location.reload();
        });
        $(".droplist a").click(function (e) {//条件过滤
            $(this).children('i').addClass('current').html('&#xe62e;');
            $(this).addClass('current').next('.listcontain').slideDown().parent().siblings().children('a').removeClass('current').children('i').removeClass('current').html('&#xe62d;').parent().siblings('.listcontain').hide();
            $(".backDrop").show();
        });
        $(".backDrop").click(function () {
            $(".droplist a").removeClass('current').children('i').removeClass('current').html('&#xe62d;');
            $('.listcontain').hide();
            $(this).hide();
        });
        /* $("#searchDara_div i").click();*/
        $("#searchDara_div>input").keypress(function (e) {
            var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
            if (eCode == 13) {
                searchFilters();
            }
        });
        searchFilter = function (e) {//搜索
            if ($("#searchDara_div input").val().trim() != "") {
                currentPage = 1;
                ul_select.empty();
                getPageData();
            }
        };
        searchFilters = function (e) {//搜索
            if ($("#searchDara_div input").val().trim() == "") {
                alert("请输入你要搜索的内容~")
            } else {
                currentPage = 1;
                ul_select.empty();
                getPageData();
            }
        };
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight > scrollHeight - 100) {
                if (isLoadRB == false && currentPage <= totalPages) {
                    getPageData();
                }
            }
            ;
        });
    };

    backfilter=function () {
        $("#ul_city_list").hide().prev('ul').show();
        $("#ul_city_list li.active").attr("value",'');
    };
    addfilter = function (em,city) {
        var $this = $(em).html();
        if(city){
            localStorage.cityShow=$this;
        }else if($this=='全部'){
            $(em).attr('data-val',2);
            localStorage.cityShow=$("#ul_address_list li.active").html();
        }else if($this=='不限'){
            $(em).attr('data-val',2)
        }
        $(em).addClass('active').siblings().removeClass('active').parent().parent().hide();
        $(em).parent().parent().siblings('a').children('span').html($this);
        $(".backDrop").hide();
        $(em).parent().parent().siblings().removeClass('current').children('i').removeClass('current').html('&#xe62d;');
        currentPage = 1;
        ul_select.empty();
        if($(em).attr('data-city')){
            myFilter.provinceid=myFilter.cityid='';
            localStorage.RDC=JSON.stringify(myFilter);
            localStorage.removeItem('cityShow');
        }
        getPageData();
    };
    initFilter = function () {
        var mtlist = [], stlist = [], prove = [];
        $.get(ER.root + '/i/city/findProvinceList', function (data) {
            $.each(data, function (i, vo) {
                prove.push("<li value='" + vo.provinceId + "' >" + vo.provinceName + "</li>");
            });
            $("#ul_address_list").append(prove.join(""));
            $("#ul_address_list li").click(function () {
                var provinceid=$(this).attr("value");
                if(provinceid){
                    $(this).addClass('active').siblings().removeClass('active');
                    $("#ul_city_list").show().prev('ul').hide();
                    $.ajax({
                        url: ER.root + "/i/city/findCitysByProvinceId",data:{provinceID:provinceid},type: "get", success: function (data) {
                            var cityArr = ['<li class="fl backLi" value="" onclick="backfilter()">返回</li><li class="fl active" value="" onclick="addfilter(this)">全部</li>'];
                            data.forEach(function (val, index) {
                                cityArr.push('<li  onclick="addfilter(this,1)" class="fl omg" value="' + val.cityID + '">' + val.cityName + '</li>');
                            });
                            window.localStorage.match_list_city = cityArr.join('');
                            $("#ul_city_list").empty().show().append(window.localStorage.match_list_city);
                            if(myFilter&&myFilter.cityid){
                                for(var i=0,len=$("#ul_city_list li").length;i<len;i++){
                                    if($("#ul_city_list li").eq(i).attr('value')==myFilter.cityid){
                                        $("#ul_city_list li").eq(i).addClass('active').siblings().removeClass('active');
                                        return
                                    }
                                }
                            }
                        }
                    });
                }else{
                    addfilter(this);
                }
            });

            if(myFilter&&myFilter.provinceid) {
                if(myFilter.cityid==undefined){localStorage.cityShow=data[myFilter.provinceid-1].provinceName}
                $("#filter_section").children('.droplist').eq(0).find('span').html(localStorage.cityShow);
                $("#ul_address_list li").eq(myFilter.provinceid).addClass('active').siblings().removeClass('active');
            }
        });
        $.post(ER.root + "/i/rdc/getRDCFilterData", function (data) {
            if (data.success) {
                var _mtty = data.entity.mt,
                    _stty = data.entity.te;//经营类型,温度类型
                $.each(_mtty, function (i, vo) {
                    mtlist.push("<li value='" + vo.id + "' >" + vo.type + "</li>");
                });
                $.each(_stty, function (i, vo) {
                    stlist.push("<li value='" + vo.id + "' >" + vo.type + "</li>");
                });
                $("#ul_mtty_list").append(mtlist.join(""));
                $("#ul_stty_list").append(stlist.join(""));
//  					 $("#filter_section li").click(function(event) {addfilter(this);});
                $("#ul_mtty_list li,#ul_stty_list li,#ul_sqm_list li,#ulApprove li").click(function (event) {
                    addfilter(this);
                });
                if(myFilter&&myFilter.managetype) {
                    match.mantype=data.entity.mt[myFilter.managetype-1].type;
                    $("#filter_section").children('.droplist').eq(1).find('span').html(match.mantype);
                    $("#ul_mtty_list li").eq(myFilter.managetype).addClass('active').siblings().removeClass('active');
                }
                if(myFilter&&myFilter.storagetempertype) {
                    match.temtype=data.entity.te[myFilter.storagetempertype-1].type;
                    $("#filter_section").children('.droplist').eq(2).find('span').html(match.temtype);
                    $("#ul_stty_list li").eq(myFilter.storagetempertype).addClass('active').siblings().removeClass('active');
                }
                if(myFilter&&myFilter.sqm) {
                    var x=null;
                    $("#filter_section").children('.droplist').eq(3).find('span').html(myFilter.sqm);
                    if(myFilter.sqm=='<1000'){x=1}
                    else if(myFilter.sqm=='1000~3000'){x=2}
                    else if(myFilter.sqm=='3000~6000'){x=3}
                    else if(myFilter.sqm=='6000~12000'){x=4}
                    else if(myFilter.sqm=='12000~20000'){x=5}
                    else if(myFilter.sqm=='>20000'){x=6}
                    else{x=null}
                    $("#ul_sqm_list li").eq(x).addClass('active').siblings().removeClass('active');
                }
                if(myFilter&&myFilter.audit) {
                    var x=null;
                    if(myFilter.audit==2){x=1;$("#filter_section").children('.droplist').eq(4).find('span').html('已认证');}
                    else if(myFilter.audit=='-2,-1,0,1'){x=2; $("#filter_section").children('.droplist').eq(4).find('span').html('未认证');}
                    else{x=0; myFilter.audit=''}

                    $("#ulApprove li").eq(x).addClass('active').siblings().removeClass('active');
                }
            }
        });
    };
    getFilter = function (pageNum, pageSize) {
        var sqm = $("#ul_sqm_list li.active").attr("value");//面积
        var audit = $("#ulApprove li.active").attr("value");//认证
        audit==-2?audit='-2,-1,0,1':audit;
        var smty = $("#ul_stty_list li.active").attr("value");//温度
        var sety = $("#ul_mtty_list li.active").attr("value");//经营类型
        var adds = $("#ul_address_list li.active").attr("value");////地区
        var citys = $("#ul_city_list li.active").attr("value");////地区
        var keyword = $("#searchDara_div input").val().trim();////关键字搜索
        var uid=null;
        if(window.user){uid=window.user.id;}
        var _options = {uid:uid,sqm: sqm, storagetempertype: smty, managetype: sety,audit:audit, provinceid: adds,cityid:citys, keyword: keyword,istemperaturestandard:localStorage.isStand};
        var _filter = {pageNum: pageNum, pageSize: pageSize};
        jQuery.extend(_filter, _options);
        if(sqm||audit||smty||sety||adds||keyword||!(sqm&&audit&&smty&&sety&&adds)){
            if(myFilter){//有缓存条件
                if (sqm) {
                } else {
                    if ($("#ul_sqm_list li.active").attr("data-val")) {
                    } else {
                        if (myFilter.sqm && sqm == undefined||sqm=='') {
                            _filter.sqm = myFilter.sqm;
                        }
                    }
                }
                if (smty) {
                } else {
                    if ($("#ul_stty_list li.active").attr("data-val")) {
                    } else {
                        if (myFilter.storagetempertype && smty == undefined||smty=='') {
                            _filter.storagetempertype = myFilter.storagetempertype
                        }
                    }
                }
                if (sety) {
                } else {
                    if ($("#ul_mtty_list li.active").attr("data-val")) {
                    } else {
                        if (myFilter.managetype && sety == undefined||sety=='') {
                            _filter.managetype = myFilter.managetype;
                        }
                    }
                }
                if (adds) {
                } else {
                    if ($("#ul_address_list li.active").attr("data-val")) {
                    } else {
                        if (myFilter.provinceid && adds == undefined||adds=='') {
                            _filter.provinceid = myFilter.provinceid;
                        }
                    }
                }
                if (citys) {
                } else {
                    if ($("#ul_city_list li.active").attr("data-val")) {
                    } else {
                        if (myFilter.cityid && citys == undefined||citys=='') {
                            _filter.cityid = myFilter.cityid;
                        }
                    }
                }
                if (keyword) {
                } else {
                    if (myFilter.keyword) {
                        _filter=myFilter;
                        $(".one").hide();
                        $(".two").show();
                        $("#searchDara_div input").val(myFilter.keyword);
                    } else {
                        if (myFilter.keyword && keyword == undefined) {
                            _filter.keyword = myFilter.keyword
                        }
                    }
                }
            }
            localStorage.RDC=JSON.stringify(_filter);
            myFilter=_filter;
        }
        return _filter;
    };
    getSoll = function () {
        var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;//隐藏的高度
        localStorage.list_cache_coldlist = JSON.stringify({
            totalPages: totalPages,
            currentPage: currentPage,
            html: $("#ul_rdcsL_list").html(),
            scrollHeight: scrollHeight
        });
    };
    collect = function (ops, id) {
        if (!(window.user && window.user.id != 0)) {
            checkLogin();
            return;
        }
        var em = $(ops);
        if (em.hasClass('noCollect')) {
            $.post(ER.root + "/i/collect/addCollectRdc", {
                uid: window.user.id,
                collectId: id,
                collectType: 1
            }, function (data) {

            });
            em.removeClass('noCollect').addClass('hasCollect');
            em.children('i').html('&#xe60c;');
            em.children('em').html('已收藏');
        } else {
            $.post(ER.root + "/i/collect/delByCollect", {
                uid: window.user.id,
                collectId: id,
                collectType: 1
            }, function (data) {

            });
            em.addClass('noCollect').removeClass('hasCollect');
            em.children('i').html('&#xe605;');
            em.children('em').html('收藏');
        }
    };

    function gethtml(rdc) {
        var rdcAddress='';
        rdc.cityname==0||rdc.cityname==undefined?rdcAddress=rdc.provincename:rdcAddress=rdc.provincename+'-'+rdc.cityname;
        rdcAddress==undefined?rdcAddress=rdc.address:rdcAddress=rdcAddress;
        if(localStorage.isStand!=1){
            if (rdc.audit == -1) {
                return false
            }
            var approve = '';
            if (rdc.audit == 2) {
                if(rdc.id==1878){
                    approve = '<i class="iconfont green">&#xe61f;</i><i class="green">已通过</i>'
                }else{
                    if (rdc.istemperaturestandard == 1) {
                        approve = '<i class="iconfont green">&#xe6ac;</i><i class="green">已认证</i><i class="iconfont orange">&#xe6e9;</i><i class="orange">冷链委温度达标库</i>'
                    } else {
                        approve = '<i class="iconfont green">&#xe6ac;</i><i class="green">已认证</i>'
                    }
                }

            } else if (rdc.audit != 2) {
                if (rdc.istemperaturestandard == 1) {
                    approve = '<i class="iconfont orange">&#xe63b;</i><i class="orange">未认证</i><i class="iconfont orange">&#xe6e9;</i><i class="orange">冷链委温度达标库</i>'
                } else {
                    approve = '<i class="iconfont orange">&#xe63b;</i><i class="orange">未认证</i>'
                }
            }
            ;
            var collectWords = '<a class="fr noCollect" onclick="collect(this,' + rdc.id + ')"><i class="iconfont">&#xe605;</i><em>收藏</em></a>';
            if (rdc.collectType == 1) {
                collectWords = '<a class="fr hasCollect" onclick="collect(this,' + rdc.id + ')"><i class="iconfont">&#xe60c;</i><em>已收藏</em></a>';
            }
            var score = ['<li class="imgCell" ><a href="rdcdetail.html?id=' + rdc.id + '" onclick="getSoll()"><img class="fl" src="' + rdc.logo + '">' +
            '<div><p class="ellipsis">' + rdc.name + '</p><p class="position omg"><i class="iconfont">&#xe66e;</i>' + rdcAddress + '</p>' +
            '<div class="star">' + approve + '</div></div></a>' +
            '<div class="btnFn clearfix"><a href="rdcdetail.html?id=' + rdc.id + '" class="fl"><i class="iconfont">&#xe65b;</i>查看</a>' +
            collectWords + '<a class="fr"><i class="iconfont">&#xe66c;</i>咨询</a></div></li>'];
            return score.join("");
        }
        else{
            var collectWords='<a class="fr noCollect" onclick="collect(this,'+rdc.id+')"><i class="iconfont">&#xe605;</i><em>收藏</em></a>';
            if(rdc.collectType==1){
                collectWords='<a class="fr hasCollect" onclick="collect(this,'+rdc.id+')"><i class="iconfont">&#xe60c;</i><em>已收藏</em></a>';
            }
            var approve='<i class="iconfont orange">&#xe6e9;</i>冷链委温度达标库';
            var score=['<li class="imgCell" ><a href="rdcdetail.html?id='+rdc.id+'" onclick="getSoll()"><span>达标冷库</span>' +
            '<div style="padding-left: 2.5rem;"><p class="ellipsis">'+rdc.name+'</p><p class="position omg"><i class="iconfont">&#xe66e;</i>'+rdcAddress+'</p>' +
            '<div class="star orange">'+approve+'</div></div></a><i class="iconfont tj">&#xe686;</i>' +
            '<div class="btnFn clearfix"><a href="rdcdetail.html?id='+rdc.id+'" class="fl"><i class="iconfont">&#xe65b;</i>查看</a>'+
            collectWords+'<a class="fr"><i class="iconfont">&#xe66c;</i>咨询</a></div></li>'];
            return score.join("");
        }
    }

    function getPageData() {//启用无限加载
        isLoadRB = true;
        if($("#searchDara_div input").val().trim()){
            $(".one").hide();
            $(".two").show();
        }
        var _filter = getFilter(currentPage, maxSize);
        $.post(ER.root + "/i/rdc/newGetRdcList", _filter, function (data) {
            if (data.success && data.data.length > 0) {
                totalPages = data.totalPages;
                currentPage++;
                var html = [];
                var rdcsList = data.data;//
                $.each(rdcsList, function (index, item) {
                    html.push(gethtml(item));
                });
                ul_select.append(html.join(""));
                $(".nodata").hide();
            } else {
                $(".nodata").show();
            }
            isLoadRB = false;
        });
    };

    function initData() {//启用无限加载
        initFilter();
        initevg();
        if (localStorage.list_cache_coldlist) {
            var cachdata = JSON.parse(localStorage.list_cache_coldlist);
            totalPages = parseInt(cachdata.totalPages);
            currentPage = parseInt(cachdata.currentPage);
            $("#ul_rdcsL_list").html(cachdata.html);
            $(document).scrollTop(cachdata.scrollHeight);
        } else {
            getPageData();
        }

    };
    initData();
});	