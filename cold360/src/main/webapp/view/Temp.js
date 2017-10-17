var coldstorateList=[],cutt_obj=new Object();
//1.初始化冷间
initdata=function(webroot,rdcid,userId,userType ){//
	    cutt_obj={ webroot:webroot,rdcid:rdcid,userId:userId,userType:userType };
	    $.ajax({ url: cutt_obj.webroot+'/i/coldStorageSet/findStorageSetByUserId',type: 'GET',data:{rdcId:cutt_obj.rdcid,userId:cutt_obj.userId,type:cutt_obj.userType}, success: function(data) { 
			if(data!=null){
				coldstorateList=data;
				inittempset();
			}else{
				alert("请配置冷库信息！");
			}
	    }});
};	
//2.初始化温度配置
inittempset=function(){
	 $.each(coldstorateList, function(i, item){
		   $.ajax({ url: cutt_obj.webroot+'/i/temp/getTempsetByStorageID',type: 'POST',data:{oid:item.id}, success: function(data) { 
				if(data!=null){
					   var oids=new Array(),names=new Array();
					   $.each(data, function(i, tempset){ oids.push(tempset.id);names.push(tempset.name);   });
					   item.tempset={oids:oids,names:names };
					   initcolddata(item);
				 }
		    }});
      });
	 
	   var swiper = new Swiper('.swiper-container', {
	        pagination: '.swiper-pagination',
	        paginationClickable: true,
	        nextButton: '.swiper-button-next',
	        prevButton: '.swiper-button-prev',
	        spaceBetween: 30,
	        observer: true,//修改swiper自己或子元素时，自动初始化swiper
	        observeParents: true//修改swiper的父元素时，自动初始化swiper
	    });
};
//3.初始化数据
initcolddata=function(item){
	var endTime=new Date(),startTime=new Date(endTime.getTime()-9090000);
//	 $.each(coldstorateList, function(i, item){
		 if(item.tempset==undefined){return;}
		 var oid=item.tempset.oids,  onames=item.tempset.names;
		 $.ajax({ url: cutt_obj.webroot+'/i/temp/getTempByTime', type: 'POST',data:{"oid": item.id, "oids":oid,"names":onames, 'key':'Temp', "startTime": '2017-10-16 18:20:00', "endTime": '2017-10-17 18:30:00'}, traditional: true,success: function(data) { 
				if(data!=null){
//					var name = result.name;
		        	var curtemper=[], yData = [], 
		        	maxTime=endTime.getTime(), 
		        	tempMap = data.tempMap,
		        	systime=data.systime;
		        	
		            var datumTemp =  parseFloat(item.startTemperature) + 0.5 * parseFloat(item.tempdiff);//基准温度
		        	var i= 0,newdata = [],vo=cuttime=lasttime=null; 
		            $.each(tempMap, function(key, tempList){
		             	 vo=cuttime=null,  newdata = [],lasttime=startTime.getTime();
		                 if( tempList.length>0){
			                 for ( i = 0; i < tempList.length; i++) {
								 vo=tempList[i];
								 if(i>0){ lasttime=newdata[newdata.length-1].x;}
								 cuttime=new Date(vo.addtime).getTime();
			                	 if(cuttime-lasttime>900000){ newdata.push({ x: lasttime+60000,y: null });} //修正中间数据短传问题1
			                	 newdata.push({ x: cuttime,y: vo.value });
							}
			                if( systime-cuttime>1800000&&systime-maxTime<900000){//大于半个小时。。提醒
			                	newdata.push({ x: maxTime,y:null }); 
			                }   //修正尾部数据短传问题2
			               if(newdata[newdata.length-1].y!=null){ curtemper.push(newdata[newdata.length-1].y.toFixed(2));}
		                 }else{
		                	 if(!$scope.isErr){ $scope.isErr=true;}
		                	 newdata.push({ x: startTime.getTime(),y:null });
		                	 newdata.push({ x: maxTime,y:null });
		                 }
		                yData.push({"name": key, "data": newdata });
		            });
		            yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data: [{x: startTime.getTime(),y: datumTemp},{x: endTime.getTime(),y: datumTemp}]});//处理基准温度
		            initHighchart(item.id, item.name, curtemper, datumTemp, yData);
				 }
	     }});
		 
//     });
};

 initHighchart=function(storageID,storageName, curtemper,datumTemp,yData ){
	 console.log("创建h:"+storageID);
    	  var mainId = 'main' + storageID;
    	  if($("#"+mainId).length>0){//已经创建
              $("#tm"+mainId).html(curtemper+"℃");
    	  }else{
    		  $("#chartView").last().append('<div class="swiper-slide">' +'<p class="actually">' +storageName + '</p>' + '<p id="tm'+mainId+'" class="temperaturenum">' + curtemper + '℃</p>' + '<div id=' + mainId + '></div> ');
    	  }
		  $("#"+mainId).highcharts({
			  series: yData,
              legend: { enabled: false },
              exporting: {enabled: false},
              credits: { enabled: false },
              plotOptions: { series: { marker: { enabled: false } }},
              title: { text: '' },
              xAxis: {  type: 'datetime', tickPixelInterval: 150,  },
              yAxis: {title: {text: '温度(℃)' }, plotLines: [{value: 0,width: 1, color: '#808080' },  { color: 'red',   dashStyle: 'solid',   value: datumTemp, width: 2, label: {  text: '基准温度(' + datumTemp + '℃)',align: 'right',   x: 0   }  }] },
              tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2); } },
              chart: {
                  type: 'spline',
                  renderTo: 'temperatureChart',
                  animation: Highcharts.svg, // don't animate in old IE
                  marginRight: 10,
                  backgroundColor: {  linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},stops: [ [0, 'rgb(210, 214, 222)'],[1, 'rgb(210, 214, 222)'] ]  }, borderColor: '#d2d6de', borderWidth: 2, className: 'dark-container', plotBackgroundColor: 'rgba(210, 214, 222, .1)',  plotBorderColor: '#d2d6de', plotBorderWidth: 1
              }
			  
		  });
  };

  initdata("http://localhost", 1063, 1, 3);
  
