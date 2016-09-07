coldWeb.controller('historyData', function ($scope, $http,$rootScope,baseTools) {
	clearInterval($rootScope.timeTicket);
	var rdcid= window.sessionStorage.getItem("360rdcId");//缓存rdcid
	$http.get("/i/historySearch/findStorageKeysByFilter",{params:{'rdcId':rdcid,types:'1,2'}}).success(function(data){$scope.keylist = data.key;$scope.keydata = data.keydata;});
	$scope.getDateTimeStringBefore = function(before){ return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,''); };
	$scope.begin = $scope.getDateTimeStringBefore(3);
	$scope.end = $scope.getDateTimeStringBefore(0);
	$scope.oidlist=[],$scope.sltit="",$scope.mkey=null;
	$scope.picktime = $scope.begin + ' - ' + $scope.end;
	$('#reservationtime').daterangepicker({timePicker: true, timePickerIncrement: 1, format: 'YYYY-MM-DD HH:mm:ss'});
	$scope.selkeyvl=function($event){
		var em=$($event.target); if(em.hasClass("select")){em.removeClass("select"); }else{ em.addClass("select");}
	};
	$scope.showkeyli=function(key){
		$("#ul_key_list li").removeClass("select");$("#li_key_"+key).addClass("select");$("#val_list_div ul").addClass("hide");$("#"+key+"_ul_val").removeClass("hide");
	};
	$scope.slgroupsl=function(e){//点击下拉框事件
		if($("#ul_key_list li.select").length==0){  var slkeyem=$("#ul_key_list li").first();$("#"+slkeyem.attr("value")+"_ul_val").removeClass("hide"); slkeyem.addClass("select");;}
		$scope.showobjgroup=true;
	};
	$scope.expdata=function(){//导出数据
//	     if ($("#but_expdata").data('isLoading') === true) return; $("#but_expdata").text('导出中。。。').data('isLoading',true);   $("#but_expdata").delay(1000000000).data('isLoading',false).text("导出11");
	        var expfrom= $("<form>").attr('style', 'display:none').attr('target', '').attr('method', 'post').attr('action', 'i/historySearch/expHistoryData').attr('id', "expdataform");
	        expfrom.append($("<input>").attr("name","rdcid").attr("value",rdcid));
	        expfrom.append($("<input>").attr("name","filename").attr("value","导出历史数据"));
	        expfrom.appendTo('body').submit().remove();
   };
   $scope.gettit=function(){
	   var keem=$("#ul_key_list li.select");
	   var key=keem.attr("value");
	   var lilist= $("#"+key+"_ul_val li.select");
	   $scope.oidlist=[];var text=[];
	   $.each(lilist, function(index, item) {
		   $scope.oidlist.push(item.attributes.value.nodeValue); text.push( item.textContent);
	    });
	   $scope.sltit=keem.text()+ "-"+ (text.join(" "));;
	};

	/**
	 * 搜索数据
	 */
	$scope.search = function(){
		var selected = $scope.item.option;
		if(selected){
			console.log(selected.keyDesc);
			bothTime = $scope.picktime.split(" - ");
			$scope.begin = bothTime[0];
			$scope.end = bothTime[1];
			$http.get("i/baseInfo/getKeyValueDataByTime",{
				params:{
					type:selected.type,
					oid:selected.oid,
					key:selected.key,
					startTime:$scope.begin,
					endTime:$scope.end  
				}
			}).then(function(response){
				var listData = response.data;
				var xData=[],data=[];
				angular.forEach(listData,function(item){
					xData.unshift(baseTools.formatTime(item.addtime));
					data.unshift(item.value);
				});
				$scope.drawDataLine(xData,data);
			});
		}
	};
	$scope.drawDataLine = function(xData,data){
		var lineChart = echarts.init($('#data-chart')[0]);
		xData = xData.length > 0? xData : [1,2,3,4];
		data = data.length > 0 ? data : [34,35,34,21];
		var dataView = {show: true, readOnly: true, textareaColor:'#fff'};
		option = {
				calculable : true,
			    tooltip : {trigger: 'axis' },
			    legend: {  data:[$scope.item.option.keyDesc]},
			    xAxis : [ { type : 'category',data : xData} ],
			    yAxis : [{ type : 'value', name : $scope.item.option.unit,axisLabel : {formatter: '{value}'}} ],
			    series : [ { name:$scope.item.option.keyDesc, type:'line', data:data }]
			 };
		lineChart.setOption(option);
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
});
