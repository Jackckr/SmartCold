/**
 * Created by maqiang34 on 16/10/18.
 * 历史数据查询
 */
coldWeb.controller('exphistoryData', function ($scope, $http,$rootScope,$timeout,baseTools) {
	var stdate = new Date(); stdate.setHours(stdate.getHours () - 6);
	$scope.rdcid=window.sessionStorage.smrdcId,$scope.showobjgroup=false,$scope.coldstoragedoor=null;
	$scope.end  = baseTools.getFormatTimeString(),$scope.begin= baseTools.formatTime(stdate),$scope.picktime = $scope.begin + ' - ' + $scope.end;
    $("#reservationtime").daterangepicker({maxDate:moment(),dateLimit:{days:2},showDropdowns:true,showWeekNumbers:false,timePicker:true,timePickerIncrement:1,timePicker12Hour:false,ranges:{
    "今日":[moment().startOf("day"),moment()],
    "昨日":[moment().subtract("days",1).startOf("day"),moment().subtract("days",1).endOf("day")],
    "最近3天":[moment().subtract("days",3),moment()],
    '最近1小时': [moment().subtract('hours',1), moment()],
    '最近6小时': [moment().subtract('hours',6), moment()]
    },opens:"right",buttonClasses:["btn btn-default"],applyClass:"btn-small btn-primary blue",cancelClass:"btn-small",format:"YYYY-MM-DD HH:mm:ss",separator:" - ",locale:{applyLabel:"确定",cancelLabel:"取消",fromLabel:"起始时间",toLabel:"结束时间",customRangeLabel:"自定义",daysOfWeek:["日","一","二","三","四","五","六"],monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],firstDay:1}},function(start,end,label){$("#reportrange span").html(start.format("YYYY-MM-DD HH:mm:ss")+" - "+end.format("YYYY-MM-DD HH:mm:ss"));});
	//开始核心内容
	$scope.typemode={tit:['温度','电量','','','高压','排气温度'],unit:['°C','kWh','','','kPa','°C'],type:[1,10,2,11,3,5],key:['Temp','PWC','Switch','Switch','highPress','exTemp'],ismklin:[true,true,false,false,true,true]};
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
   
   //
   
   
   $scope.getUserTask=function(){
	   $http.get('/i/history/getTaskByUid', { params: { uid: user.id} }).success(function (result) {
		   $scope.tasklist=result;
		   $scope.unfinishedtask=[];
		   $.each($scope.tasklist, function(i, vo){
			   if(vo.state<100){ $scope.unfinishedtask.push({id:vo.id,ip:vo.exqip,port:vo.className}); }
		   });
		  if($scope.unfinishedtask.length>0){
			   clearInterval($rootScope.timeTicket);
			   $rootScope.timeTicket = setInterval(function () { $scope.getRunTaskStatus(); }, 1000);
			   $scope.$on('$destroy',function(){ clearInterval($rootScope.timeTicket);  });
		  }
       });
   };
   $scope.getRunTaskStatus=function(){
	   if($scope.unfinishedtask.length==0){ return;}
	   $.each($scope.unfinishedtask, function(i, vo){
		   $http.get('http://'+vo.ip+':'+vo.port+'/i/history/getTaskProgress', { params: { id:vo.id} }).success(function (result) {
			   if(result>=0){
				   $("#prog_usertask_"+vo.id).css({  width:result+"%"});
				   $("#prog_usertask_"+vo.id).children(".sr-only").html((Math.round(result)==100)?"":Math.round(result)+"%");
				   $("#td_taskstate_"+ vo.id).html("<font style='color: #f80;'>进行中</font>");
				   if(result==100){  
					   $("#td_taskstate_"+ vo.id).html("<font style='color: forestgreen;'>已完成</font>");
					   $("#but_dow_"+ vo.id).removeAttr("disabled"); 
					   $scope.unfinishedtask.splice(i,1);
					}
			   }else{
				   $scope.unfinishedtask.splice(i,1);
				   $("#td_taskstate_"+ vo.id).html("<em style='color: red;'>任务失败！</em>");
			   }
		   });
		   
	  });
   };
   
   $scope.downloadFile=function(id,ip,port,fileName){
	   $scope.createForm(ip,port,fileName);
   };
   
   $scope.delTask=function(id){
	   $http.get('/i/history/delTempTask', { params: { id:id} }).success(function (result) {
		   if(result){
			   $("#tr_task_"+id).remove();
		   }
	   });
   };
   
   $scope.expdata=function(){//导出数据
	   $scope.hidefilter();
	    $("#but_expdata").attr("disabled",true);
		if($scope.oids&&$scope.oids.length>0){
		   //记录是否在任务队列中，如果有则不计算	
		   bothTime = $scope.picktime.split(" - ");
		   $scope.begin = bothTime[0],$scope.end = bothTime[1];
		   if($scope.checktime($scope.begin , $scope.end )){alert("导出数据最大时间范围为1年！");return;}
			$.ajax({type: "POST",traditional:true, url:"i/history/expHistoryData", data:{ rdcid:$scope.rdcid,uid:user.id,filename:"历史数据",title:$scope.slgptit,type:$scope.typemode.type[$scope.sl_index],oids:$scope.oids,onames:$scope.oldnames,key:$scope.typemode.key[$scope.sl_index], startTime:$scope.begin,endTime:$scope.end},success: function(data) {
		            if(data.success){
		            	$scope.createForm(data.entity.exqip,data.entity.className,data.entity.methodName);//id:vo.id,ip:vo.exqip,port:vo.className
		            }else{
		            	alert(data.message);
		            }
		     }});
			setTimeout($scope.getUserTask,500);
			setTimeout(function(){
				$("#but_expdata").attr("disabled",false);
			},3000);
		}else{
			 alert("没有设置查询对象！");
		}
   };



	//********************************************************************事件START**********************************************************************
	$scope.checktime=function(startDate,endDate){
		var catime =new Date(endDate).getTime()-new Date(startDate).getTime();  
	    return catime >31967999000; 
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
	  $scope.getUserTask();
	  
	  $scope.createForm=function(ip,port,fileName){
		   var expfrom= $("<form>").attr('style', 'display:none').attr('method', 'post').attr('action', 'http://'+ip+':'+port+'/i/history/downloadFile').attr('id', "expdataform");
	       expfrom.attr("Content-Type","application/json;charset=UTF-8");
	       expfrom.append($("<input>").attr("name","fileName").attr("value",fileName));
	       expfrom.appendTo('body').submit().remove();
	   };
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
