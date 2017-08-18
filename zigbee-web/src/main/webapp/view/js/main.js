 var chartArry=[], colorList = ['','#C1232B','#B5C334','#FCCE10','#E87C25','#27727B', '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'];

function getRdcShare() {
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":3,"typeCode":1},success:function (data) {
        var rightRdcLease=[];
        var leftRdclease=[];
        for(var i=0,tel='';i<data.length;i++){
            if(window.lkuser){tel=data[i].telephone;}else{tel=telMd5(data[i].telephone);}
            if(i<=5){
                var price='';
                rightRdcLease.push('<li class="fl">');
                if(data[i].istemperaturestandard==1){rightRdcLease.push('<div class="lt">温度达标冷库</div>');}
                if(data[i].unitPrice!=0&&data[i].unitPrice!=undefined){
                    if(data[i].unit1&&data[i].unit2&&data[i].unit1!=""&&data[i].unit2!=""){
                        price=data[i].unitPrice+'元/'+data[i].unit2+'/'+data[i].unit1;
                    }else {
                        price=data[i].unitPrice+'元/㎡/天';
                    }
                }else{
                    price='面议'
                };
                rightRdcLease.push('<a href="view/html/rdcmatchinfo.html?id='+data[i].id+'"><div class="img"><img src="'+data[i].logo+'" alt=""><div class="bg omg">'+data[i].title+'</div></div><div class="price clearfix"><span class="fl">'+price+'</span>');
                if(data[i].audit==2){
                    if(data[i].rdcID==1878){rightRdcLease.push('<b class="approve fr"><i class="iconfont">&#xe65d;</i>已通过</b>')}
                    else{rightRdcLease.push('<b class="approve fr"><i class="iconfont">&#xe6ac;</i>已认证</b>');}
                }else{rightRdcLease.push('<b class="reachStand fr"><i class="iconfont">&#xe63b;</i>未认证</b>');}
                rightRdcLease.push('</div><div class="city"><p class="omg"><i class="iconfont fl">&#xe61c;</i>'+data[i].detlAddress+'</p><p>可租面积：'+data[i].sqm+'㎡</p></div></a></li>');
            }else {
                var datainfo='<p class="omg"><span>'+(i-5)+'</span>['+data[i].title+'] 有'+data[i].sqm+'㎡冷库可用来出租，联系电话['+tel+']</p>';
                leftRdclease.push('<li><a href="view/html/rdcmatchinfo.html?id='+data[i].id+'">'+datainfo+'</a></li>');
            }
        }
        $("#rightRdcLeaseUl").empty().append(rightRdcLease.join(''));
        $("#leftRdcLeaseUl").empty().append(leftRdclease.join(''));
    }});
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":3,"typeCode":2},success:function (data) {
        var rdcRent=[];
        for(var i=0,tel='';i<data.length;i++){
            if(window.lkuser){tel=data[i].telephone;}else{tel=telMd5(data[i].telephone);}
            if(i<=6){
                var datainfo='<p class="omg"><span>'+(i+1)+'</span>['+data[i].detlAddress+'] '+data[i].title+'，联系电话['+tel+']</p>';
                rdcRent.push('<li><a href="view/html/rdcmatchinfo.html?id='+data[i].id+'">'+datainfo+'</a></li>');
            }
        }
        $("#rdcRentUl").empty().append(rdcRent.join(''));
    }});
    $.ajax({url:"/i/ShareRdcController/getSERdc",type:"post",data:{"dataType":1,"typeCode":null},success:function (data) {
        var shopInfo=[];
        for(var i=0,tel='';i<data.length;i++){
            if(window.lkuser){tel=data[i].telephone;}else{tel=telMd5(data[i].telephone);}
            if(i<=5){
                var datainfo='<p class="omg"><span>'+(i+1)+'</span>['+data[i].typeText+'] '+data[i].title+'，联系电话['+tel+']</p>';
                shopInfo.push('<li><a href="view/html/rdcmatchinfo.html?id='+data[i].id+'">'+datainfo+'</a></li>');
            }
        }
        $("#shopInfoUl").empty().append(shopInfo.join(''));
    }});
}
function dwrechar(index,em,title,data,type){
	     var xdata=[],ydata=[];
	     for (var i = 1; i < data.length; i++) { xdata.push( data[i]['date']); ydata.push( data[i]['value']);}
 	     chartArry[index]= echarts.init(document.getElementById(em));
	     var option1 = {
	        title: {  text: title,left:'center', textStyle:{  fontWeight:'400' } },
	        grid:{  x:30, y:45,  x2:10, y2:35,   borderWidth:1 },
	        xAxis: {
	            data: xdata,
	            axisLabel:{   textStyle: { color: '#66d1f7'  }, interval:0, rotate: 30 },
	            axisLine:{ lineStyle:{ color:'#f4f4f4' }},
	            splitLine:{ lineStyle:{  color:'#f4f4f4' }}
	        },
	        yAxis: { axisLabel:{textStyle: {color: '#66d1f7'  } }, axisLine:{ lineStyle:{ color:'#f4f4f4', }}, splitLine:{ lineStyle:{  color:'#f4f4f4'} } },
	        series: [{  type: type,  data: ydata,  barWidth:30 }]
	    };
	   if(type=='bar'){ option1.series[0].itemStyle= {  normal: {  color: function(params) { return colorList[params.dataIndex];} }  };  }else{ option1.series[0].itemStyle={ normal: { color:'#ff916c' }  }; option1.series[0].smooth= true;}
	    chartArry[index].setOption(option1);
}

function initechardata(){
	//var startTime=new Date(),endTime=new Date();startTime.setFullYear(endTime.getFullYear()-1);
	//$.ajax({url:"/i/DataAnalysis/getDataAnalysisBykey",type:"post",data:{type:1,key:'price',startTime:startTime,endTime:endTime},success:function (data) {  dwrechar(0,'main1','全国冷库价格趋势图',data,'bar'); }});
	//$.ajax({url:"/i/DataAnalysis/getDataAnalysisBykey",type:"post",data:{type:1,key:'boom',startTime:startTime,endTime:endTime},success:function (data) {  dwrechar(1,'main2','中国冷链物流景气指数',data,'line'); }});
	//$.ajax({url:"/i/DataAnalysis/getDataAnalysisBykey",type:"post",data:{type:1,key:'energy',startTime:startTime,endTime:endTime},success:function (data) {  dwrechar(1,'main3','全国冷库能耗势图',data,'line'); }});
}
function resizeChart() {
  for (var i = 1; i < chartArry.length; i++) {chartArry[i].resize(); }
}
$(function () {
    getRdcShare();
    initechardata();
    window.onresize = function () {
        resizeChart();
    };
    var telTxt=["<span>1</span>汇源集团冷链运输招标  联系人：田先生13718154618","<span>2</span>华润万家深中冷链运输项目招标公告 马丽丽 0755-28450635","<span>3</span>U家超市冷链设备招标公告 韦先生18377335381",
        "<span>4</span>辽宁华润万家门店冷链维修招标 杨建群：024-25103229","<span>5</span>疫苗冷库温湿度监测系统采购招标 王英芳 0398-2846506","<span>6</span>冶春食品冷藏车采购 曹慧颖  0514-87806576"]
    if(window.lkuser){
        for(var i=0;i<6;i++){
            $(".list3 ul li").eq(i).children('a').children('p').html(telTxt[i])
        }
    }
});
