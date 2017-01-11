/**
 * Created by maqiang34 on 16/10/18.
 * 分析报告-2.4-制冷系统分析
 */
coldWeb.controller('coolingAnalysis', function ($scope,  $stateParams, $http,$rootScope) {
	$scope.rdcid = $stateParams.rdcId;
	Highcharts.setOptions({  colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'] }); 
	$scope.initdata=function(){
		    $scope.rs_msg=undefined;
			$http.get('/i/AnalysisController/getCoolingAnalysis',{params: {rdcId:$scope.rdcid}} ).success(function(data,status,headers,config){
				if(data.success){
					$scope.createhech("#temperatureChart",data.entity);
				}else{
					$scope.rs_msg=data.message;
				}
			});
	};
    $scope.createhech=function(id,chardata){
    	$(id).highcharts({
            title: { text: '', x: -20 }, credits: {enabled: false },
            xAxis: { categories: chardata.xdata },
            yAxis: {title: { text: ''},plotLines: [{ value: 0, width: 1, color: '#808080' }]},
            legend: { layout: 'vertical', align: 'right',verticalAlign: 'middle',  borderWidth: 0},
            series: chardata.chdata });
      };
      $scope.initdata();
});

/**
 * 热量分析
 */
coldWeb.controller('hotAnalysis', function ($scope, $location, $http,$rootScope) {
	$scope.rdcid =$rootScope.rdcId;
	$scope.initdata=function(){
			$http.get('/i/AnalysisController/getQAnalysis',{params: {rdcId:$scope.rdcid}} ).success(function(data,status,headers,config){
				if(data.success){
					var quinisisdata=	data.entity.allseries;
					if(quinisisdata!=undefined){
						var nonedata=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
						if(quinisisdata.GoodsHeat==undefined){quinisisdata.GoodsHeat= nonedata;};
						if(quinisisdata.QFrost==undefined){quinisisdata.QFrost= nonedat;};
						if(quinisisdata.QForklift==undefined){quinisisdata.QForklift= nonedata;};
						if(quinisisdata.WallHeat==undefined){quinisisdata.WallHeat= nonedata;};
						if(quinisisdata.Qblower==undefined){quinisisdata.Qblower= nonedata;};
						if(quinisisdata.Qctdoor==undefined){quinisisdata.Qctdoor= nonedata;};
						if(quinisisdata.Qlighting==undefined){quinisisdata.Qlighting= nonedata;};
						var series=[],piedata=[], pxAxis=data.entity.xAxis;
						series.push({name:'Q货',data:quinisisdata.GoodsHeat})	;
						series.push({name:'Q霜',data:quinisisdata.QFrost})	;
						series.push({name:'Q叉',data:quinisisdata.QForklift})	;
						series.push({name:'Q保',data:quinisisdata.WallHeat})	;
						series.push({name:'Q风',data:quinisisdata.Qblower})	;
						series.push({name:'Q门',data:quinisisdata.Qctdoor})	;
						series.push({name:'Q照',data:quinisisdata.Qlighting})	;
						piedata.push(['Q货',quinisisdata.GoodsHeat[29]])	;
						piedata.push(['Q霜',quinisisdata.QFrost[29]])	;
						piedata.push(['Q叉',quinisisdata.QForklift[29]])	;
						piedata.push(['Q保',quinisisdata.WallHeat[29]])	;
						piedata.push(['Q风',quinisisdata.Qblower[29]])	;
						piedata.push(['Q门',quinisisdata.Qctdoor[29]])	;
						piedata.push(['Q照',quinisisdata.Qlighting[29]])	;
						data=undefined;quinisisdata=undefined;
						$scope.createhech(piedata,series,pxAxis);
					}
                }else{
                	alert(data.message);
                }
			});
	};
    $scope.createhech=function(piedata,pseries,pxAxis){
    	$('#hotPie').highcharts({
    		title  : { text : '最新热量分布图' },
    		credits: {  enabled: false },
    		legend : { itemDistance: 10 }, 
			chart  : { type : 'pie', options3d : { enabled : true, alpha : 45, beta : 0 } },
			tooltip: { pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>' },
			series : [ { type : 'pie', name : '占比', data : piedata } ],
			plotOptions : { pie : { depth : 40, showInLegend: true, dataLabels : { enabled : true, format : '{point.name}' } } }
		});
		$('#hotColumn').highcharts({
	        chart: {  type: 'column'  },
	        title: { text: '近30日热量分布图' },
			credits: {  enabled: false },
			yAxis: {  min: 0,  text: null },
			series: pseries,
			plotOptions: {  column: {  stacking: 'percent' } },
	        xAxis: {   labels: {  format: '{value} 日' },  categories: pxAxis },
	        tooltip: { shared: true,pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>'  }
	    });

    };
    $scope.initdata();
});