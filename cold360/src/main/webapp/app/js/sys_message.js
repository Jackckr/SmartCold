checkLogin();
var ischeck = flag = true;
var isLoadRB = false;
var rdcId = storages = null;
var rdcName = $("#rdcName").html();
var searchContent = $("#searchDara_div>input").val();
var modestate = ['待处理', '已处理'];
    modestate[-1]="已拒绝";
var txt = "全部";
var params = {
    userId: user.id,utype: user.type,rdcId: rdcId,
    type: null,stype: null,isRead: null,status: null,
    page: 1,rows: 10,total: 1,totalPages: 1,keyword:null
};
$(function () {
    if(user.roleid==2||user.roleid==3) {
        $(".searchZoom").show();
    }
    $(".prevpage").show();
    $(".nextpage").hide();
    /*rdc下拉列表*/
    $(".transion").click(function () {
        $(".one").hide();
        $(".two").show();
        $('.search input').focus()
    });
    $(".cancel").click(function () {
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    });
    $("#searchDara_div input").keyup(function () {
        $('.searchTop').show()
    })
    $(".rdcList li").click(function () {
        $('.searchTop').hide();
        $(".one").children('.txt').text($(this).children('span').html())
        $(".one").show();
        $(".two").hide();
    });

})
function togglepage(flag) {
    if(flag){
        $(".nextpage").show();
        $(".prevpage").hide();
    }else{
        $(".nextpage").hide();
        $(".prevpage").show();
    }

}
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var rootRdcId = $.getUrlParam('storageID');
$.get(ER.coldroot + '/i/rdc/findRDCsByUserid', {userid: user.id}
    ,function (data) {
        if (data && data.length > 0) {
            storages = data;
            if (!rootRdcId) {
                if (localStorage.rdcId) {
                    rdcId = localStorage.rdcId;
                    findByRdcId(localStorage.rdcId);
                } else {
                    currentRdc = storages[0];
                    rdcId = storages[0].id;
                    $("#rdcName").html(storages[0].name);
                    viewStorage(storages[0].id);
                }
            } else {
                findByRdcId(rootRdcId);
                rdcId = rootRdcId;
            }
            params.rdcId = rdcId;
        }
        initAjax();

    }
);
function infoTxt(ops) {
    txt = $(ops).children('p').html();
    return txt;
}
function searchSys() {
    params.page = 1;
    params.keyword = $(".searchInput").val();
    $("#allList").empty();
    allMsgAjax();
}
function initAjax(){//初始化加载最新2条数据
    $.ajax({
        type: 'POST',
        url: ER.coldroot +'/i/messageRecord/getTallMsgByRdcId   ',
        data: {
            userId:user.id,
            type:user.type,
            rdcId:rdcId
        },
        success: function (data) {
            var news=[];
            var datalist = data;
            $("#twoList").empty();
            if(data.length){
                $('.sysNo').hide();
                $("#noread").show();
                $("#noread").html(data.length);
                if(data.length>2){
                    data=data.splice(2)
                }
            }else {
                $("#noread").hide();
                $('.sysNo').show();
            }
            $.each(datalist,function (i,value) {
                var oState = value.state==0?'<span class="fr redState">'+modestate[value.state]+'</span>':'<span class="fr">'+modestate[value.state]+'</span>';
                news.push('<li class="sysInfo">'+
                    '<a onclick="sysModal(\''+value.title+'\',\''+value.message+'\','+rdcId+','+value.sType+','+value.uid+','+value.id+','+value.state+',1,'+value.type+')"><p class="clearfix"><label class="check_icon on fl editSys black" >'+
                    '<input type="checkbox"><i class="iconfont"></i></label>'+
                    '<b class="fl">'+value.title+'</b>'+oState+
                    '<p>'+value.message+'</p>'+
                    '<p class="msgTime">'+value.addTime+'</p></a></li>')
            });
            $("#twoList").append(news.join(""));
        }
    });
};
function changstatus(status,ops) {//已处理未处理
    infoTxt(ops);
    params.type = null,
    params.stype = null,
    params.isRead = null,
    params.status = status;
    params.page = 1;
    $("#allList").empty();
    allMsgAjax();
    if(params.status==1){
        params.status = -1;
        allMsgAjax();
    }
};
function isRead(isread,ops) {//已读未读
    infoTxt(ops);
    params.type = null,
    params.stype = null,
    params.status = null;
    params.isRead = isread;
    params.page = 1;
    $("#allList").empty();
    allMsgAjax();
}
function allmsg(ops) {
    params.type = null,
    params.stype = null,
    params.isRead = null,
    params.status = null,
    params.page = 1,
    params.rows = 10;
    infoTxt(ops);
    $("#allList").empty();
    allMsgAjax();
};
function allMsgAjax() {//全部消息
    $("#infoTxt").html(txt);
    togglepage(true);
    isLoadRB=true;
    $.ajax({
        type: 'POST',
        url: ER.coldroot +'/i/messageRecord/getMessageList',
        data: params,
        success: function (data) {
            var news=[];
            var datalist = data.data;
            if(datalist.length){
                $('.sysNo').hide();
            }else {
                $('.sysNo').show();
            }
            params.totalPages = data.totalPages;
            $.each(datalist,function (i,value) {
                if(value.state==0){
                    $('.redState').css('color','red');
                }else{
                    $('.redState').css('color','#898989');
                }
                var oState = value.state==0?'<span class="fr redState">'+modestate[value.state]+'</span>':'<span class="fr">'+modestate[value.state]+'</span>';
                news.push('<li class="sysInfo">'+
                    '<a onclick="sysModal(\''+value.title+'\',\''+value.message+'\','+rdcId+','+value.sType+','+value.uid+','+value.id+','+value.state+',-1,'+value.type+',1)">'+
                    '<p class="clearfix"><label class="check_icon on fl editSys black" >'+
                    '<input type="checkbox"><i class="iconfont"></i></label>'+
                    '<b class="fl">'+value.title+'</b>'+oState+
                    '<p>'+value.message+'</p>'+
                    '<p class="msgTime">'+value.addTime+'</p></a></li>');
            });
            $("#allList").append(news.join(""));
            params.page++;
            isLoadRB=false;
        }
    });
}
/*无限加载*/
$(window).scroll(function(){
    if(params.page==1){return}
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if(scrollTop + windowHeight > scrollHeight-100){
        if(isLoadRB==false&&params.page<=params.totalPages){
            allMsgAjax();
        }
    };
});
function sysModal(title,message,id,sType,uid,valId,status,step,uType) {
    if (status == 1 || status == -1) {
        alert("该条内容已处理完毕~")
        return
    }
    var oLi='';
    params.isRead = 1;
    if(sType==1&&uType==1){
        $.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId', {rdcID: id},
            function (data) {
                if (data && data.length > 0) {
                    mystorages = data;
                }
            }
        );
        $.each(mystorages,function (i,items) {
            oLi = oLi.concat('<li class="fl"><label><input type="checkbox" value="'+items.id+'">'+items.name+'</label></li>');
            return oLi;
        });
    }
    var modalObj = '<div class="sysModal"><div class="sysModalMain"><div class="sysModalHeader"><img src="../com/img/modalBg.png" style="width: 11rem;height: 5.12rem;" alt="">'+
            '<h4>'+title+'</h4><p>'+message+'</p></div>'+
            '<div class="sysModalBody"><div ng-if="currmsg.type==1&&currmsg.sType==1" >'+
            '<ul id="ul_storage" class="clearfix">'+oLi+'</ul></div></div><div class="sysModalFooter clearfix">'+
            '<div class="fl" onclick="off()">关闭</div>'+
            '<div class="fl"  onclick="agree('+sType+','+uid+','+valId+','+step+')">同意</div>'+
            '<div class="fl" onclick="refuse('+sType+','+uid+','+valId+','+step+')">拒绝</div></div>'+
            '<div class="sysClose" onclick="off()">&times;</div></div></div>';
    $("body").append(modalObj);
}
//同意
function agree(sType,uid,valId,step,isread) {
    var str = [], oid = "";
    if (sType == 1) {
        $("#ul_storage input[type='checkbox']:checked").each(function () {
            str.push($(this).val());
        });
        if (str.length == 0) {
            alert("请选择授权的冷库！");
            return
        } else {
            oid = str.toString();
        }
    }
    $.ajax({
        type: 'POST',
        url: ER.coldroot + '/i/authenUser/authorUserByRdcId',
        data: {
            id: valId,
            userId: uid,
            stype: sType,
            rdcId: rdcId,
            status: 1,
            oids: oid
        },
        success:function (data) {
            if(step==1){
                initAjax();
            }else if(step==-1){
                params.page = 1;
                params.isRead = isread;
                $("#allList").empty();
                allMsgAjax();
            };
            $(".sysModal").hide();
        }
    });
};
//拒绝
function refuse(sType,uid,valId,step) {
    $.ajax({
        type: 'POST',
        url: ER.coldroot + '/i/authenUser/authorUserByRdcId',
        data: {
            id: valId,
            userId: uid,
            stype: sType,
            rdcId: rdcId,
            status: -1,
            oids: ""
        },
        success:function (data) {
            if(step==1){
                initAjax();
            }else if(step==-1){
                params.page = 1;
                $("#allList").empty();
                allMsgAjax();
            };
            $(".sysModal").hide();
        }
    });
};
function off() {
    $(".sysModal").fadeOut();
};
function findByRdcId(rdcId) {
    $.get(ER.coldroot + '/i/rdc/findRDCByRDCId', {rdcID: rdcId},
        function (data) {
            currentRdc = data[0];
            $("#rdcName").html(data[0].name);
            rootRdcId = data[0].id;
            viewStorage(rootRdcId);
        }
    )
}
function viewStorage(rdcId) {
    localStorage.rdcId = rdcId;
    rdcId = rdcId;
    $.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId', {rdcID: rdcId},
        function (data) {
            if (data && data.length > 0) {
                mystorages = data;
            }
        }
    )
    $(".one").show();
    $(".two").hide();
    $('.searchTop').hide();
};
function searchRdcs() {
    // 超管特殊处理
    if (user.roleid == 3) {
        var rdclists=[];
        $.get(ER.coldroot + '/i/rdc/searchRdc', {type: 1, filter: $("#searchDara_div>input").val()},
            function (data) {
                if (data && data.length > 0) {
                    storages = data;
                    $(".rdcList").empty();
                    $.each(storages,function (i,val) {
                        rdclists.push('<li class="omg" onclick="changeRdc('+val.id+',\''+val.name+'\')"><i class="iconfont">&#xe62f;</i><span>'+val.name+'</span></li>')
                    })

                    $(".rdcList").append(rdclists.join(""));
                    $('.searchTop').show();
                }
            }
        );
    }
};
function changeRdc(id,rdc) {
    rdcId = id;
    $("#rdcName").html(rdc);
    searchContent = "";
    viewStorage(id);
    window.location.reload()
};
function goprev() {
    initAjax();
    params.page=1;
    togglepage(false);
    $('.myedit').html("编辑");
    $(".editSys,.checkAll").hide();
}
function edit() {
    if (flag) {
        $(this).html("完成");
        $(".editSys,.checkAll").show();
        flag = false;
    } else {
        $(this).html("编辑");
        $(".editSys,.checkAll").hide();
        flag = true;
    }

}

