/**
 * Created by sunqiunian on 16/3/3.
 */
coldWeb.controller('coldStorageInOutGoods', function ($scope, $location, $stateParams, $http) {
    console.log($stateParams.storageID);

    $scope.load = function () {

        // 冷库的进货量、发货量、温度
        var barChart = echarts.init($("#barChart").get(0));
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
                data:['进货量','发货量','平均温度']
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00',
                        '11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00',
                        '21:00','22:00','23:00','24:00']
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
                    name:'进货量',
                    type:'bar',
                    data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name:'发货量',
                    type:'bar',
                    data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3, 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name:'平均温度',
                    type:'line',
                    yAxisIndex: 1,
                    data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };
        barChart.setOption(barOption);
    }
    $scope.load();
});
