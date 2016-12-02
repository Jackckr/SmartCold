/**
 * Created by maqiang34 on 16/10/18.
 * 历史数据查询
 */
coldWeb.controller('historyData', function ($scope, $http,$rootScope,$timeout,baseTools) {
	var lineChart =null,stdate = new Date(); stdate.setHours(stdate.getHours () - 4);
	$scope.rdcid=window.sessionStorage.smrdcId,$scope.showobjgroup=false,$scope.coldstoragedoor=null;
	$scope.end  = baseTools.getFormatTimeString(),$scope.begin= baseTools.formatTime(stdate),$scope.picktime = $scope.begin + ' - ' + $scope.end;
//	 $('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss' , timePicker12Hour : false, maxDate : moment(), });
	   function initComplete(data){
	       $('#reservationtime').daterangepicker( {
	                   maxDate : moment(), //最大时间
	                   dateLimit : { days :2 }, //起止时间的最大间隔
	                   showDropdowns : true,
	                   showWeekNumbers : false, //是否显示第几周
	                   timePicker : true, //是否显示小时和分钟
	                   timePickerIncrement : 1, //时间的增量，单位为分钟
	                   timePicker12Hour : false, //是否使用12小时制来显示时间
	                   ranges : {
//	                	   '最近1小时': [moment().subtract('hours',1), moment()],
	                       '今日': [moment().startOf('day'), moment()],
	                       '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
	                       '最近3日': [moment().subtract('days', 3), moment()]
	                   },
	                   opens : 'right', //日期选择框的弹出位置
	                   buttonClasses : [ 'btn btn-default' ],
	                   applyClass : 'btn-small btn-primary blue',
	                   cancelClass : 'btn-small',
	                   format : 'YYYY-MM-DD HH:mm:ss', //控件中from和to 显示的日期格式
	                   separator : ' - ',
	                   locale : {
	                       applyLabel : '确定',
	                       cancelLabel : '取消',
	                       fromLabel : '起始时间',
	                       toLabel : '结束时间',
	                       customRangeLabel : '自定义',
	                       daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
	                       monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',  '七月', '八月', '九月', '十月', '十一月', '十二月' ],
	                       firstDay : 1
	                   }
	               }, function(start, end, label) {$('#reportrange span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss')); });
	   }
	   initComplete();
	
	//开始核心内容
	$scope.typemode={tit:['温度','电量','','','高压','排气温度'],unit:['(°C)','(kWh)','','','(kPa)','(°C)'],type:[1,10,2,11,3,5],key:['Temp','PWC','Switch','Switch','highPress','exTemp'],ismklin:[true,true,false,false,true,true]};
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
   
   $scope.expdata=function(){//导出数据
	   $scope.hidefilter();
		if($scope.oids&&$scope.oids.length>0){
			bothTime = $scope.picktime.split(" - ");
			$scope.begin = bothTime[0],$scope.end = bothTime[1];
			if($scope.checktime($scope.begin , $scope.end )){alert("查询区间时间最大为3天！");return;}
			$("#but_expdata").attr("disabled",true);
	        var expfrom= $("<form>").attr('style', 'display:none').attr('method', 'post').attr('action', 'i/baseInfo/expHistoryData').attr('id', "expdataform");
	        expfrom.attr("Content-Type","application/json;charset=UTF-8");
	        expfrom.append($("<input>").attr("name","rdcid").attr("value",$scope.rdcid));
	        expfrom.append($("<input>").attr("name","filename").attr("value","历史数据"));
	        expfrom.append($("<input>").attr("name","title").attr("value",$scope.slgptit));
	        expfrom.append($("<input>").attr("name","type").attr("value",$scope.typemode.type[$scope.sl_index]));
	        expfrom.append($("<input>").attr("name","oids").attr("value",$scope.oids));
	        expfrom.append($("<input>").attr("name","onames").attr("value",$scope.oldnames));
	        expfrom.append($("<input>").attr("name","key").attr("value",$scope.typemode.key[$scope.sl_index]));
	        expfrom.append($("<input>").attr("name","startTime").attr("value",$scope.begin));
	        expfrom.append($("<input>").attr("name","endTime").attr("value",$scope.end));
	        expfrom.appendTo('body').submit().remove();
	        setTimeout(function () {$("#but_expdata").attr("disabled",false); }, 3000);
		}else{
			 alert("没有设置查询对象！");
		}
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
                url:"i/baseInfo/getKeyValueDataByFilter",traditional:true,
                data:{type:$scope.typemode.type[$scope.sl_index],ismklin:$scope.typemode.ismklin[$scope.sl_index],oids:$scope.oids,onames: $scope.echnames,key:$scope.typemode.key[$scope.sl_index],startTime:$scope.begin,endTime:$scope.end},//
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
		var tooltipmd= {trigger: 'axis'};
		var yAxismode= {type : 'value', name :$scope.sl_unit,axisLabel : {formatter: '{value}'}} ;
	    if($scope.sl_index==2){//处理特殊事件
//		   yAxismode.axisLabel={ formatter:function(){  return this.value===0?"关":"开"; } };
//		   yAxismode.plotLines= [{value: 0, width: 1,color: '#808080' }];
//		   yAxismode. max=1; yAxismode.min=0;
//		   tooltipmd.formatter=function () {var state = undefined; if (this.y === 1){ state = '冷库处于开门状态'; } else {state = '冷库处于关门状态';} return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +state; } ;
	    }
		var s=$scope.oldnames;
		var xData=chardata.xdata,ydata=chardata.ydata;
		xData = xData.length > 0? xData : [1,2,3,4];
		ydata = ydata.length > 0 ? ydata : [ { name:$scope.slgptit, type:'line', data:[34,35,34,21] }] ;
		option = {
				calculable : true,
				legend: {data:s},
				title: {text: $scope.slgptit+$scope.typemode.unit[$scope.sl_index]},
			    tooltip :tooltipmd,
			    legend: {  data:[$scope.slgptit]},
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
		var catime =new Date(endDate).getTime()-new Date(startDate).getTime();  
	    return catime > 259200000; 
	 };
	 $scope.slgroupsl=function(e){//点击下拉框事件
		 $scope.showobjgroup=!$scope.showobjgroup;}
	 ;
	 $scope.chPress=function(vl,vtxt){//切换高低压
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
		$("#ul_key_list li").removeClass("select");
		var em=$($event.target),key=em.attr("kval");
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
	//********************************************************************事件END**********************************************************************
	 
});
