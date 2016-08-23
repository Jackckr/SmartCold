/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageInOutGoods', function ($scope, $location, $stateParams, $http,baseTools,$rootScope,$timeout) {
    console.log($stateParams.storageID);

    $scope.drawInOutChart = function(storageId){
    	var barId = "#barChart" + storageId;
    	var barChart = echarts.init($(barId).get(0));
        var frozenIn = [];
        var frozenOut = [];
        var freshIn = [];
        var freshOut = [];
        var frozenTemp = [];
        var freshTemp = [];
        var time = [];
        url = "/i/other/findGoodsByDate?coldstorageId=" + storageId + 
        "&startCollectionTime=" + baseTools.getFormatTimeString(-10 * 24 * 60 * 60 * 1000) + "&endCollectionTime=" + baseTools.getFormatTimeString()  
        $http.get(url).success(function(data,status,config,header){
        	angular.forEach(data,function(item){
        		frozenIn.push(item.frozenInputQuantity);
        		frozenOut.push(item.forzenOutputQuantity);
        		freshIn.push(item.freshIutputQuantity);
        		freshOut.push(item.freshOutputQuantity);
        		frozenTemp.push(item.frozenInputTemperature);
        		freshTemp.push(item.freshInputTemperature);
        		time.push(baseTools.formatTime(item.collectionTime));
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
                    data:['冻品进货量','冻品发货量','鲜品进货量','鲜品发货量','冻品进货温度','鲜品进货温度']
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
                series : [
                    {
                        name:'冻品进货量',
                        type:'bar',
                        data:frozenIn
                    },
                    {
                        name:'冻品发货量',
                        type:'bar',
                        data:frozenOut
                    },
                    {
                        name:'鲜品进货量',
                        type:'bar',
                        data:freshIn
                    },
                    {
                        name:'鲜品发货量',
                        type:'bar',
                        data:freshOut
                    },
                    {
                        name:'冻品进货温度',
                        type:'line',
                        yAxisIndex: 1,
                        data:frozenTemp
                    },
                    {
                        name:'鲜品进货温度',
                        type:'line',
                        yAxisIndex: 1,
                        data:freshTemp
                    }
                ]
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
