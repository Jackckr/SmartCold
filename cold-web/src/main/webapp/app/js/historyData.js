coldWeb.controller('historyData', function ($scope, $http,$rootScope) {
	clearInterval($rootScope.timeTicket);
	var lineChart =null;
	var rdcid=window.sessionStorage.smrdcId;//
	$http.get("/i/historySearch/findStorageKeysByFilter",{params:{'rdcId':rdcid,types:'1,2'}}).success(function(data){$scope.keylist = data.key;$scope.keydata = data.keydata;});
	$scope.getDateTimeStringBefore = function(before){ return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,''); };
	$scope.begin = $scope.getDateTimeStringBefore(3);
	$scope.end = $scope.getDateTimeStringBefore(0);
	$scope.picktime = $scope.begin + ' - ' + $scope.end; 
	$scope.oidlist=[],$scope.sltit="",$scope.sl_type=null,$scope.sl_key=null,$scope.oldnames=null,$scope.slgptit="";
	$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
	$scope.selkeyvl=function($event){
		var em=$($event.target); if(em.hasClass("select")){em.removeClass("select"); }else{ em.addClass("select");}
	};
	$scope.showkeyli=function(key){
		$("#ul_key_list li").removeClass("select");$("#li_key_"+key).addClass("select");$("#val_list_div ul").addClass("hide");$("#"+key+"_ul_val").removeClass("hide");
	};
	$scope.slgroupsl=function(e){//点击下拉框事件
		if($("#ul_key_list li.select").length==0){  var slkeyem=$("#ul_key_list li").first();$("#"+slkeyem.attr("value")+"_ul_val").removeClass("hide"); slkeyem.addClass("select");;}
		$scope.showobjgroup=!$scope.showobjgroup;
	};
	$scope.initData=function(){//初始化数据
		if($("#ul_key_list li.select").length==0){  var slkeyem=$("#ul_key_list li").first();$("#"+slkeyem.attr("value")+"_ul_val").removeClass("hide"); slkeyem.addClass("select");;}
		$scope.gettit();
	};
	$scope.expdata=function(){//导出数据
//	     if ($("#but_expdata").data('isLoading') === true) return; $("#but_expdata").text('导出中。。。').data('isLoading',true);   $("#but_expdata").delay(1000000000).data('isLoading',false).text("导出11");
		if($scope.sl_type&&$scope.sl_key&&$scope.oidlist&&$scope.oidlist.length>0){
			
	        var expfrom= $("<form>").attr('style', 'display:none').attr('method', 'post').attr('action', 'i/baseInfo/expHistoryData').attr('id', "expdataform");
//	        expfrom.attr("accept-charset","UTF-8");//.attr("onsubmit","document.charset='utf-8'");
//	        expfrom.attr("charset","UTF-8");//.attr("onsubmit","document.charset='utf-8'");
	        expfrom.attr("Content-Type","application/json;charset=UTF-8");//.attr("onsubmit","document.charset='utf-8'");
	        expfrom.append($("<input>").attr("name","rdcid").attr("value",rdcid));
	        expfrom.append($("<input>").attr("name","filename").attr("value","历史数据"));
	        expfrom.append($("<input>").attr("name","title").attr("value",$scope.slgptit));
	        expfrom.append($("<input>").attr("name","type").attr("value",$scope.sl_type));
	        expfrom.append($("<input>").attr("name","oids").attr("value",$scope.oidlist));
	        expfrom.append($("<input>").attr("name","onames").attr("value",$scope.oldnames));
	        expfrom.append($("<input>").attr("name","key").attr("value",$scope.sl_key));
	        expfrom.append($("<input>").attr("name","startTime").attr("value",$scope.begin));
	        expfrom.append($("<input>").attr("name","endTime").attr("value",$scope.end));
	        expfrom.appendTo('body').submit();
	        //.remove();
		}else{
			 alert("没有设置查询对象！");
		}
   };
   $scope.gettit=function(){
	   var keem=$("#ul_key_list li.select");
	   var key=keem.attr("value");
	   var vlem= $("#"+key+"_ul_val");
	   $scope.sl_type=vlem.attr("sl_type"),$scope.sl_key=vlem.attr("sl_key");
	   $scope.sl_unit=vlem.attr("sl_unit")?vlem.attr("sl_unit"):"";
	   var lilist= $("#"+key+"_ul_val li.select");
	   $scope.oidlist=[];$scope.oldnames=[];
	   $.each(lilist, function(index, item) { $scope.oidlist.push(item.attributes.value.nodeValue); $scope.oldnames.push( item.textContent); });
	   $scope.slgptit=keem.text();
	   $scope.sltit=$scope.slgptit+ "-"+ ($scope.oldnames.join(" "));;
	};

	/**
	 * 搜索数据
	 */
	$scope.search = function(){
		if(lineChart==null){ lineChart = echarts.init($('#data-chart')[0]);}
		if($scope.sl_type&&$scope.sl_key&&$scope.oidlist&&$scope.oidlist.length>0){
			lineChart.showLoading({text: '数据加载中。。。。' }); 
			lineChart.clear(); 
			bothTime = $scope.picktime.split(" - ");
			$scope.begin = bothTime[0],$scope.end = bothTime[1];
			$.ajax({
                type: "POST",
                url:"i/baseInfo/getKeyValueDataByFilter",traditional:true,
                data:{type:$scope.sl_type,oids:$scope.oidlist,onames: $scope.oldnames,key:$scope.sl_key,startTime:$scope.begin,endTime:$scope.end},//
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
		xData=chardata.xdata,ydata=chardata.ydata;
		xData = xData.length > 0? xData : [1,2,3,4];
		ydata = ydata.length > 0 ? ydata : [ { name:$scope.slgptit, type:'line', data:[34,35,34,21] }] ;
		var dataView = {show: true, readOnly: true, textareaColor:'#fff'};
		option = {
				calculable : true,
				title: {text: $scope.slgptit},
			    tooltip : {trigger: 'axis' },
			    legend: {  data:[$scope.slgptit]},
			    xAxis : [ { type : 'category',data : xData} ],
			    yAxis : [{ type : 'value', name :$scope.sl_unit,axisLabel : {formatter: '{value}'}} ],
			    series : ydata,
			    toolbox: {show: true,feature: {dataZoom: {yAxisIndex: 'none'},dataView: {readOnly: false},magicType: {type: ['line', 'bar']},restore: {},saveAsImage: {}} }
			 };
		lineChart.setOption(option);
		lineChart.hideLoading();  
	};
	$(document).bind('click',function(e){ 
		if($scope.showobjgroup){
			var e = e || window.event; //浏览器兼容性 
			var elem = e.target || e.srcElement; 
			while (elem) { //循环判断至跟节点，防止点击的是div子元素 
			if (elem.id && elem.id=='filter_sl_div') { 
			   return; 
			 } 
			 elem = elem.parentNode; 
			}
			$scope.$apply(function () {
				$scope.gettit();
				$scope.showobjgroup=false;
			});
		}
	});
//	$scope.initData();
});
