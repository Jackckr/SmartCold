/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('tempReport', function( $scope, $rootScope,$stateParams,$http ,$timeout,$state,baseTools) {
	$scope.colors= ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'];  Highcharts.setOptions({  global: {useUTC: false } ,colors:$scope.colors });
	$scope.reportType=0;  $scope.isnotprint=false; $scope.charArray=[], $scope.anysisdata={};
	$scope.titmode=["日","七天","月度"],$scope.timemode=[0,7,30],$scope.minRange_mode=[[3600000,86400000,86400000],['%H:%M:%S','%Y-%m-%d','%Y-%m-%d']] , $scope.fontcol=['red' ,'#ED561B' ,'#058DC7' ];
	$scope.sumDatavalue=[[0,0],[0,0]];
	$scope.rdcId = $stateParams.rdcId;$scope.isnotprint=true;$scope.index=0;
	$("#date00").jeDate({  isinitVal:true, initAddVal:[0], festival: true, format: 'YYYY-MM-DD'});
	$("#date01").jeDate({  isinitVal:true, initAddVal:[-7], festival: true, format: 'YYYY-MM-DD',maxDate: $.nowDate(-7),});
	$("#date02").jeDate({  isinitVal:true,festival:false, ishmsVal:false,isToday:false, initAddVal:[-30],minDate: '2016-05-01 23:59:59', maxDate: $.nowDate(-30),  format:"YYYY-MM",zIndex:100});
	$scope.note=false;
	
	
	var formatDateTime = function (longtime) { 
		var date=new Date(longtime);
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        var h = date.getHours();  
        h=h < 10 ? ('0' + h) : h;  
        var minute = date.getMinutes();  
        minute = minute < 10 ? ('0' + minute) : minute;  
        var second=date.getSeconds();  
        second=second < 10 ? ('0' + second) : second;  
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
    };  
	//设置的开始时间
	 $scope.settime=function(){
			if($scope.reportType==0){//日报
				var newDate=$("#date00").val();firstDate = new Date(newDate+' 00:00:00'); endDate =  new Date(newDate+' 23:59:59');  
		    	$scope.endTime= baseTools.formatTime(endDate),$scope.startTime= baseTools.formatTime(firstDate), newtime=$scope.startTime.substring(0,10);
		    	if(newtime==$scope.timeuRange){$("#loding").hide();return;}
		    	$scope.timeuRange=newtime;
		    	$scope.datemod = [[ $scope.startTime, newDate + ' 02:59:59' ],[ newDate + ' 03:00:00',newDate + ' 05:59:59' ],[ newDate + ' 06:00:00',newDate + ' 09:59:59' ],[ newDate + ' 10:00:00',newDate + ' 12:59:59' ],[ newDate + ' 13:00:00',newDate + ' 15:59:59' ],[ newDate + ' 16:00:00',newDate + ' 18:59:59' ],[ newDate + ' 19:00:00',newDate + ' 20:59:59' ],[ newDate + ' 21:00:00',$scope.endTime ] ];
			}else if($scope.reportType==1){
				var newDate=$("#date01").val();
		    	 firstDate = new Date(newDate+' 00:00:00'); endDate =  new Date(newDate+' 23:59:59');  
		    	endDate.setDate(firstDate.getDate()+6);
		    	$scope.endTime= baseTools.formatTime(endDate); 
		    	$scope.startTime= baseTools.formatTime(firstDate); 
		    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
		    	if(newtime==$scope.timeuRange){$("#loding").hide();return;}
		    	$scope.timeuRange=newtime;
		    	var lst=firstDate.getTime(),len=endDate.getTime(), pver=(len-lst)/8;
		    	 $scope.datemod = [
						[ $scope.startTime,formatDateTime(lst+pver) ],
						[formatDateTime(lst+pver  +1000), formatDateTime(lst+pver*2)],
						[formatDateTime(lst+pver*2+1000),formatDateTime(lst+pver*3) ],
						[formatDateTime(lst+pver*3+1000),formatDateTime(lst+pver*4)],
						[formatDateTime(lst+pver*4+1000),formatDateTime(lst+pver*5)],
						[formatDateTime(lst+pver*5+1000),formatDateTime(lst+pver*6) ],
						[formatDateTime(lst+pver*6+1000),formatDateTime(lst+pver*7) ],
						[formatDateTime(lst+pver*7+1000),$scope.endTime ] 
						];
			}else if($scope.reportType==2){
		    	var data=$("#date02").val(),newDate=data.split("-");
		    	if(newDate.length!=2){ return; }
		    	 firstDate = new Date();firstDate.setFullYear(newDate[0], newDate[1]-1, 1);firstDate.setHours(0); firstDate.setMinutes(0); firstDate.setSeconds(0);//设置上月的第一天
		    	 endDate = new Date(firstDate);  endDate.setMonth(firstDate.getMonth()+1); endDate.setDate(0);endDate.setHours(23); endDate.setMinutes(59); endDate.setSeconds(59);//设置上月的最后一天
		    	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate); 
		    	var newtime=$scope.startTime.substring(0,10)+"至"+$scope.endTime.substring(0,10);
		    	if(newtime==$scope.timeuRange){$("#loding").hide();return;} 
		    	$scope.timeuRange=newtime;
							    $scope.datemod = [
									[ $scope.startTime, data + '-03 23:59:59' ],[ data + '-04 00:00:00',data + '-07 23:59:59' ],
									[ data + '-08 00:00:00',data + '-11 23:59:59' ],[ data + '-12 00:00:00',data + '-15 23:59:59' ],
									[ data + '-16 00:00:00',data + '-19 23:59:59' ],[ data + '-20 00:00:00', data + '-24 23:59:59' ] ,
									[ data + '-25 00:00:00',data + '-27 23:59:59' ],[ data + '-28 00:00:00',  $scope.endTime  ] 
								];
			}
	};
	$scope.settime();
	$scope.oids=[],$scope.names=[];//当前登陆tempid;
	$http.get('/i/physicalController/getCompNameByRdcId',{params: {"rdcId":$scope.rdcId } }).success(function(data){
		$scope.compName=(data.message&&data.message!=""&&data.message!="null")?data.message:$rootScope.vm.choserdc.name;
	});
	//1.初始化温度图表====================================================================================================================================================================================
	/**
	 * 1.1初始化冷库温度对象集合（基础数据）
	 */
	$scope.initTemp=function(){
			if($rootScope.Tempset&&$rootScope.Tempset[$scope.storageID]){
		   		 $scope.oids=$rootScope.Tempset[$scope.storageID].oids;
		   		 $scope.names=$rootScope.Tempset[$scope.storageID].names;
		   		 $scope.loadTemp();
		   	}else{
		   		 $http.get('/i/temp/getTempsetByStorageID', { params: {"oid": $scope.cuttstorage.id}}).success(function (data) {if(data){
		   		    	var oids=[],names=[];
		   			      angular.forEach(data,function(obj,i){oids.push(obj.id);names.push(obj.name);  });
		   		    	 	 $rootScope.Tempset[$scope.cuttstorage.id]={oids:oids,names:names};
		   		    	      $scope.oids=oids; $scope.names=names;
		   		    	   	 $scope.loadTemp();
		   		 };});	
		   	};
	};
	/**
	 * 1.2加载数据
	 */
	 $scope.loadTemp = function () {
	    	if($scope.oids.length==0){ $("#loding").hide();return;};
	    		var longmotdata=[],count=[];
	    		  angular.forEach($scope.datemod,function(item,i){
	    			  $http.get('/i/temp/getTempByTime', { params: {index:i,oid:$scope.cuttstorage.id, oids:$scope.oids,names:$scope.names, 'key':'Temp', "startTime":item[0], "endTime":item[1]}}).success(function (result) {
	    					 longmotdata[result.index]=result;
	    					 count.push(result.index);
	    					 if( count.length==8){
		    					  var fristdata=longmotdata[0]; 
		    					  longmotdata.shift(); //  	
		    					  angular.forEach(longmotdata,function(obj,i){
		    						  angular.forEach(obj.tempMap,function(obj1,i){
		    							  if(obj1.length>0){
		    								  fristdata.tempMap[i]=fristdata.tempMap[i].concat(obj1);
		    							  }
		    						  });
		    					  });
		    					  $scope.initTempAxis(fristdata);
	    					 }
			          });
	    		  });
	 };
	/**
	 *1.3 数据封装
	 */
	$scope.initTempAxis=function(data){
	        var datumTemp =  parseFloat(data.startTemperature) + 0.5 * parseFloat(data.tempdiff), datumTemp1 =  parseFloat(data.startTemperature) + parseFloat(data.tempdiff), datumTemp2 = data.startTemperature;//基准温度
	        $scope.cuttstorage.datumTemp=datumTemp;
	        var yData = [], tempMap = data.tempMap,temp=null,minval=null,maxval=null,sumvl=null, anysis=[];
	    	var i= 0,tempList=[],newdata = [],vo=cuttime=lasttime=null;
	        for(var key in tempMap) { 
	         	 vo=cuttime=null, tempList=tempMap[key],newdata = [];
	             if( tempList.length>0){
	            	 sumvl=0;
	            	 minval= tempList[0].value, maxval= tempList[0].value;
	            	 lasttime=new Date(tempList[0].addtime).getTime();
	                 for ( i = 0; i < tempList.length; i++) {
						 vo=tempList[i], temp= vo.value;
						 sumvl+=temp;
						 if(temp<minval){minval=temp; }
						 if(temp>maxval){maxval=temp; }
						 cuttime= new Date(vo.addtime).getTime();
						 if( cuttime-lasttime>1800000){
							 newdata.push({x:cuttime+3000,y:null});
			              }  
						 newdata.push({x:cuttime,y:temp});
						 lasttime=cuttime;
					}
	                 anysis.push({'key':key,'minval':minval,'maxTemp':maxval,'avgTemp':sumvl/ tempList.length}) ;
	             }
	             yData.push({"name": key, "data": newdata,turboThreshold:0,    marker: {enabled: false }});
	        } 
	        if(anysis.length>0){
	        	minval=anysis[0].minval,maxval=anysis[0].maxTemp,sumavg=0;
	        	for(var i in anysis){
	        		if(anysis[i].minval<minval){minval=anysis[i].minval;};
	        		if(anysis[i].maxTemp>maxval){maxval=anysis[i].maxTemp;};
	        		sumavg+=anysis[i].avgTemp;
		        }
	        	sumavg=sumavg/anysis.length;
	        	$scope.anysisdata.asisarry=anysis;
	        	$scope.anysisdata.asisdata={'minval':minval.toFixed(2),'maxval':maxval.toFixed(2),'avgTemp':sumavg.toFixed(2)};
	        	yData.push({ name: '平均温度', color: '#32CD32', marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:sumavg},{ x:endDate.getTime(),y:sumavg}],dashStyle:'dash'});//处理基准温度
	        }
	        yData.push({ name: '基准温度', color: 'red', marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:datumTemp},{ x:endDate.getTime(),y:datumTemp}]});//处理基准温度
	        yData.push({ name: '报警基线', color: '#f39c12',marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:datumTemp1},{ x:endDate.getTime(),y:datumTemp1}],dashStyle:'dash'});//处理基准温度
	        yData.push({ name: ' ', color: '#f39c12', marker: { symbol: 'circle' },data:[{x:firstDate.getTime(),y:datumTemp2},{ x:endDate.getTime(),y:datumTemp2}],dashStyle:'dash'});//处理基准温度
	        $scope.initHighchart(yData);
	};
	/**
	 * 1.4绘制图表
	 */
	$scope.initHighchart=function(yData ){
		var minRange= $scope.minRange_mode[0][$scope.reportType],fm=$scope.minRange_mode[1][$scope.reportType];
//		new Highcharts.Chart({ 
//			 chart: { renderTo: 'temperatureChart', zoomType: 'x'},
//            title: { text: ''  },
//            series:yData,
//            yAxis: {  title: {  text: '温度'  }},
//            xAxis: { type: 'datetime',minRange:minRange ,labels: {  formatter: function() {   return  Highcharts.dateFormat(fm, this.value);  }  }  },//minRange:  86400000--间隔为每天显示, tickPixelInterval: 400 ,
//            xDateFormat: '%Y-%m-%d',
//            tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2)+" ℃"; } },
//    	    legend: {enabled: false },
//    	    credits: { enabled: false},
//        });
		$scope.charArray[0]= $('#temperatureChart').highcharts({
			 chart: {  zoomType: 'x'},
			 title: { text: ''  },
	            series:yData,
	            yAxis: {  title: {  text: '温度'  }},
	            xAxis: { type: 'datetime',minRange:minRange ,labels: {  formatter: function() {   return  Highcharts.dateFormat(fm, this.value);  }  }  },//minRange:  86400000--间隔为每天显示, tickPixelInterval: 400 ,
	            xDateFormat: '%Y-%m-%d',
	            tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2)+" ℃"; } },
	    	    legend: {enabled: false },
	    	    credits: { enabled: false}
       });
	  $("#loding").hide(); 
	};
	//2.超温时间和次数图表====================================================================================================================================================================================
	$scope.overTempAndCount=function(){
		$http.get('/i/AnalysisController/getAnalysisDataByDate', { params: {type:1, oid:$scope.cuttstorage.id, keys:'ChaoWenShiJian,ChaoWenCiShu,', startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
		   var  val=0, ccount=0,ctime=0, date=0;
			var otlist=	data['ChaoWenShiJian'],oclist=	data['ChaoWenCiShu'];
		     var xAxis=[],countmode={}, count=[],time=[];
		     angular.forEach(oclist,function(item){
		    	 ccount+=item['value']; 
		    	 countmode[baseTools.formatTime(item['date']).split(" ")[0]]=item['value'] ;
		     });
			 angular.forEach(otlist,function(item){ 
				    val=parseFloat((item['value'] / 60).toFixed()), ctime+=val, date = baseTools.formatTime(item['date']).split(" ")[0];
				    xAxis.push(date);
				    time.push(val);
				    count.push(countmode[date]?countmode[date]:val>0?1:0);
			 });
			 $scope.sumDatavalue[0]=[ccount,ctime];// $scope.sumDatavalue[0]=[ccount,ctime];
			 $scope.dwoverTempAndCount(xAxis, count, time);
		});
	};
	
	 $scope.dwoverTempAndCount=function(xAxis,count,time){
		 $scope.charArray[1]= $('#tempovertime').highcharts({
		        chart: { zoomType: 'x' },
			    title: {text: '超温时长及次数统计表',align: 'left',x: 0,style:{fontWeight:700,fontSize:16}},
		        subtitle: { text: '' },
		        credits: { enabled: false},
		        xAxis: [{ categories: xAxis, crosshair: true ,tickInterval: 3}],
		        yAxis: [{
		            labels: {  format: '{value}次' },
		            title: { text: '超温次数(次）'  },
		            opposite: true,min:0
		        }, {
		            gridLineWidth: 0,
		            title: { text: '超温时长(分钟)' },
		            labels: { format: '{value}分钟' }
		        }],
		        tooltip: {  shared: true },
			 	legend:{align:'right',verticalAlign: 'top',x: 0,y: -10},
		        series:
		         [{ name: '超温时长',type: 'column',yAxis: 1, data: time, tooltip: {  valueSuffix: '分钟' } ,min:0},
		          { name: '超温次数', type: 'spline', data: count,tooltip: {  valueSuffix: ' 次'} }]
		    });
	  };
//3.告警时长和次数图表====================================================================================================================================================================================
	  //1.告警消息
	  $scope.iscuttday=function(){
		  return $scope.reportType==0&&$("#date00").val()== baseTools.formatTime(new Date()).substr(0,10);
	  };
	  $scope.initTempWarningmsg=function(){
		  $http.get('/i/AlarmController/getOverTempByTime', { params: {rdcId:$scope.rdcId,  oid:$scope.cuttstorage.id,level:1, startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
			  $scope.warninglist=data;
		  });
	  };
	   $scope.dwrtemplin=function(){
			$http.get('/i/AnalysisController/getAnalysisDataByKey', { params: {type:1, oid:$scope.cuttstorage.id, keys:'OverTempL1Time,OverTempL2Time,OverTempL3Time,OverTempL1Count,OverTempL2Count,OverTempL3Count', startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
				if(data&&data.OverTempL1Time){
					$scope.dwrc(data);//第一套逻辑
				}
			});
	};
	
	$scope.dwrc=function(data){
		var xdata=[],l1time=[],l1tailtime=0, l1tailcount=0,l2tailcount=0,l3tailcount=0, l1count=[],l2time=[],l2count=[],l3time=[],l3count=[];
		angular.forEach(data.OverTempL2Time, function(obj,i){ l2time.unshift(obj.value);});
		angular.forEach(data.OverTempL3Time, function(obj,i){ l3time.unshift(obj.value);});
		angular.forEach(data.OverTempL2Count,function(obj,i){l2count.unshift(obj.value);l2tailcount+=obj.value;});
		angular.forEach(data.OverTempL3Count,function(obj,i){l3count.unshift(obj.value);l3tailcount+=obj.value;});
		angular.forEach(data.OverTempL1Count,function(obj,i){l1count.unshift(obj.value); l1tailcount+=obj.value;});
		angular.forEach(data.OverTempL1Time,function(obj,i){xdata.unshift(baseTools.formatTime(obj.date).split(" ")[0]);l1time.unshift(obj.value);l1tailtime+=obj.value;});
//		var score=100-l1tailcount*10- parseInt(l2tailcount/4)*5- parseInt(l3tailcount/8)*2;
		$scope.cuttstorage.l1tailtime=l1tailtime;
		$scope.cuttstorage.l1tailcount=l1tailcount;
//		$scope.cuttstorage.score=score<0?0:score;
		 $scope.charArray[2]= 	$('#tempwarning').highcharts({
	        title: { text: '超温报警时长及次数统计表',align: 'left',x: 0,style:{fontWeight:700,fontSize:16}},
             legend:{align:'right',verticalAlign: 'top',x: 0,y: -10},
	        chart: {  type: 'column' },
	        xAxis: [{  categories: xdata, crosshair: true,tickInterval: 3 }],
	        yAxis: [{ title: { text: '报警次数 (次)' }, opposite: true },{ title: { text: '报警时长(m)', } } ],
	        tooltip: { shared: true },
	        credits: { enabled: false },
	        series: [
	                 { name: '危险告警时长', type: 'column', yAxis: 1, data: l1time,tooltip: {  valueSuffix: ' min' } ,color:'red' },
	                 { name: '严重告警时长', type: 'column', yAxis: 1, data: l2time,tooltip: {  valueSuffix: ' min' } ,color:'#ED561B'  },
	                 { name: '正常告警时长', type: 'column', yAxis: 1, data: l3time,tooltip: {  valueSuffix: ' min' } ,color:'#058DC7'  },
	                 { name: '危险告警次数', type: 'spline', data: l1count, tooltip: { valueSuffix: '次' } ,color:'red'},
	                 { name: '严重告警次数', type: 'spline', data: l2count, tooltip: { valueSuffix: '次' } ,color:'#ED561B'},
	                 { name: '正常告警次数', type: 'spline', data: l3count, tooltip: { valueSuffix: '次' } ,color:'#058DC7'}
	                ]
	    });
	};
	/**
	 * 计算超温比例
	 * 24*60*60=86400
	 * 
	 * 
	 */
	$scope.getColdstarageYinZi=function(){
		$http.get('/i/AnalysisController/getAnalysisDataByKey', { params: {type:1, oid:$scope.cuttstorage.id, keys:'OverTempArea', startTime:$scope.startTime, endTime:$scope.endTime}}).success(function (data) {
			var sumarea=0,crscore=0, iszore=false ,day=data.OverTempArea.length;    
			angular.forEach(data.OverTempArea, function(obj,i){ 
				crscore= 	(86400-obj.value)/864;
				if(crscore<=	0){
					$scope.cuttstorage.score=0;
					iszore=true;
				}else{
					sumarea+=crscore;
				}
			});
			
			if(iszore||sumarea<0){
				sumarea=0;
			}else if(day>0){
				sumarea=	(sumarea/(day*864)).toFixed(2);
			}else{
				 sumarea=100;
			};
			$scope.cuttstorage.score=sumarea;
		});
	};
	
	//初始化系统入口====================================================================================================================================================================================
	 $scope.initdata=function(){
            $("#loding").show();
			$scope.cuttstorage=$rootScope.mystorages[$scope.index];
			$scope.initTemp();	
			$scope.dwrtemplin();
			$scope.initTempWarningmsg();
			$scope.overTempAndCount();
			$scope.getColdstarageYinZi();//
	 };
	 
	if($rootScope.mystorages==undefined){
		  $scope.changeStorages=function(){
			   if($rootScope.mystorages!=undefined){
				   initdatawatch();
				   $scope.initdata();
			   }
		    };
		  initdatawatch= $scope.$watch('mystorages', $scope.changeStorages,true);//监听冷库变化
	}else{
		$scope.initdata();
	}
	//初始化事件====================================================================================================================================================================================
	function printpage(){
    	$(".chartPart").css('border',0);
    	$(".textPart p>span,.textPart>ul>li span,.textPart p>strong").addClass('font10');
    	$.print('#print');}
    function chanpangstatus(){
    	$scope.isnotprint=true;
    	$(".chartPart").css('border','1px solid #eee');
    	$(".textPart p>span,.textPart>ul>li span,.textPart p>strong").removeClass('font10');
    }
	$scope.Preview=function(){ //打印预览
		  $scope.isnotprint=false;
		  angular.forEach($scope.charArray,function(item){ 
			  item.exportChart("png") ;
			   var imgURL = item.getDataURL('png');//获取base64编码
			  $(item.selector+"_img").html("<img src="+imgURL+" title='超温时长(min/day)'>");
			 });
		  $timeout(printpage,0); 
		  $timeout(chanpangstatus,0);//加入js队列
	 };
	
	 $scope.exppdf=function(){
		 html2canvas($('#print'), {
            onrendered:function(canvas) {
            	var contentWidth = canvas.width,contentHeight = canvas.height;
                var pageHeight = contentWidth / 592.28 * 841.89, leftHeight = contentHeight;
                var position = 0, imgWidth = 595.28;
                var imgHeight = 592.28/contentWidth * contentHeight;
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                var pdf = new jsPDF('', 'pt', 'a4');
                if (leftHeight < pageHeight) {
                   pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        if(leftHeight > 0) { //避免添加空白页
                          pdf.addPage();
                        }
                    }
                }
                pdf.save($rootScope.vm.choserdc.name+"-"+$scope.cuttstorage.name+$scope.titmode[$scope.reportType]+'分析报告.pdf');
            }
        });
	 };
	 
	
	 /**
	  * 查询事件
	  */
	$scope.getreport=function(){
		$("#loding").show();
		$scope.settime();
		 $scope.initdata();
	};
	/**
	 * 切换冷库事件
	 */
	$scope.changestorage=function(index,storageid,$event){
		$("#loding").show();
		var em=$($event.target);
		em.addClass('select').siblings().removeClass('select');
		$scope.index=index;
		 $scope.initdata();
	};
	$scope.changeversions=function(index,url,$event){
		if((index==1||index==2)&&!$rootScope.aclmap[20]){ return ;}
		var em=$($event.target); em.addClass('select').siblings().removeClass('select');
		$state.go(url, {'rdcId':$scope.rdcId });
	};
	
	
});
