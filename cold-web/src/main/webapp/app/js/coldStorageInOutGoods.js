/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageInOutGoods', function ($scope, $location, $stateParams, $http,baseTools,$rootScope,$timeout) {
    console.log($stateParams.storageID);

    $scope.drawInOutChart = function(storageId){
    	$scope.showMap = {}
    	var barId = "#barChart" + storageId;
    	var barChart = echarts.init($(barId).get(0));
        var totalTime = 10
        var series = []
        var time = []
        var timeMap = {}
        var legend = []
        for(i=0; i< totalTime;i++){
        	xTime = baseTools.formatTimeToDay(baseTools.getFormatTimeString(0-i* 24 * 60 * 60 * 1000))
        	time.unshift(xTime)
        	timeMap[xTime] = totalTime - i - 1
        }
        startDate = baseTools.formatTimeToDay(baseTools.getFormatTimeString(-10 * 24 * 60 * 60 * 1000))
        endDate = baseTools.getFormatTimeString()
        url = "/i/other/findGoodsByDate?coldstorageId=" + storageId + 
        "&startCollectionTime=" + startDate + "&endCollectionTime=" +  endDate
        $http.get(url).success(function(data,status,config,header){
        	$scope.showMap[barId] = Object.keys(data).length
        	angular.forEach(data,function(yData,key){
        		outData = {name:key+'出货量',type:'bar',data:new Array(totalTime+1).join("-").split("")}
        		inData = {name:key+'进货量',type:'bar',data:new Array(totalTime+1).join("-").split("")}
        		inTemp = {name:key+'进货温度',type:'line',yAxisIndex: 1,data:new Array(totalTime+1).join("-").split("")}
        		legend.push(key+'出货量',key+'进货量',key+'进货温度')
        		angular.forEach(yData,function(item){
        			outData.data[timeMap[baseTools.formatTimeToDay(item.date)]] = item['outputQUantity']
        			inData.data[timeMap[baseTools.formatTimeToDay(item.date)]] = item['inputQuantity']
        			inTemp.data[timeMap[baseTools.formatTimeToDay(item.date)]] = item['inputTemperature']
        		})
        		series.push(outData,inData,inTemp)
        	})
        	barOption = {
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                legend: {
                    data:legend
                },
                xAxis : [
                    {
                        type : 'category',
                        data : time
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : '货物量',
                        axisLabel : {
                            formatter: '{value} kg'
                        }
                    },
                    {
                        type : 'value',
                        name : '温度',
                        axisLabel : {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series : series
            };
            barChart.setOption(barOption);
        })
    }
    
    $scope.load = function () {
        // 冷库的进货量、发货量、温度
    $timeout(function(){    	
    	angular.forEach($rootScope.mystorages,function(storage){
    		$scope.drawInOutChart(storage.id);
    	})
    },0)
    }
    $scope.load();
});
