$(function() {
	$(".electric,.opendoor").hide();
	$("#temperature").click(function(){
		$(this).addClass('current').siblings().removeClass('current');
		$('.temperature').show();
		$(".electric,.opendoor").hide();
	})
	$("#electric").click(function(){
		$(this).addClass('current').siblings().removeClass('current');
		$('.electric').show();
		$(".temperature,.opendoor").hide();
	})
	$("#opendoor").click(function(){
		$(this).addClass('current').siblings().removeClass('current');
		$('.opendoor').show();
		$(".electric,.temperature").hide();
	})
	/*$('.toggle').children('div').click(function(value){
		$(this).addClass('current').siblings().removeClass('current');
		if(value=='electric'){
			$(this).show()
		}else if(value=="opendoor"){
			$(this).show()
		}else{
			
		}
	})*/
	//图标js
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('main1'));
	
	var dataAll = [
	    [
	        [10.0, 8.04],
	        [8.0, 6.95],
	        [13.0, 7.58],
	        [9.0, 8.81],
	        [11.0, 8.33],
	        [14.0, 9.96],
	        [6.0, 7.24],
	        [4.0, 4.26],
	        [12.0, 10.84],
	        [7.0, 4.82],
	        [5.0, 5.68]
	    ]
	];
	
	var markLineOpt = {
	    animation: false,
	    label: {
	        normal: {
	            formatter: 'y = 0.5 * x + 3',
	            textStyle: {
	                align: 'right'
	            }
	        }
	    },
	    lineStyle: {
	        normal: {
	            type: 'solid'
	        }
	    },
	    tooltip: {
	        formatter: 'y = 0.5 * x + 3'
	    },
	    data: [[{
	        coord: [0, 3],
	        symbol: 'none'
	    }, {
	        coord: [20, 13],
	        symbol: 'none'
	    }]]
	};
	
	option = {
	    title: {
	        text: '冷库历史温度',
	        x: 'left',
	        y: 0
	    },
	    grid: [
	        {x: '7%', y: '7%', width: '90%', height: '80%'}
	    ],
	    tooltip: {
	        formatter: 'Group {a}: ({c})'
	    },
	    xAxis: [
	        {gridIndex: 0, min: 0, max: 20}
	    ],
	    yAxis: [
	        {gridIndex: 0, min: 0, max: 15}
	    ],
	    series: [
	        {
	            name: 'I',
	            type: 'scatter',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            data: dataAll[0],
	            markLine: markLineOpt
	        }
	    ]
	};
	
	var myChart = echarts.init(document.getElementById('main2'));
	var dataAll = [
	    [
	        [10.0, 8.04],
	        [8.0, 6.95],
	        [13.0, 7.58],
	        [9.0, 8.81],
	        [11.0, 8.33],
	        [14.0, 9.96],
	        [6.0, 7.24],
	        [4.0, 4.26],
	        [12.0, 10.84],
	        [7.0, 4.82],
	        [5.0, 5.68]
	    ]
	];
	
	var markLineOpt = {
	    animation: false,
	    label: {
	        normal: {
	            formatter: 'y = 0.5 * x + 3',
	            textStyle: {
	                align: 'right'
	            }
	        }
	    },
	    lineStyle: {
	        normal: {
	            type: 'solid'
	        }
	    },
	    tooltip: {
	        formatter: 'y = 0.5 * x + 3'
	    },
	    data: [[{
	        coord: [0, 3],
	        symbol: 'none'
	    }, {
	        coord: [20, 13],
	        symbol: 'none'
	    }]]
	};
	
	option = {
	    title: {
	        text: 'RDC电量监控',
	        x: 'left',
	        y: 0
	    },
	    grid: [
	        {x: '7%', y: '7%', width: '90%', height: '80%'}
	    ],
	    tooltip: {
	        formatter: 'Group {a}: ({c})'
	    },
	    xAxis: [
	        {gridIndex: 0, min: 0, max: 20}
	    ],
	    yAxis: [
	        {gridIndex: 0, min: 0, max: 15}
	    ],
	    series: [
	        {
	            name: 'I',
	            type: 'scatter',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            data: dataAll[0],
	            markLine: markLineOpt
	        }
	    ]
	};
	var myChart = echarts.init(document.getElementById('main3'));
	var dataAll = [
	    [
	        [10.0, 8.04],
	        [8.0, 6.95],
	        [13.0, 7.58],
	        [9.0, 8.81],
	        [11.0, 8.33],
	        [14.0, 9.96],
	        [6.0, 7.24],
	        [4.0, 4.26],
	        [12.0, 10.84],
	        [7.0, 4.82],
	        [5.0, 5.68]
	    ]
	];
	
	var markLineOpt = {
	    animation: false,
	    label: {
	        normal: {
	            formatter: 'y = 0.5 * x + 3',
	            textStyle: {
	                align: 'right'
	            }
	        }
	    },
	    lineStyle: {
	        normal: {
	            type: 'solid'
	        }
	    },
	    tooltip: {
	        formatter: 'y = 0.5 * x + 3'
	    },
	    data: [[{
	        coord: [0, 3],
	        symbol: 'none'
	    }, {
	        coord: [20, 13],
	        symbol: 'none'
	    }]]
	};
	
	option = {
	    title: {
	        text: '冷库门开关监控',
	        x: 'left',
	        y: 0
	    },
	    grid: [
	        {x: '7%', y: '7%', width: '90%', height: '80%'}
	    ],
	    tooltip: {
	        formatter: 'Group {a}: ({c})'
	    },
	    xAxis: [
	        {gridIndex: 0, min: 0, max: 20}
	    ],
	    yAxis: [
	        {gridIndex: 0, min: 0, max: 15}
	    ],
	    series: [
	        {
	            name: 'I',
	            type: 'scatter',
	            xAxisIndex: 0,
	            yAxisIndex: 0,
	            data: dataAll[0],
	            markLine: markLineOpt
	        }
	    ]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
});

