
function getRdcShare() {
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":3,"typeCode":1},success:function (data) {
        var rightRdcLease=[];
        var leftRdclease=[];
        for(var i=0;i<data.length;i++){
            if(i<=5){
                rightRdcLease.push('<li class="fl">');
                if(data[i].istemperaturestandard==1){rightRdcLease.push('<div class="lt">温度达标冷库</div>');}
                rightRdcLease.push('<a href="javascript:;"><div class="img"><img src="'+data[i].logo+'" alt=""><div class="bg">[2426]</div></div><div class="price clearfix"><span class="fl">¥'+data[i].unitPrice+'元/㎡/天</span>');
                if(data[i].audit==2){rightRdcLease.push('<b class="approve fr"><i class="iconfont">&#xe6ac;</i>已认证</b>');}else{rightRdcLease.push('<b class="reachStand fr"><i class="iconfont">&#xe63b;</i>未认证</b>');}
                rightRdcLease.push('</div><div class="city"><p class="omg"><i class="iconfont fl">&#xe61c;</i>'+data[i].detlAddress+'</p><p>可用面积：'+data[i].sqm+'㎡</p></div></a></li>');
            }else {
                leftRdclease.push('<li><a href="javascript:;"><span>'+(i-5)+'</span>['+data[i].name+'] 有'+data[i].sqm+'㎡冷库可用来出租，联系电话['+data[i].telephone+']</a></li>');
            }
        }
        $("#rightRdcLeaseUl").empty().append(rightRdcLease.join(''));
        $("#leftRdcLeaseUl").empty().append(leftRdclease.join(''));
    }});
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":3,"typeCode":2},success:function (data) {
        var rdcRent=[];
        for(var i=0;i<data.length;i++){
            if(i<=5){
                rdcRent.push('<li><a href="javascript:;"><span>'+(i+1)+'</span>['+data[i].detlAddress+'] '+data[i].title+'，联系电话['+data[i].telephone+']</a></li>');
            }
        }
        $("#rdcRentUl").empty().append(rdcRent.join(''));
    }});
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":1,"typeCode":1},success:function (data) {
        var shopInfo=[];
        for(var i=0;i<data.length;i++){
            if(i<=5){
                shopInfo.push('<li><a href="javascript:;"><span>'+(i+1)+'</span>['+data[i].detlAddress+'] '+data[i].title+'，联系电话['+data[i].telephone+']</a></li>');
            }
        }
        $("#shopInfoUl").empty().append(shopInfo.join(''));
    }});
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":1,"typeCode":2},success:function (data) {
        var buyShop=[];
        for(var i=0;i<data.length;i++){
            if(i<=5){
                buyShop.push('<li><a href="javascript:;"><span>'+(i+1)+'</span>['+data[i].detlAddress+'] '+data[i].title+'，联系电话['+data[i].telephone+']</a></li>');
            }
        }
        $("#buyShopUl").empty().append(buyShop.join(''));
    }});
}

$(function () {
    getRdcShare();
});
