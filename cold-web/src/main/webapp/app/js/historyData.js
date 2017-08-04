/**
 * Created by maqiang34 on 16/10/18.
 * 历史数据查询
 */
coldWeb.controller('historyData', function ($scope, $http,$rootScope,$timeout,baseTools) {
	var lineChart =null,stdate = new Date(); stdate.setHours(stdate.getHours () - 6);
	$scope.rdcid=window.sessionStorage.smrdcId,$scope.showobjgroup=false,$scope.coldstoragedoor=null;
	$scope.end  = baseTools.getFormatTimeString(),$scope.begin= baseTools.formatTime(stdate),$scope.picktime = $scope.begin + ' - ' + $scope.end;
	function gettitval(val){if(val!=undefined&&val!=""){if($scope.sl_index!=2&&$scope.sl_index!=3){return val+$scope.typemode.unit[$scope.sl_index]; }else{return val==0?"关":"开";}}else{return "-";}}
    $("#reservationtime").daterangepicker({maxDate:moment(),dateLimit:{days:2},showDropdowns:true,showWeekNumbers:false,timePicker:true,timePickerIncrement:1,timePicker12Hour:false,ranges:{
    "今日":[moment().startOf("day"),moment()],
    "昨日":[moment().subtract("days",1).startOf("day"),moment().subtract("days",1).endOf("day")],
    "最近3天":[moment().subtract("days",3),moment()],
    '最近1小时': [moment().subtract('hours',1), moment()],
    '最近6小时': [moment().subtract('hours',6), moment()]
    },opens:"right",buttonClasses:["btn btn-default"],applyClass:"btn-small btn-primary blue",cancelClass:"btn-small",format:"YYYY-MM-DD HH:mm:ss",separator:" - ",locale:{applyLabel:"确定",cancelLabel:"取消",fromLabel:"起始时间",toLabel:"结束时间",customRangeLabel:"自定义",daysOfWeek:["日","一","二","三","四","五","六"],monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],firstDay:1}},function(start,end,label){$("#reportrange span").html(start.format("YYYY-MM-DD HH:mm:ss")+" - "+end.format("YYYY-MM-DD HH:mm:ss"));});
	//开始核心内容
	$scope.typemode={tit:['温度','电量','','','高压','排气温度'],unit:['°C','kWh','','','kPa','°C'],type:[18,10,2,11,3,5],key:['Temp','PWC','Switch','Switch','highPress','exTemp'],ismklin:[true,true,false,false,true,true]};
	$scope.oids=[],$scope.sltit="",$scope.sl_index=0,$scope.oldnames=[],$scope.slgptit="";
 //
   //设置数据模型
   $scope.gettit=function(){//自动设置标题
	       $scope.sltit=="";
	       $scope.oids=[];$scope.oldnames=[],$scope.echnames=[],keem=$("#ul_key_list li.select"),slemkey="#Temp_ul_"+ $scope.sl_index+" li.select",subtit="";
	       if($scope.sl_index==4){
	    	   subtit="-"+$('#Temp_ul_4 input[name="cmsbkey"]:checked').parent()[0].innerText;
	       }else  if( $scope.sl_index==5){
	    	   slemkey="#Temp_ul_5_key_span_"+ $('#Temp_ul_5 input[name="cmptkey"]:checked').val()+" li.select";
	       }
	       var lilist= $(slemkey);
	 	   $.each(lilist, function(index, item) {
	 		   $scope.oids.push($(item).attr("oid"));  
	 		   $scope.oldnames.push(item.innerText);
	 		    $scope.echnames.push(item.innerText+$scope.typemode.tit[$scope.sl_index]);
	 		});
	 	   $scope.slgptit=keem.text().replace(/\s/gi,'');//+$scope.typemode.tit[$scope.sl_index];
	 	   $scope.sltit=$scope.slgptit+subtit+ "-{"+ ($scope.oldnames.join(","))+"}";
   };
   
 
	$scope.search = function(){//查询事件
		$scope.hidefilter();
		if(lineChart==null){ lineChart = echarts.init($('#data-chart')[0]);}
		if($scope.oids&&$scope.oids.length>0){
			bothTime = $scope.picktime.split(" - ");
			$scope.begin = bothTime[0],$scope.end = bothTime[1];
			if($scope.checktime($scope.begin , $scope.end )){alert("查询区间时间最大为3天！");return;}
			lineChart.showLoading({text: '数据加载中……' }); 
			lineChart.clear(); 
			$.ajax({
                type: "POST",
                url:"i/history/getHistData",traditional:true,
                data:{type:$scope.typemode.type[$scope.sl_index],ismklin:$scope.typemode.ismklin[$scope.sl_index],oids:$scope.oids,onames: $scope.oldnames,key:$scope.typemode.key[$scope.sl_index],startTime:$scope.begin,endTime:$scope.end},//
                success: function(data) {
                    if(data.success){
                    	$scope.drawDataLine(data.entity);
                   }else{
                	   lineChart.hideLoading();  
                   }
                }
            });
		 }else{
			 lineChart.hideLoading();  
			 alert("没有设置查询对象！");
		 }
	};
	$scope.drawDataLine = function(chardata){
		var xData=chardata.xdata,ydata=chardata.ydata;
		var yAxismode= {type : 'value', axisLabel : {formatter: '{value}'}} ;
		var tooltipmd= {trigger: 'axis',formatter:function(params){
			var html=[]; 
			if(params.length!=undefined){
			  var relVal = params[0].name;  
			  if(relVal!=undefined&&relVal!=""){html.push(relVal+"<br/>"); }
	          for (var i = 0, l = params.length; i < l; i++) {  html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params[i].color+'"></span>'); html.push(params[i].seriesName + ' : '+gettitval(params[i].value)+"<br/>" );} return html.join(""); 
			}else{
				html.push(params.name+"<br/>"); 
				html.push('<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params.color+'"></span>'); 
				html.push(params.seriesName + ' : '+gettitval(params.value)+"<br/>" );
			   return html.join("");
			}
		}};
		if($scope.sl_index==2||$scope.sl_index==3){yAxismode={type : 'value',splitNumber: 1, axisLabel: {formatter: function(value){return value==1?"开":"关";} } };}
		var option = {
				calculable : true,
				legend: {data:$scope.oldnames},
				title: {text: $scope.sltit.substring(0,$scope.sltit.indexOf("{")-1)+$scope.typemode.unit[$scope.sl_index]},
			    tooltip :tooltipmd,
			    xAxis : [{type : 'category',data : xData} ],
			    yAxis :yAxismode,
			    grid:{x:80,x2:80},
			    series : ydata,
			    toolbox: {show: true,feature: {dataZoom: {yAxisIndex: 'none'},dataView: {readOnly: false},magicType: {type: ['line', 'bar']},restore: {},saveAsImage: {}} }
		};
		lineChart.setOption(option);
		lineChart.hideLoading();  
	};
	

	//********************************************************************事件START**********************************************************************
	$scope.checktime=function(startDate,endDate){
		  return Math.abs(startDate - endDate)/(1000*60*60*24)<3;     
	 };
	 $scope.slgroupsl=function(e){//点击下拉框事件
		 $scope.showobjgroup=!$scope.showobjgroup;}
	 ;
	 $scope.chPress=function(vl,vtxt,dw){//切换高低压
		 $scope.typemode.unit[$scope.sl_index]=dw;
		 $scope.typemode.key[$scope.sl_index]=vl;
		 $scope.typemode.tit[$scope.sl_index]=vtxt;
	 };
	 $scope.chexTemp=function($event){//切换排气温度
		 var em=$($event.target),oid=em.attr("value");
		 $("#Temp_ul_5 span").addClass("hide");
		 $("#Temp_ul_5_key_span_"+oid).removeClass("hide");
	 };
	 $scope.hidefilter=function(){//隐藏下拉框事件
		 if($scope.showobjgroup){$scope.gettit();$scope.showobjgroup=false;};
	 };
	 $scope.selkeyvl=function($event){//点击子项
    	 var em=$($event.target); 
    	 if(em.hasClass("select")){em.removeClass("select"); }else{ em.addClass("select");}
	 };
	 $scope.showkeyli=function($event){//点击标题导航
			 var em=$($event.target),key=em.attr("kval"),disid=em.attr("disid") ;
			 if(disid=="false"){return;}
		$("#ul_key_list li").removeClass("select");
		em.addClass("select");$scope.sl_index=key;
		$("#val_list_div ul").addClass("hide");
		$("#Temp_ul_"+key).removeClass("hide");
		if(key==5){//处理特殊情况
			var chptkey = $('#Temp_ul_5 input[name="cmptkey"]:checked').val();//获得选择的压缩机组
			if(chptkey==undefined||chptkey==''){
				var ptck=$('#Temp_ul_5 input[name="cmptkey"]:first');
				ptck.attr("checked",true);chptkey=ptck.val();
			}
			$("#Temp_ul_5 span").addClass("hide");
			$("#Temp_ul_5_key_span_"+chptkey).removeClass("hide");
		}
	 };
	 $scope.inintselect=function(){
		 $scope.gettit();
	 };
	 $scope.inintcoldoot=function(newValue,oldValue){//初始化冷库门
		   $http.get("/i/temp/getTempsetByRdcId",{params:{'rdcId':$scope.rdcid}}).success(function(data){ $scope.coldstorageTemp=data;});
		   if($rootScope.mystorages!=undefined){
			   $scope.prove={};
			   $.each($rootScope.mystorages, function(i, vo){  $scope.prove[vo.id]=vo.name;});
			   $http.get("/i/AnalysisController/getColdStorageDoor",{params:{'rdcId':$scope.rdcid}}).success(function(data){$scope.coldstoragedoor=data;});
			   $timeout($scope.inintselect,200);
		   }
	  };
	  $scope.$watch('mystorages',$scope.inintcoldoot,true);//监听冷库变化
	 
	 //windows事件
	 $(document).bind('click',function(e){ 
			if($scope.showobjgroup){
				 e = e || window.event; //浏览器兼容性 
				var elem = e.target || e.srcElement;
				while (elem) { if (elem.id && elem.id=='filter_sl_div') {  return;  }  elem = elem.parentNode; } $scope.$apply(function () { $scope.hidefilter(); });//循环判断至跟节点，防止点击的是div子元素
			};
	 });
    $("#oview").height($(".content-wrapper")[0].clientHeight);
	//********************************************************************事件END**********************************************************************
	 
});
