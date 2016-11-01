
/**
 * Created by maqiang34 on 16/10/18.
 * 月分析报表
 */
coldWeb.controller('monthReport', function( $scope, $rootScope,$stateParams,$http ,$timeout,baseTools) {
	$scope.rdcId = $stateParams.rdcId;
	var firstDate = new Date(); firstDate.setMonth(firstDate.getMonth()-1); firstDate.setDate(1);firstDate.setHours(0);firstDate.setMinutes(0);firstDate.setSeconds(0);//设置上月的第一天
	var endDate = new Date(firstDate); endDate.setMonth(firstDate.getMonth()+1); endDate.setDate(0);endDate.setHours(23);endDate.setMinutes(59);endDate.setSeconds(59);//设置上月的最后一天
	$scope.endTime=baseTools.formatTime(endDate); $scope.startTime= baseTools.formatTime(firstDate);
	
	//1 $("#loding").show();
	//系统评分
	$scope.pysical=function(){
		$http.get('/i/physicalController/mothCheckup',{params: {"rdcId":$scope.rdcId } }).success(function(data,status,config,header){ if(data.success){ 
			$scope.pysicaldata=data.entity;
		}});
	};
	//2.超温时长
	
	$scope.overTemperature = function(){
		function getMsg(avgval){
			if(avgval<=75){
				return "优良";
			}else if(avgval<=120){
				return "一般";
			}else  if(avgval<=150){
				return "较差";
			}else{
				return "不理想";
			}
			//{{obj.name}}平均日超温时长{{obj.}}min，温控优良
		}
		$http.get('/i/coldStorage/findAnalysisByRdcidKeysDate',{ params: { "startTime":$scope.startTime, "endTime": $scope.endTime,  "rdcid": $scope.rdcId,  'keys':'ChaoWenShiJian' }}).success(function(data,status,config,header){
			if(data!=null){
				var ldata=[],seriesdata=[],maxxdata=0,xydata=null,xData = [];$scope.resoverTempe=[];
//				<p>变温库  平均日超温时长68min，温控优良</p>
				angular.forEach(data,function(storage,name){
					   var yData = [],sumval=0; ldata.push(name);
					   if(storage['ChaoWenShiJian'].length>maxxdata){ maxxdata=storage['ChaoWenShiJian'].length; xydata=storage['ChaoWenShiJian'];  };
					    angular.forEach(storage['ChaoWenShiJian'],function(item){  var val=item['value'] / 60;  yData.unshift(val); sumval+=val;  });
					    if(sumval>0){
					    	var avg=(sumval/storage['ChaoWenShiJian'].length).toFixed(2);
					    	$scope.resoverTempe.push({name :name,avgval:avg,msg:name+" 平均日超温时长"+avg+"min,温控"+getMsg(avg)}); }
					    seriesdata.push({name : name,type : 'line',data : yData, markLine: { data: [  {type: 'average', name: '平均值'}]}});
				});
				angular.forEach(xydata,function(item){  xData.unshift(baseTools.formatTime(item['date']).split(" ")[0]); });
				var myChart1 = echarts.init(document.getElementById('tempertureId'));
				var option1 = {
					title : { text : '超温时长(min/day)', x : 'center', y : 20 },
					tooltip : { trigger : 'axis' },
					grid : { y2 : 110, width : '80%' },
					legend : { data : ldata, y : 'bottom' },
					xAxis : [ { type : 'category',  
			            splitLine:{ show:false    }, 
						axisLabel : {rotate : '60',interval : 0},
						data :xData
					} ],
					yAxis : [ { type : 'value', axisLabel : { formatter : '{value}' } } ],
					series : seriesdata
				};
				myChart1.setOption(option1);
			}
		});
	};
	
	$scope.pysical();//冷库体检信息
	$scope.overTemperature();//超温时长	
	
	
    myChart2 = echarts.init(document.getElementById('cwyzId')),
    myChart3 = echarts.init(document.getElementById('bwyzId')),
    myChart4 = echarts.init(document.getElementById('openDoorTimesId')),
    myChart5 = echarts.init(document.getElementById('singleOpenDoorId')),
    myChart6 = echarts.init(document.getElementById('goodsId')),
    myChart7 = echarts.init(document.getElementById('ysjRunningTimeId')),
    myChart8 = echarts.init(document.getElementById('onOffCycleId')),
    myChart9 = echarts.init(document.getElementById('hotId')),
    myChart10 = echarts.init(document.getElementById('electricId')),
    myChart11 = echarts.init(document.getElementById('waterId')),
    myChart12 = echarts.init(document.getElementById('energyEfficiencyId'));

	var option2 = {
		title : {
			text : '超温因子(ε)',
			x : 'center',
			y : 20
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ '低温库', '变温库' ],
			y : 'bottom'
		},
		xAxis : [ {
			type : 'category',  
            splitLine:{  
                show:false  
            }, 
			axisLabel : {
				rotate : '60',
				interval : 0
			},
			data : [ '2016-10-01', '2016-10-02', '2016-10-03', '2016-10-04',
					'2016-10-05', '2016-10-06', '2016-10-07', '2016-10-08',
					'2016-10-09', '2016-10-10', '2016-10-11', '2016-10-12',
					'2016-10-13', '2016-10-14', '2016-10-15', '2016-10-16',
					'2016-10-17', '2016-10-18', '2016-10-19', '2016-10-20',
					'2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24',
					'2016-10-25', '2016-10-26', '2016-10-27', '2016-10-28',
					'2016-10-29', '2016-10-30', '2016-10-31' ]
		} ],
		grid : {
			y2 : 110,
			width : '80%'
		},
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : [
				{
					name : '低温库',
					type : 'line',
					data : [ 13, 11, 12, 11, 15, 18, 10, 11, 15, 13, 11, 13,
							16, 11, 15, 13, 17, 13, 8, 11, 15, 13, 11, 13, 10,
							6, 15, 13, 16, 13, 18 ],
				},
				{
					name : '变温库',
					type : 'line',
					data : [ 12, 13, 14, 12, 23, 10, 11, 15, 13, 19, 13, 10,
							11, 15, 13, 12, 13, 18, 11, 15, 13, 12, 13, 13, 60,
							15, 11, 12, 52, 20, 10 ],
				} ]
	};
	var option3 = {
		title : {
			text : '保温因子(τ)',
			x : 'center',
			y : 20
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ '预冷间', '冰鲜库' ],
			y : 'bottom'
		},
		xAxis : [ {
			type : 'category',  
            splitLine:{  
                show:false  
            }, 
			axisLabel : {
				rotate : '60',
				interval : 0
			},
			data : [ '2016-10-01', '2016-10-02', '2016-10-03', '2016-10-04',
					'2016-10-05', '2016-10-06', '2016-10-07', '2016-10-08',
					'2016-10-09', '2016-10-10', '2016-10-11', '2016-10-12',
					'2016-10-13', '2016-10-14', '2016-10-15', '2016-10-16',
					'2016-10-17', '2016-10-18', '2016-10-19', '2016-10-20',
					'2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24',
					'2016-10-25', '2016-10-26', '2016-10-27', '2016-10-28',
					'2016-10-29', '2016-10-30', '2016-10-31' ]
		} ],
		grid : {
			y2 : 110,
			width : '80%'
		},
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : [
				{
					name : '预冷间',
					type : 'line',
					data : [ 0.11, 0.16, 0.15, 0.13, 0.12, 0.13, 0.10, 0.11,
							0.15, 0.13, 0.19, 0.13, 0.10, 0.11, 0.15, 0.13,
							0.12, 0.13, 0.08, 0.11, 0.15, 0.13, 0.12, 0.13,
							0.10, 0.06, 0.15, 0.13, 0.12, 0.13, 0.10 ],
				},
				{
					name : '冰鲜库',
					type : 'line',
					data : [ 0.16, 0.15, 0.13, 0.12, 0.13, 0.10, 0.11, 0.15,
							0.13, 0.19, 0.16, 0.15, 0.13, 0.12, 0.13, 0.10,
							0.11, 0.15, 0.13, 0.19, 0.16, 0.15, 0.13, 0.12,
							0.13, 0.10, 0.11, 0.15, 0.13, 0.19, 0.23 ],
				} ]
	};
	var option4 = {
		title : {
			text : '日开门次数',
			x : 'center',
			y : 20
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ '低温库-门1', '变温库-门2' ],
			y : 'bottom'
		},
		xAxis : [ {
			type : 'category',  
            splitLine:{  
                show:false  
            }, 
			axisLabel : {
				rotate : '60',
				interval : 0
			},
			data : [ '2016-10-01', '2016-10-02', '2016-10-03', '2016-10-04',
					'2016-10-05', '2016-10-06', '2016-10-07', '2016-10-08',
					'2016-10-09', '2016-10-10', '2016-10-11', '2016-10-12',
					'2016-10-13', '2016-10-14', '2016-10-15', '2016-10-16',
					'2016-10-17', '2016-10-18', '2016-10-19', '2016-10-20',
					'2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24',
					'2016-10-25', '2016-10-26', '2016-10-27', '2016-10-28',
					'2016-10-29', '2016-10-30', '2016-10-31' ]
		} ],
		grid : {
			y2 : 110,
			width : '80%'
		},
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : [
				{
					name : '低温库-门1',
					type : 'line',
					data : [ 011, 016, 015, 013, 012, 013, 010, 011, 015, 013,
							019, 013, 010, 011, 015, 013, 012, 013, 008, 011,
							015, 013, 012, 013, 010, 006, 015, 013, 012, 013,
							010 ],
				},
				{
					name : '变温库-门2',
					type : 'line',
					data : [ 016, 015, 013, 012, 013, 010, 011, 015, 013, 019,
							016, 015, 013, 012, 013, 010, 011, 015, 013, 019,
							016, 015, 013, 012, 013, 010, 011, 015, 013, 019,
							023 ],
				} ]
	};
	var option5 = {
		title : {
			text : '单次开门时长',
			x : 'center',
			y : 20
		},
		tooltip : {
			trigger : 'axis'
		},
		legend : {
			data : [ '低温库-门1', '变温库-门2' ],
			y : 'bottom'
		},
		xAxis : [ {
			type : 'category',  
            splitLine:{  
                show:false  
            }, 
			axisLabel : {
				rotate : '60',
				interval : 0
			},
			data : [ '2016-10-01', '2016-10-02', '2016-10-03', '2016-10-04',
					'2016-10-05', '2016-10-06', '2016-10-07', '2016-10-08',
					'2016-10-09', '2016-10-10', '2016-10-11', '2016-10-12',
					'2016-10-13', '2016-10-14', '2016-10-15', '2016-10-16',
					'2016-10-17', '2016-10-18', '2016-10-19', '2016-10-20',
					'2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24',
					'2016-10-25', '2016-10-26', '2016-10-27', '2016-10-28',
					'2016-10-29', '2016-10-30', '2016-10-31' ]
		} ],
		grid : {
			y2 : 110,
			width : '80%'
		},
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : [
				{
					name : '低温库-门1',
					type : 'line',
					data : [ 011, 016, 015, 013, 012, 013, 010, 011, 015, 013,
							019, 013, 010, 011, 015, 013, 012, 013, 008, 011,
							015, 013, 012, 013, 010, 006, 015, 013, 012, 013,
							010 ],
				},
				{
					name : '变温库-门2',
					type : 'line',
					data : [ 016, 015, 013, 012, 013, 010, 011, 015, 013, 019,
							016, 015, 013, 012, 013, 010, 011, 015, 013, 019,
							016, 015, 013, 012, 013, 010, 011, 015, 013, 019,
							023 ],
				} ]
	};
	var option6 = {
		title : {
			text : '货物因子',
			x : 'center',
			y : 20
		},
		tooltip : {
			trigger : 'axis'
		},
		xAxis : [ {
			type : 'category',  
            splitLine:{  
                show:false  
            }, 
			axisLabel : {
				rotate : '60',
				interval : 0
			},
			data : [ '2016-10-01', '2016-10-02', '2016-10-03', '2016-10-04',
					'2016-10-05', '2016-10-06', '2016-10-07', '2016-10-08',
					'2016-10-09', '2016-10-10', '2016-10-11', '2016-10-12',
					'2016-10-13', '2016-10-14', '2016-10-15', '2016-10-16',
					'2016-10-17', '2016-10-18', '2016-10-19', '2016-10-20',
					'2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24',
					'2016-10-25', '2016-10-26', '2016-10-27', '2016-10-28',
					'2016-10-29', '2016-10-30', '2016-10-31' ]
		} ],
		grid : {
			y2 : 110,
			width : '80%'
		},
		yAxis : [ {
			type : 'value',
			axisLabel : {
				formatter : '{value}'
			}
		} ],
		series : [ {
			name : '货物因子',
			type : 'bar',
			data : [ 016, 015, 013, 012, 013, 010, 011, 015, 013, 019, 016,
					015, 013, 012, 013, 010, 011, 015, 013, 019, 016, 015, 013,
					012, 013, 010, 011, 015, 013, 019, 023 ],
		} ]
	};
	var option7 = {
			title : {
				text : '压缩机运行时间',
				x : 'center',
				y : 20
			},
			tooltip : {
				trigger : 'axis'
			},
			xAxis : [ {
				type : 'category',
				name:'min', 
                splitLine:{  
                    show:false  
                }, 
				axisLabel : {
					interval : 0
				},
				data : [ '<5', '5-9', '10-19', '20-29','30-59', '60-119', '120-300', '>300']
			} ],
			grid : {
				x:40,
				y2 : 110,
				width : '80%'
			},
			yAxis : [ {
				name:'%',
				type : 'value',
				axisLabel : {
					formatter : '{value}'
				}
			} ],
			series : [ {
				name : '运行时间',
				type : 'bar',
				data : [ 68,40,10,15,9,2,1,1 ],
			} ]
		};
	var option8 = {
			title : {
				text : '设备的开关周期',
				x : 'center',
				y : 20
			},
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				data : [ '每天或现行小时的次数', '每小时最高次数' ],
				y : 'bottom'
			},
			xAxis : [ {
				type : 'category',  
                splitLine:{  
                    show:false  
                }, 
				axisLabel : {
					interval : 0,
					formatter:function(params){
						var newParamsName = "";// 最终拼接成的字符串
					    var paramsNameNumber = params.length;// 实际标签的个数
					    var provideNumber = 4;// 每行能显示的字的个数
					    var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
					    /**
					     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
					     */
					    // 条件等同于rowNumber>1
					    if (paramsNameNumber > provideNumber) {
					        /** 循环每一行,p表示行 */
					        for (var p = 0; p < rowNumber; p++) {
					            var tempStr = "";// 表示每一次截取的字符串
					            var start = p * provideNumber;// 开始截取的位置
					            var end = start + provideNumber;// 结束截取的位置
					            // 此处特殊处理最后一行的索引值
					            if (p == rowNumber - 1) {
					                // 最后一次不换行
					                tempStr = params.substring(start, paramsNameNumber);
					            } else {
					                // 每一次拼接字符串并换行
					                tempStr = params.substring(start, end) + "\n";
					            }
					            newParamsName += tempStr;// 最终拼成的字符串
					        }

					    } else {
					        // 将旧标签的值赋给新标签
					        newParamsName = params;
					    }
					    //将最终的字符串返回
					    return newParamsName
				    }
				},
				data : [ '已55分钟','已08小时55分钟','-1天','-2天','-3天','-4天','-5天','-6天' ]
			} ],
			grid : {
				x:'40',
				y2 : 110,
				width : '80%'
			},
			yAxis : [ {
				type : 'value',
				name:'次数',
				axisLabel : {
					formatter : '{value}'
				}
			} ],
			series : [ {
				name : '每天或现行小时的次数',
				type : 'bar',
				data : [ 0,0,255,125,110,130,110,90 ],
			}, {
				name : '每小时最高次数',
				type : 'bar',
				data : [ 0,0,10,15,10,8,7,12 ],
			} ]
		};
	var option9 = {
			title : {
		        text: '月平均热量分布',
		        x:'center',
				y : 20
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	y: 'bottom',
		        data:['冷风机风扇','保温','开门','照明','叉车','货物','化霜']
		    },
		    series : [
		        {
		            type:'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:[
		                {value:15, name:'冷风机风扇'},
		                {value:10, name:'保温'},
		                {value:6.9, name:'开门'},
		                {value:8.5, name:'照明'},
		                {value:12.8, name:'叉车'},
		                {value:20, name:'货物'},
		                {value:26.8, name:'化霜'},
		            ]
		        }
		    ]
		};
	var option10 = {
			title : {
		        text: '月累计耗电占比',
		        x:'center',
				y : 20
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        y: 'bottom',
		        data:['电表1','电表2','电表3','电表4']
		    },
		    series : [
		        {
		            type:'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:[
		                {value:32149, name:'电表1'},
		                {value:1026, name:'电表2'},
		                {value:843, name:'电表3'},
		                {value:8492, name:'电表4'}
		            ]
		        }
		    ]
		};
	var option11 = {
			title : {
		        text: '月累计水耗占比',
		        x:'center',
				y : 20
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		    	y: 'bottom',
		        data:['机组1','机组2','机组3']
		    },
		    series : [
		        {
		            type:'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		            data:[
		                {value:162.8, name:'机组1'},
		                {value:2.7, name:'机组2'},
		                {value:0.0, name:'机组3'},
		            ]
		        }
		    ]
		};
	var option12 = {
			title : {
				text : '制冷系统运行效率趋势',
				x : 'center',
				y : 20
			},
			tooltip : {
				trigger : 'axis'
			},
			xAxis : [ {
				type : 'category',  
	            splitLine:{  
	                show:false  
	            }, 
				axisLabel : {
					rotate : '60',
					interval : 0
				},
				data : [ '2016-10-01', '2016-10-02', '2016-10-03', '2016-10-04',
						'2016-10-05', '2016-10-06', '2016-10-07', '2016-10-08',
						'2016-10-09', '2016-10-10', '2016-10-11', '2016-10-12',
						'2016-10-13', '2016-10-14', '2016-10-15', '2016-10-16',
						'2016-10-17', '2016-10-18', '2016-10-19', '2016-10-20',
						'2016-10-21', '2016-10-22', '2016-10-23', '2016-10-24',
						'2016-10-25', '2016-10-26', '2016-10-27', '2016-10-28',
						'2016-10-29', '2016-10-30', '2016-10-31' ]
			} ],
			grid : {
				y2 : 110,
				width : '80%'
			},
			yAxis : [ {
				type : 'value',
				axisLabel : {
					formatter : '{value}'
				}
			} ],
			series : [ {
				name : '系统效率',
				type : 'line',
				data : [ 0.16, 0.15, 0.13, 0.12, 0.13, 0.10, 0.11, 0.15,
							0.13, 0.19, 0.16, 0.15, 0.13, 0.12, 0.13, 0.10,
							0.11, 0.15, 0.13, 0.19, 0.16, 0.15, 0.13, 0.12,
							0.13, 0.10, 0.11, 0.15, 0.13, 0.19, 0.23],
			} ]
		};
	
	myChart2.setOption(option2);
	myChart3.setOption(option3);
	myChart4.setOption(option4);
	myChart5.setOption(option5);
	myChart6.setOption(option6);
	myChart7.setOption(option7);
	myChart8.setOption(option8);
	myChart9.setOption(option9);
	myChart10.setOption(option10);
	myChart11.setOption(option11);
	myChart12.setOption(option12);
      
	
	
  $scope.Preview=function(){ //打印预览
//		 $("#imgtest").html( myChart1.getImage('jpeg').outerHTML); 
         $("#rpt_asis_coment").printThis({ 
        	 importCSS: true,
        	 importStyle: true, 
        	 pageTitle: $scope.sltit,
        	 printContainer: true,  
        	 removeInline: false,
        	 formValues: true ,
        	 loadCSS: "../css/physical.css",
        	 });//  loadCSS: "/Content/Themes/Default/style.css",
   };
	
      
});
