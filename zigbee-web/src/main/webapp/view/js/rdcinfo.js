/*生成二维码*/
var qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 88,
    height : 88
});

function makeCode () {
    var elText = document.URL;
    if (!elText) {
        alert("二维码生成失败……");
        return;
    }
    qrcode.makeCode(elText);
}
makeCode ();
/*生成二维码 end*/

/*功能组件*/
var rdcId;
var user=window.sessionStorage.user;
function getRdcInfo() {
    var smallImg=[];
    var bigImg=[];
    var baseInfo=[];
    var otherInfo=[];
    var manageType=[""];
    $.ajax({url:"/i/rdc/findAllManageType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            manageType.push(val.type);
        });}});
    var tempType=[""];
    $.ajax({url:"/i/rdc/findAllTemperType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            tempType.push(val.type);
        });
    }});
    var refreg=[""];
    $.ajax({url:"/i/rdc/findAllStorageRefreg",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            refreg.push(val.type);
        });
    }});
    var struct=[""];
    $.ajax({url:"/i/rdc/findAllStorageStructureType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            struct.push(val.type);
        });
    }});
    var saveType=[""];
    $.ajax({url:"/i/rdc/findAllStorageType",type:"get",success:function (data) {
        data.forEach(function (val, index) {
            saveType.push(val.type);
        });
    }});
    var isHave=["","有","无"];
    $.ajax({url:"/i/rdc/findRDCDTOByRDCId",type:"get",data:{"rdcID":rdcId},success:function (data) {
        var rdc=data[0];
        var price=rdc.unitPrice?rdc.unitPrice+"元/㎡/天":"暂无";
        var rentSqm=rdc.rentSqm?rdc.rentSqm+"㎡":"暂无";
        $.each(rdc.storagePics,function (index, item) {
            bigImg.push('<li><a href="javascript:;" target="_blank"><img src="'+item.location+'" alt="" width="700" height="320"/></a></li>');
            smallImg.push('<li class="current"><a href="javascript:;" target="_blank"><img src="'+item.location+'"/><span class="border"></span><span class="mask"></span></a></li>');
        });
        baseInfo.push('<h2><b class="blue">'+rdc.name+'</b>');
        if(rdc.audit==2){baseInfo.push('<b class="approve"><i class="iconfont">&#xe6ac;</i>已认证</b>');}
        if(rdc.istemperaturestandard==1){baseInfo.push('&nbsp;<b class="reachStand"><i class="iconfont">&#xe6e9;</i>冷链委温度达标库</b>');}
        if(window.lkuser){
            baseInfo.push('</h2><table><tr><td>信息完整度</td><td>'+rdc.infoIntegrity+'%</td></tr><tr><td>地址</td><td>'+rdc.address+'</td> </tr> <tr> <td>价格</td> <td>'+price+'</td> </tr> <tr> <td>总面积/空置面积</td> <td>'+rdc.area+'㎡/'+rentSqm+'</td> </tr> <tr> <td>联系电话</td> <td class="orange"> <b>'+rdc.phoneNum+'</b> <i class="blue">企业</i> </td> </tr> <tr> <td>实时温度</td> <td class="blue">-16℃</td> </tr> <tr> <td colspan="2"> <button class="oBtn">预约订库</button> </td> </tr> </table>');
        }else {
            baseInfo.push('</h2><table><tr><td>信息完整度</td><td><a href="/view/html/login.html">登入后显示</a></td></tr><tr><td>地址</td><td>'+rdc.address+'</td> </tr> <tr> <td>价格</td> <td><a href="/view/html/login.html">登入后显示</a></td> </tr> <tr> <td>总面积/空置面积</td> <td><a href="/view/html/login.html">登入后显示</a></td> </tr> <tr> <td>联系电话</td> <td class="orange"> <a href="/view/html/login.html">登入后显示</a></td> </tr> <tr> <td>实时温度</td> <td class="blue"><a href="/view/html/login.html">登入后显示</a></td> </tr> <tr> <td colspan="2"> <button class="oBtn">预约订库</button> </td> </tr> </table>');
        }
        if(window.lkuser && window.lkuser.vipType>=1){
            otherInfo.push('<table><caption>仓库信息</caption><tbody><tr><td><span>冷库经营类型：</span>'+manageType[rdc.manageType]+' </td> <td> <span>冷库温度类型：</span>'+tempType[rdc.temperType]+' </td> </tr> <tr> <td> <span>商品存放类型：</span>'+saveType[rdc.storageType]+'</td> <td> <span>建筑结构：</span>'+struct[rdc.structure]+' </td> </tr> <tr> <td> <span>是否有封闭月台：</span>'+isHave[rdc.platform]+' </td> <td> <span>是否有理货区：</span>'+isHave[rdc.lihuoRoom]+'</td> </tr> <tr> <td> <span>理货区面积：</span>'+rdc.lihuoArea+'㎡ </td> <td> <span>理货区有无温控：</span>'+isHave[rdc.lihuoTemperCtr]+' </td> </tr> <tr> <td> <span>制冷剂类型：</span>'+refreg[rdc.storageRefreg]+' </td> <td> <span>有无温度记录：</span>'+isHave[rdc.temperRecord]+' </td> </tr> <tr> <td> <span>周边设施：</span>'+rdc.facility+' </td> <td> <span>备注：</span>'+rdc.remark+' </td> </tr> <tr> <td> <span>冷藏车数量：</span> </td> <td> <span>冷库容积：</span> </td> </tr> <tr> <td> <span>＜1.8T：</span>'+rdc.coldTruck1+' 辆</td> <td> <span>8 ~ 25℃：</span> '+(rdc.height1*rdc.capacity1)+'m³</td> </tr> <tr> <td> <span>1.8 ～ 6T：</span> '+rdc.coldTruck2+'辆</td> <td> <span>2 ~ 8℃：</span> '+(rdc.height2*rdc.capacity2)+'m³</td></tr> <tr> <td> <span>6 ～ 14T：</span> '+rdc.coldTruck3+'辆</td> <td> <span>-2 ~ -18℃：</span> '+(rdc.height3*rdc.capacity3)+'m³</td> </tr> <tr> <td> <span>＞14T：</span>'+rdc.coldTruck4+'辆</td> <td> <span>-18 ~ -30℃：</span>'+(rdc.height4*rdc.capacity4)+'m³ </td> </tr> <tr> <td> </td> <td> <span><-50℃：</span>'+(rdc.height5*rdc.capacity5)+'m³ </td> </tr> </tbody></table>');
        }else {
            otherInfo.push('<table><caption>仓库信息</caption><tbody><tr><td><span>开通vip后显示</span></td></tr></tbody></table>');
        }
        $("#baseInfo").empty().append(baseInfo.join(''));
        $("#divimginfog_imgPlayer").empty().append(bigImg.join(''));
        $("#divpageinfog_imgPlayer").empty().append(smallImg.join(''));
        $("#otherInfo").empty().append(otherInfo.join(''));
        /*缩略图轮播*/
        foucsbox(2500);
    }});
}

$(function () {
    rdcId = getUrlParam("rdcId");
    getRdcInfo();
});
