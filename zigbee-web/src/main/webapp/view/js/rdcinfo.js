/*生成二维码*/
var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 88,
    height : 88
});

function makeCode () {
    var elText = document.URL;
   var ret = 'http://m.liankur.com/view/rdcdetail.html?id='+elText.split("=")[1];
    if (!elText) {
        layer.alert("二维码生成失败……", {icon:5});
        return;
    }
    qrcode.makeCode(ret);
}
makeCode ();
/*生成二维码 end*/

/*功能组件*/
var rdcId;
var user=window.sessionStorage.lkuser;
localStorage.OURL=document.URL;
function getRdcInfo() {
    var smallImg=[];
    var bigImg=[];
    var baseInfo=[];
    var otherInfo=[];
    var manageType=[""];
    $.ajax({url:"/i/rdc/findAllManageType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            manageType.push(val.type);
        });}});
    var tempType=[""];
    $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            tempType.push(val.type);
        });
    }});
    var refreg=[""];
    $.ajax({url:"/i/rdc/findAllStorageRefreg",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            refreg.push(val.type);
        });
    }});
    var struct=[""];
    $.ajax({url:"/i/rdc/findAllStorageStructureType",type:"get",success:function (data) {
        supportForeach();
        data.forEach(function (val, index) {
            struct.push(val.type);
        });
    }});
    var saveType={};
    $.ajax({url:"/i/rdc/findAllStorageType",type:"get",success:function (data) {
        supportForeach();
        saveType[0]="";
        data.forEach(function (val, index) {
            saveType[val.id]=val.type;
        });
    }});
    var isHave=["","有","无"];
    $.ajax({url:"/i/rdc/findRDCDTOByRDCId",type:"get",data:{"rdcID":rdcId},success:function (data) {
        var rdc=data[0];
        var price=rdc.unitPrice?rdc.unitPrice+"元/㎡/天":"暂无";
        var rentSqm=rdc.rentSqm?rdc.rentSqm+"㎡":"暂无";
        var facility=rdc.facility=="undefined"?"":rdc.facility;
        var remark=rdc.remark=="undefined"?"":rdc.remark;
        if(rdc.storagePics&&rdc.storagePics.length>0){
            $.each(rdc.storagePics,function (index, item) {
                if(index==0){
                    smallImg.push('<li class="current"><a href="javascript:;"><img src="'+item.location+'"/><span class="border"></span><span class="mask"></span></a></li>');
                }else{
                    smallImg.push('<li><a href="javascript:;"><img src="'+item.location+'"/><span class="border"></span><span class="mask"></span></a></li>');
                }
                bigImg.push('<li><a href="javascript:;"><img src="'+item.location+'" alt="" width="700" height="320"/></a></li>');
            });
        }else{
            bigImg.push('<li><a href="javascript:;"><img src="http://139.196.189.93:8089/app/rdcHeader.jpg" alt="" width="700" height="320"/></a></li>');
            smallImg.push('<li class="current"><a href="javascript:;"><img src="http://139.196.189.93:8089/app/rdcHeader.jpg"/><span class="border"></span><span class="mask"></span></a></li>');
        }
        baseInfo.push('<h2><b class="blue">'+rdc.name+'</b>');
        var auditButton='<a class="blue" style="margin-left: 20px" href="approve.html?id='+rdc.rdcId+'">认证该冷库</a>';
        /*if(window.lkuser && window.lkuser.vipType>0&&window.lkuser&&window.lkuser.id!=rdc.userid){
            auditButton='<a class="blue" style="margin-left: 20px" href="approve.html?id='+rdc.rdcId+'">认证该冷库</a>';
        }*/
        if(rdc.audit==2){baseInfo.push('<b class="approve"><i class="iconfont">&#xe6ac;</i>已认证</b>')}else{baseInfo.push('<b class="reachStand"><i class="iconfont">&#xe63b;</i>未认证</b>')};
        if(rdc.istemperaturestandard==1){baseInfo.push('&nbsp;<b class="reachStand"><i class="iconfont">&#xe6e9;</i>冷链委温度达标库</b>');}
        var address=["["];
        $.ajax({url:"/i/city/findProvinceById",type:"get",data:{provinceId:rdc.provinceId},async:false,success:function (data) {
            address.push(data.provinceName);
        }});
        $.ajax({url:"/i/city/findCityById",type:"get",data:{CityID:rdc.cityId},async:false,success:function (data) {
            if(data&&data.cityName){
                address.push("-"+data.cityName);
            }
        }});
        address.push(']');
        if(!window.lkuser){//没有登录
            baseInfo.push('</h2><table><tr><td>信息完整度</td><td>'+rdc.infoIntegrity+'%</td></tr>' +
                '<tr><td>地址</td><td>'+address.join('')+rdc.address+'</td> </tr>' +
                '<tr><td>仓储信息</td><td><a style="color:#2763cc;" href="../../login.html">登录</a>方可查看更多</tr></table>');
        }else if(window.lkuser.id==rdc.userid){//是自己的冷库
            if(rdc.audit==2){
                auditButton=''
            }
            baseInfo.push('</h2><table><tr><td>信息完整度</td><td>'+rdc.infoIntegrity+'%'+auditButton+'</td></tr>' +
                '<tr><td>地址</td><td>'+address.join('')+rdc.address+'</td> </tr> ' +
                '<tr> <td>价格</td> <td>'+price+'</td> </tr> ' +
                '<tr> <td>总面积/空置面积</td> <td>'+rdc.area+'㎡/'+rentSqm+'</td> </tr>' +
                '<tr> <td>冷库净高</td> <td>'+rdc.height+' m</td> </tr>' +
                ' <tr> <td>联系电话</td> <td class="orange"> <b>'+rdc.phoneNum+'</b></td> </tr>' +
                ' <tr> <td>实时温度</td> <td class="blue"><span style="cursor: pointer;" onclick="realTimeTem('+rdc.id+',\''+rdc.name+'\')">点击查看实时温度</span></td> </tr> </table>');
        }else{//不是自己的冷库
            if(rdc.openLIne&&rdc.openLIne==1){//公开温度曲线
                openLIne='<tr> <td>实时温度</td> <td class="blue"><span style="cursor: pointer;" onclick="realTimeTem('+rdc.id+',\''+rdc.name+'\')">点击查看实时温度</span></td> </tr>';
            }else{
                openLIne='<tr> <td>实时温度</td> <td>该冷库主尚未公开温度曲线</td> </tr>';
            }
            if(window.lkuser.vipType==0) {//没有实名认证
                baseInfo.push('</h2><table><tr><td>信息完整度</td><td>'+rdc.infoIntegrity+'%</td></tr>' +
                    '<tr><td>地址</td><td>'+address.join('')+rdc.address+'</td> </tr><tr><td>仓库信息</td><td><a href="../html/authentication.html" style="color:#2763cc;">实名认证</a><b>后可方可查看</b></td> </tr></table>');
            }else if(window.lkuser.vipType>0){//实名认证
                baseInfo.push('</h2><table><tr><td>信息完整度</td><td>'+rdc.infoIntegrity+'%'+auditButton+'</td></tr>' +
                    '<tr><td>地址</td><td>'+address.join('')+rdc.address+'</td> </tr> ' +
                    '<tr> <td>价格</td> <td>'+price+'</td> </tr> ' +
                    '<tr> <td>总面积/空置面积</td> <td>'+rdc.area+'㎡/'+rentSqm+'</td> </tr>' +
                    '<tr> <td>冷库净高</td> <td>'+rdc.height+' m</td> </tr>' +
                    ' <tr> <td>联系电话</td> <td class="orange"> <b>'+rdc.phoneNum+'</b></td> </tr>' +openLIne+'</table>');
            }
        }

        if(window.lkuser && window.lkuser.vipType>0||window.lkuser&&window.lkuser.id==rdc.userid){
           // var structure=null, platform=null, lihuoRoom=null, lihuoArea=null, lihuoTemperCtr=null, storageRefreg=null, temperRecord=null,facility=null,remark=null;
            rdc.structure==0?structure='':structure='<td> <span>建筑结构：</span>'+struct[rdc.structure]+' </td>';
            rdc.platform==0?platform='':platform='<td> <span>是否有封闭月台：</span>'+isHave[rdc.platform]+' </td>';
            rdc.lihuoRoom==0?lihuoRoom='':lihuoRoom='<td> <span>是否有理货区：</span>'+isHave[rdc.lihuoRoom]+'</td>';
            rdc.lihuoArea==0?lihuoArea='':lihuoArea='<td> <span>理货区面积：</span>'+rdc.lihuoArea+'㎡ </td>';
            rdc.lihuoTemperCtr==0?lihuoTemperCtr='':lihuoTemperCtr=' <td> <span>理货区有无温控：</span>'+isHave[rdc.lihuoTemperCtr]+' </td>';
            rdc.storageRefreg==0?storageRefreg='':storageRefreg='<td> <span>制冷剂类型：</span>'+refreg[rdc.storageRefreg]+' </td>';
            rdc.temperRecord==0?temperRecord='':temperRecord='<td> <span>有无温度记录：</span>'+isHave[rdc.temperRecord]+' </td>';
            rdc.temperRecord==0?temperRecord='':temperRecord='<td> <span>有无温度记录：</span>'+isHave[rdc.temperRecord]+' </td>';
            rdc.facility==""||rdc.facility=="undefined"?facility='':facility='<td colspan="2"> <span>周边设施：</span>'+rdc.facility+' </td>';
            rdc.remark==""||rdc.remark=="undefined"?remark='':remark='<td colspan="2"> <span>备注：</span>'+rdc.remark+' </td>';
            rdc.coldTruck1==0?coldTruck1='':coldTruck1='<p> <span>小于1.8T：</span>'+rdc.coldTruck1+' 辆</p>';
            rdc.height1*rdc.capacity1==0?capacity1='':capacity1='<p> <span>8 ~ 25℃：</span> '+(rdc.height1*rdc.capacity1).toFixed(2)+'m³</p> ';
            rdc.coldTruck2==0?coldTruck2='':coldTruck2='<p> <span>1.8 ～ 6T：</span>'+rdc.coldTruck2+' 辆</p>';
            rdc.height2*rdc.capacity2==0?capacity2='':capacity2='<p> <span>2 ~ 8℃：</span> '+(rdc.height2*rdc.capacity2).toFixed(2)+'m³</p> ';
            rdc.coldTruck3==0?coldTruck3='':coldTruck3='<p> <span>6 ～ 14T：</span>'+rdc.coldTruck3+' 辆</p>';
            rdc.height3*rdc.capacity3==0?capacity3='':capacity3='<p> <span>-2 ~ -18℃：</span> '+(rdc.height3*rdc.capacity3).toFixed(2)+'m³</p> ';
            rdc.coldTruck4==0?coldTruck4='':coldTruck4='<p> <span>大于14T：</span>'+rdc.coldTruck4+' 辆</p>';
            rdc.height4*rdc.capacity4==0?capacity4='':capacity4='<p> <span>-18 ~ -30℃：</span> '+(rdc.height4*rdc.capacity4).toFixed(2)+'m³</p> ';
            rdc.height5*rdc.capacity5==0?capacity5='':capacity5='<p> <span>小于-50℃：</span> '+(rdc.height5*rdc.capacity5).toFixed(2)+'m³ </p>';
            coldTruck = coldTruck1+coldTruck2+coldTruck3+coldTruck4;
            capacity=capacity1+capacity2+capacity3+capacity4+capacity5;
            if(rdc.coldTruck1==0&&rdc.coldTruck2==0&&rdc.coldTruck3==0&&rdc.coldTruck4==0){
                carNum='<td> <span>冷藏车数量：</span>库主未填写</td>'
            }else{
                carNum='<td> <span>冷藏车数量：</span></td>'
            }
            if(capacity1==''&&capacity2==''&&capacity3==''&&capacity4==''&&capacity5==''){
                rdcCapacity='<td> <span>冷库容积：</span>库主未填写</td> '
            }else{
                rdcCapacity='<td> <span>冷库容积：</span> </td> '
            }
            otherInfo.push('<table><tbody><tr><td><span>冷库经营类型：</span>'+manageType[rdc.manageType]+' </td> ' +
                '<td> <span>冷库温度类型：</span>'+tempType[rdc.temperType]+' </td> </tr> ' +
                '<tr><td> <span>商品存放类型：</span>'+saveType[rdc.storageType]+'</td> '+structure+' </tr> ' +
                '<tr>'+platform + lihuoRoom +'</tr>'+
                '<tr>'+lihuoArea+lihuoTemperCtr +'</tr>'+
                '<tr>'+storageRefreg+temperRecord+'</tr>'+
                '<tr> '+carNum+rdcCapacity+'</tr> ' +
                '<tr> <td>'+coldTruck+'</td>' +
                '<td>'+capacity+'</td> </tr> ' +
                '<tr>'+remark+'</tr>' +'</tbody></table>');
        }else if(window.lkuser && window.lkuser.vipType==0&&window.lkuser&&window.lkuser.id!=rdc.userid){
            otherInfo.push('');
        }else{
            otherInfo.push('<a style="color:#2763cc;" href="../../login.html">登录</a>方可查看更多');
        }
        $("#baseInfo").empty().append(baseInfo.join(''));
        $("#divimginfog_imgPlayer").empty().append(bigImg.join(''));
        layer.photos({
            photos: '#divimginfog_imgPlayer'
            ,anim:5//0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });

        $("#divpageinfog_imgPlayer").empty().append(smallImg.join(''));
        $("#otherInfo").empty().append(otherInfo.join(''));
        /*缩略图轮播*/
        foucsbox(2500);
    }});
}
/*点击查看实时库温*/
function realTimeTem(rdcId,rdcName) {
    layer.open({
        type: 1 //Page层类型
        ,area: ['500px', '300px']
        ,title: rdcName+'实时库温'
        ,shade: 0.6 //遮罩透明度
        ,shadeClose: true
        ,maxmin: true //允许全屏最小化
        ,anim: 2 //0-6的动画形式，-1不开启
        ,content: '<div style="padding:50px;">该功能尚未开放，请耐心等待~</div>'
    });
}
/*关联库发布列表*/
var pageCount=-1, oldPageCount=-1,pageNum=1;
function getList(typeCode,datatype,index) {
    var oTabBox = $('#matchList').children('div').eq(index),ourl='',npoint=null;
    if(index>0){
        oTabBox.empty();
        if(index==4){ourl='/i/comment/findCommentsByRDCId',npoint=200;}else{ourl='/i/ShareRdcController/newGetSERDCList'};
        $.get(ourl,{pageNum:pageNum,pageSize:10,rdcID:rdcId,dataType:datatype,typeCode:typeCode,npoint:npoint},function (data) {
            var list=null;
            pageCount= data.totalPages;
            if (pageCount == -1 || oldPageCount != pageCount) {
                flushPage(index);
            }
            index==4?list=data:list = data.data;
            var pStr=str='',ounit=['吨','Kg','吨'];
            $.each(list,function (i,val) {
                if(datatype==3){//出租
                    if(!val.unit1){val.unit1='天'};
                    if(!val.unit2){val.unit2='㎡'};
                    str='<p class="txtList omg"><a href="rdcmatchinfo.html?id='+val.id+'"><span>'+(i+1)+'</span>' +
                        '['+val.title+']--共'+val.sqm+'㎡'+val.codeLave2+'，单价：'+val.unitPrice+'元/'+val.unit1+'/'+val.unit2+'</a></p>';
                }else if(datatype==1){//出售求购
                    str='<p class="txtList omg"><a href="rdcmatchinfo.html?id='+val.id+'"><span>'+(i+1)+'</span>' +
                        '['+val.detlAddress+']' +val.title+'--共'+val.sqm+ounit[val.publishunit]+'，单价：'+val.unitPrice+val.unit+'</a></p>';
                }else{//评论
                    var img=grade=imglist='';
                    for(var j=0,imgLen=val.reviewPics.length;j<imgLen;j++){
                        img='<li><img src="'+val.reviewPics[j].location+'"></li>';
                        imglist=imglist+img;
                    }
                    if(val.grade==1){grade='<i class="iconfont filled">&#xe60c;</i><i class="iconfont">&#xe60c;</i><i class="iconfont">&#xe60c;</i><i class="iconfont">&#xe60c;</i><i class="iconfont">&#xe60c;</i>';
                    }else if(val.grade==2){grade='<i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont">&#xe60c;</i><i class="iconfont">&#xe60c;</i><i class="iconfont">&#xe60c;</i>';
                    }else if(val.grade==3){grade='<i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont">&#xe60c;</i><i class="iconfont">&#xe60c;</i>';
                    }else if(val.grade==4){grade='<i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont">&#xe60c;</i>';
                    }else{grade='<i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i><i class="iconfont filled">&#xe60c;</i>';}
                    str='<div class="clearfix commentlist"><div class="imgleft">'+
                        '<img src="'+val.avatar+'"><p>'+val.commerName+'</p><p>'+val.addTime+'</p><p>'+grade+'</p></div>'+
                        '<div class="imgright"><p>'+val.content+'</p>'+
                        '<ul class="commentImg" id="commentImg'+i+'">'+imglist+'</ul></div></div>'
                };
                pStr=pStr+str;
            });
            if(!pStr){
                index==4?pStr='暂无评论信息~':pStr="该冷库尚无发布信息~"
            }
            oTabBox.append(pStr);
            $.each(list,function (i,val) {
                layer.photos({
                    photos: '#commentImg'+i
                    ,anim:5
                });
            });
        });
    }
}
/*刷新分页*/
function flushPage(index) {
    if(index>0&&index<4){
        ui_laypage = layui.use(['laypage', 'layer'], function () {
            laypage = layui.laypage;
            laypage({
                cont: 'demo2'
                , pages: pageCount
                , skin: '#1E9FFF'
                , curr: pageNum,
                jump: function (obj, first) {
                    pageNum = obj.curr;
                    oldPageCount = pageCount;
                    if (first != true) {
                        if(index==1){
                            getList(1,3,1)
                        }else if(index==2){
                            getList(1,1,2)
                        }else if(index==3){
                            getList(2,1,3)
                        }
                    }
                }
            });
        });
    }
}
/*发布评论*/
function goComment() {
    window.location.href='rdccomment.html?id='+rdcId;
}
$("#aboutRdcRelease ul li").click(function () {
    var index=$(this).index();
    pageNum=1;
    if(index==1){
        getList(1,3,1)
    }else if(index==2){
        getList(1,1,2)
    }else if(index==3){
        getList(2,1,3)
    }else if(index==4){
        getList(null,null,4)
    }else{
        getRdcInfo();
    }
});
$(function () {
    rdcId = getUrlParam("rdcId");
    getRdcInfo();
});
