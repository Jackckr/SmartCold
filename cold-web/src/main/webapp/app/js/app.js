
var user, coldWeb = angular.module('ColdWeb', ['ui.bootstrap', 'ui.router', 'ui.checkbox','ngSanitize','ui.select', 'ngCookies', 'xeditable','ngFileUpload','angucomplete-alt','angular-table', 'bsTable']);
angular.element(document).ready(function($ngCookies, $location,$rootScope,$http) {
	   $.ajax({url: '/i/user/findUser',type: "GET", dataType: 'json',cache: false}).success(function(data){user = data;
	    	if(user.username == null){
	    		var bakurl="login";
	    		if(localStorage.companyLoad){
	    			 bakurl="/"+JSON.parse(localStorage.companyLoad).login;
	    		}else{
	    			var host=location.host;
	    			if("www.rsdl-panasonic.cn"==host||"sx.cold360.cn"==host){
	    				 bakurl="sx";
	    			}else if("yl.cold360.cn"==host){
	    				 bakurl="yili";
	    			}
	    		}
	    		document.location.href= bakurl+".html";return;
	    	}
	    	angular.bootstrap(document, ['ColdWeb']);
	    });
});

coldWeb.run(function(editableOptions,userService) {
      userService.setUser(user);
	  userService.setStorage();
	  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});


coldWeb.factory('baseTools',['$rootScope',function(){
	return {
		getFormatTimeString: function(delta){
			delta = delta ? delta + 8 * 60 * 60 * 1000: 8 * 60 * 60 * 1000;
			return new Date(new Date().getTime() + delta).toISOString().replace("T", " ").replace(/\..*/,"");
		},
		formatTime: function(timeString){
			if (typeof(timeString) == "string"){	
				return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"");
			}else{
				return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/,"");
			}
		},
		formatTimeToMinute: function(timeString){
			return this.formatTime(timeString).substring(0,16);
		},
		formatTimeToHour: function(timeString){
			return this.formatTime(timeString).substring(0,13);
		},
		formatTimeToDay: function(timeString){
			return this.formatTime(timeString).substring(0,10);
		},
		
		defformatTime: function (date) { //author: meizz 
			var fmt=new Date(date);
		    return  [fmt.getFullYear(),"-"	, fmt.getMonth( )+ 1, "-", fmt.getDate(), " ",fmt.getHours(), ":", fmt.getMinutes(),":",  fmt.getSeconds()  ].join("");
		},
		getEchartSingleOption: function(title, xData, yData, yName, yUnit, lineName, type,yMin,yMax){
			min = max = yData.length > 0?yData[0]:0;
			angular.forEach(yData,function(item,index){
				yData[index] = yData[index].toFixed(2);
				min = Math.min(min,yData[index]);max = Math.max(max,yData[index]);
			});
			if(min>=0){	yMin=0;}else{yMin = max - min < 1 && type == 'line' ?min - 10:yMin;}
			option = {
				    tooltip : { trigger: 'axis' },
				    title: { text: title},
				    calculable : true,
				    xAxis : [ {type : 'category',  data : xData} ],
				    yAxis : [{ type : 'value', name : yName + "(" + yUnit + ")", min : yMin ? yMin : 'auto',max : yMax ? yMax : 'auto', minInterval : 1 } ],
				    series : [ { name:lineName,type: type,data:yData }]
				};
			return option;
		}
		
	};
}]);




coldWeb.factory('userService', ['$rootScope', '$state', '$http','$cookies',function ($rootScope, $state,$http,$cookies) {
    return {
        setUser: function (user) {
        	if(localStorage.appconfig){
        		$rootScope.appconfig=JSON.parse(localStorage.appconfig);
        		if(new Date().getDate()!=$rootScope.appconfig.day){
        			$rootScope.appconfig.alrd=false,$rootScope.appconfig.day=new Date().getDate();
        		}
        	}else{
        		$rootScope.appconfig={alrd:false,day:new Date().getDate()};
        		localStorage.appconfig=JSON.stringify($rootScope.appconfig);
        	}
        	$rootScope.companyLoad=JSON.parse(localStorage.companyLoad);
            $rootScope.todayTime=new Date();
            $rootScope.user = user, $rootScope.userType=$rootScope.user.type;
            $rootScope.logout = function () {
	        	 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/logout'}).success(function(data){});
	        	 $rootScope.user =window.user=user=undefined; 
	        	 window.sessionStorage.clear();
	        	// window.localStorage.clear();
                 window.location.href=$rootScope.companyLoad.login+".html";
	        };
        },
        setStorage: function () {
        	$rootScope.initAllByRdcId = function(rdcId){
        		     console.log("rdc:"+rdcId);
        		     $rootScope.rdcId = rdcId;
        		     window.sessionStorage.smrdcId=rdcId;//缓存rdcid
        		     if($rootScope.user.role==3){
        		    	 $rootScope.userrdcids=[$rootScope.vm.choserdc.id]; 
        		    	 window.sessionStorage.userrdcids=JSON.stringify($rootScope.userrdcids);
        		     }else{
        		    	 $rootScope.userrdcids=[];
    					 angular.forEach($rootScope.vm.allUserRdcs,function(obj,i){ 
    						 $rootScope.userrdcids.push(obj.id);
    					 });
    					 window.sessionStorage.userrdcids=JSON.stringify($rootScope.userrdcids);
        		     }
		        	 $http({method:'POST',url:'i/acl/getRUACL',params:{rdcid : $rootScope.rdcId,uid : $rootScope.user.id}}).success(function (data) {
		        			    $rootScope.aclml=data.aclml;
		        			    $rootScope.aclmap={};
					      		$("#lfmenu .quanxian").attr("disabled",true).removeClass("quanxian").removeClass("hide");
					      		angular.forEach(data.aclml,function(obj,i){ 
					      			$rootScope.aclmap[obj.id]=obj.acl;
					      			if(obj.acl){
//					      				if(!obj.hasnode){  
//					      					coldWeb.stateProvider.state(obj.controller,{url:obj.tourl,controller: obj.controller,  templateUrl: obj.templateUrl });//无法处理(本想动态创建coldWeb)
//					      				}
					      			}else{
					      				$("#lfmenu [mid=ml_acl"+obj.id+"]").addClass("quanxian");
					      				$("#lfmenu [mid=ml_acl"+obj.id+"] *").addClass("quanxian");
					      				$("#lfmenu [mid=ml_acl"+obj.id+"] *").attr("disabled",true); 
					      				if($rootScope.user.type!=0){$("#lfmenu [mid=ml_acl"+obj.id+"]").addClass("hide");}
					      			}
					      		});
					      		$("#lefaside").removeClass("hide");
		        	   });
		        	 
		        	 
		        	  $http({method:'POST',url:'i/messageRecord/getTallMsgByRdcId',params:{userId: $rootScope.user.id,type: $rootScope.user.type, rdcId: $rootScope.rdcId}}).success(function (data) {
		        		  $rootScope.messageList=data;
		        	  });
		              $http({method:'POST',url:'i/messageRecord/getMsgCountByRdcId',params:{userId: $rootScope.user.id,type: $rootScope.user.type, rdcId: $rootScope.rdcId}}).success(function (data) {
		            	  $rootScope.notReadMessage=data;
		              });

		        	 $http.get('/i/coldStorageSet/findStorageSetByUserId' ,{params: {rdcId:rdcId,userId:$rootScope.user.id,type:$rootScope.user.type}} ).success(function(data,status,headers,config){// 初始化冷库
		        		 $rootScope.Tempset=[];
		        		 $rootScope.mystorages = data;
		        		 $rootScope.storageModal = data[0];
		        	 });
		        	 $http.get('/i/coldStorageSet/findHasDoorStorageSetByRdcId?rdcID=' + rdcId).success(function(data){
		        			$rootScope.hasDoorStorages = data;
		        	 });
		        	 $http.get('/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(function(data,status,headers,config){// 初始化压缩机组
    					$rootScope.compressorGroups = data;
    					angular.forEach($rootScope.compressorGroups,function(item){	$http.get('/i/compressor/findBygroupId?groupId=' + item.id).success(function(data,status,headers,config){item.compressors = data;});});
		        	 });
	        		 $http.get('/i/power/findByRdcId?rdcId=' + rdcId).success( function(data,status,headers,config){ // 初始化电量
        				  $rootScope.powers = data;
        	         });
		        	
		             $http.get('/i/platformDoor/findByRdcId?rdcId=' + rdcId).success( function(data,status,headers,config){ //  初始化月台门
		            			 $rootScope.platformDoors = data;
		             });
		             $http.get('/i/AlarmController/getAlarmMsgByUser',{params:{  userId: $rootScope.user.id, role: $rootScope.user.role, rdcIds:$rootScope.userrdcids,isgetMsg:false} }).success( function(data,status,headers,config){ //  初始化月台门
		            	 $rootScope.alarm = data;
		            	 $rootScope.alarm.totl = data.CC+data.SC+data.TC;
		                 if($rootScope.alarm.totl>0){$("#div_errmsg").removeClass("hide");}
		             });
		             $http.get('/i/AlarmController/getAlarmMsgByUser',{params:{  userId: $rootScope.user.id, role: $rootScope.user.role, rdcIds:$rootScope.userrdcids,isgetMsg:false} }).success( function(data,status,headers,config){ //  初始化月台门
		            	 $rootScope.alarm = data;
		            	 $rootScope.alarm.totl = data.CC+data.SC+data.TC;
		                 if($rootScope.alarm.totl>0){$("#div_errmsg").removeClass("hide");}
		             });
		             
		             $state.go('preview');
        	};
        	$rootScope.changeRdc = function(value){
        		if(value){
        			if(value.originalObject == $rootScope.vm.choserdc){return;}
            		$rootScope.vm.choserdc = value.originalObject;
            		sessionStorage.cactrdcdata=JSON.stringify([$rootScope.vm.choserdc ]);
        		}
        		$rootScope.initAllByRdcId($rootScope.vm.choserdc.id);
        	};
        	
            if ($rootScope.user != null && $rootScope.user!='' && $rootScope.user!= undefined && $rootScope.user.id != 0){
            	if(window.sessionStorage.cactrdcdata&& window.sessionStorage.smrdcId){
            		var choserdc=null,  data=JSON.parse(window.sessionStorage.cactrdcdata);
            		if(data.length==1){
            			choserdc=data[0];
            		}else{
       				 angular.forEach(data,function(obj,i){ if(sessionStorage.smrdcId&& obj &&window.sessionStorage.smrdcId==obj.id){ choserdc=obj; }});
            		}
            		$rootScope.vm = {choserdc:choserdc,allUserRdcs:data};
    				$rootScope.userrdcids=JSON.parse(window.sessionStorage.userrdcids);
    				$rootScope.initAllByRdcId($rootScope.vm.choserdc.id);
            	}else{
            		$http.get('/i/rdc/findRDCsByUserid?userid=' + $rootScope.user.id).success(function(data,status,headers,config){
        				if(data.length == 0){document.location.href = "/notAudit.html";return;}
        				window.sessionStorage.cactrdcdata=JSON.stringify(data);
        				$rootScope.vm = {choserdc:data[0],allUserRdcs:data};
        				if($rootScope.user.role==3){
        					 $rootScope.userrdcids=[$rootScope.vm.choserdc.id];
        				}else{
        					$rootScope.userrdcids=[];
       					    angular.forEach($rootScope.vm.allUserRdcs,function(obj,i){ 
       					    	$rootScope.userrdcids.push(obj.id);
       					    });
        				}
        				window.sessionStorage.userrdcids=JSON.stringify($rootScope.userrdcids);
        				$rootScope.initAllByRdcId($rootScope.vm.choserdc.id);
        	       });
            	}
            }
            $rootScope.toMyCompressor = function (compressorID) {  $state.go('compressorPressure', {'compressorID': compressorID}); };
            $rootScope.toMyBlowers = function () { $state.go('compressorBlower', {'rdcId': $rootScope.rdcId}); };
            $rootScope.openColdDiv = function (){ $state.go('coldStorageDiv',{'storageID': $rootScope.rdcId}); };
            $rootScope.openLightDiv = function (){ $state.go('light',{'storageID': $rootScope.rdcId});};
//            $rootScope.openWarn = function (){$state.go('warn',{'rdcId': $rootScope.rdcId});};
            $rootScope.toRdcPower = function () { $state.go('rdcPower', {'rdcId': $rootScope.rdcId}); };
            $rootScope.toMyStorageTemper = function (storageID) {$state.go('coldStorageTemper', {'storageID': storageID});};
            $rootScope.toMyStorageDoor = function (storageID) {$state.go('coldStorageDoor', {'storageID': storageID});};
            $rootScope.tomaintenancealarm = function () {$state.go('maintenancealarm', {'st': 1});};
            $rootScope.tomaintenancehist = function () {$state.go('maintenancealarm', {'st':2});};
            $rootScope.toalarmTemp = function () {$state.go('alarmTemp');};
            $rootScope.updateconfig=function(){
            	$rootScope.appconfig.alrd=true;
            	$('#div_errmsg span:first').removeClass('ringBox');
            	localStorage.appconfig=JSON.stringify($rootScope.appconfig);
            };
            $rootScope.checkOldPassword=function () {
                $http({method:'POST',url:'/i/user/checkOldPassword',params:{token:$cookies.get("token"),pwd:$rootScope.oldPassword}}).success(function (data) {
                    $rootScope.oldPwdErr = !data;
                });
            };
            $rootScope.submitChangePwd=function () {
            	$rootScope.pwdRex=/^[0-9A-Za-z]{3,16}$/;
            	if($rootScope.oldPassword==undefined||$rootScope.newPassword==undefined||$rootScope.reNewPassword==undefined){
            		alert('密码不能为空哦~');
            		return false;
				}
            	if(!$rootScope.oldPwdErr){
                    $rootScope.pwdLengthErr=!$rootScope.pwdRex.test($rootScope.newPassword);
                    if (!$rootScope.pwdLengthErr){
                        $rootScope.pwdDiff=($rootScope.newPassword!=$rootScope.reNewPassword);
                    }
				}
				if($rootScope.pwdLengthErr||$rootScope.oldPwdErr||$rootScope.pwdDiff){return false;}
                $http({method:'POST',url:'/i/user/updateUser',params:{id:$rootScope.user.id,password:$rootScope.newPassword}}).success(function (data) {
                    if(data){alert("修改成功！");}else {alert("修改失败！");}
                    $('#editPassword').modal('hide');
                });
            };
        }
    };
}]);
coldWeb.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/preview");
    coldWeb.stateProvider=$stateProvider;
    //index
    $stateProvider
    .state('preview',{//0.预览
		url:'/preview',
		controller: 'preview',
	    templateUrl: 'app/template/preview.htm'
    }).state('cold360Physical',{//1.体检
		url:'/cold360Physical/{rdcId}',
		controller: 'cold360Physical',
	    templateUrl: 'app/template/cold360Physical.htm'
    })
     //==============================监控1===============================f
    .state('coldStorageTemper', {//1.1温度监控
        url: '/coldStorageTemper/:storageID',
        controller: 'coldStorageTemper',
        templateUrl: 'app/template/coldStorageTemper.htm'
    }).state('coldStorageHumidity', {//1.2湿度监控
        url: '/coldStorageHumidity/:storageID',
        controller: 'coldStorageHumidity',
        templateUrl: 'app/template/coldStorageHumidity.htm'
    }).state('powerAnalysis',{
		url:'/powerAnalysis/{rdcId}',
		controller: 'powerAnalysis',
	    templateUrl: 'app/template/powerAnalysis.htm'
    }).state('waterAnalysis',{// //分析--->水耗分析=============================================================f
    	url:'/waterAnalysis/{rdcId}',
    	controller: 'waterAnalysis',
    	templateUrl: 'app/template/waterAnalysis.htm'
    }).state('coldStorageDoor', {
        url: '/coldStorageDoor/:storageID',
        controller: 'coldStorageDoor',
        templateUrl: 'app/template/coldStorageDoor.htm'
    }).state('coldStorageInOutGoods', {
        url: '/coldStorageInOutGoods',
        controller: 'coldStorageInOutGoods',
        templateUrl: 'app/template/coldStorageInOutGoods.htm'
    }).state('compressorPressure', {
        url: '/compressorPressure/:compressorID',
        controller: 'compressorPressure',
        templateUrl: 'app/template/compressorPressure.htm'
    }).state('compressorBlower', {
        url: '/compressorBlower/{rdcId}',
        controller: 'compressorBlower',
        templateUrl: 'app/template/compressorBlower.htm'
    }).state('historyData',{
    	url:'/historyData',
    	controller: 'historyData',
        templateUrl: 'app/template/historyData.htm'
    }).state('exphistoryData',{
    	url:'/exphistoryData',
    	controller: 'exphistoryData',
    	templateUrl: 'app/template/exphistoryData.htm'
    }).state('power',{
    	url:'/power/{powerid}',
    	controller: 'power',
        templateUrl: 'app/template/power.htm'
    }).state('waterCost',{
    	url:'/waterCost',
    	controller: 'waterCost',
        templateUrl: 'app/template/waterCost.htm'
    }).state('platformDoor',{
    	url:'/platformDoor/{doorid}',
    	controller: 'platformDoor',
        templateUrl: 'app/template/platformDoor.htm'
    }).state('other',{
    	url:'/otherDevice',
    	controller: 'other',
        templateUrl: 'app/template/other.htm'
    }).state('light',{
    	url:'/light/:storageID',
    	controller: 'light',
        templateUrl: 'app/template/light.htm'
    })
    .state('reportsAnalysis',{//分析报表 -参数 rdcID
    	url: '/reportsAnalysis/{rdcId}',
    	controller: 'reportsAnalysis',
        templateUrl: 'app/template/reportsAnalysis.htm'
    })
    .state('reportsAnalysis1',{//分析报表 -参数 rdcID
    	url: '/reportsAnalysis1/',
    	controller: 'reportsAnalysis1',
    	templateUrl: 'app/template/reportsAnalysis1.htm'
    })
    .state('coolingAnalysis',{//制冷系统分析  -参数 rdcID
    	url: '/coolingAnalysis/{rdcId}',
    	controller: 'coolingAnalysis',
        templateUrl: 'app/template/coolingAnalysis.htm'
    }).state('runningAnalysis',{//制冷系统分析  -运行分析--jhy
    	url: '/runningAnalysis/{rdcId}',
    	controller: 'runningAnalysis',
        templateUrl: 'app/template/runningAnalysis.htm'
    }).state('goodsYzAnalysis',{//运管分析  -货物因子分析--jhy
    	url: '/goodsYzAnalysis/{rdcId}',
    	controller: 'goodsYzAnalysis',
        templateUrl: 'app/template/goodsYzAnalysis.htm'
    }).state('monthReport',{//分析  -分析报告--jhy--2016-10-31
    	url: '/monthReport/{rdcId}',
    	controller: 'monthReport',
        templateUrl: 'app/template/monthReport.htm'
    })
  
    //============================================================分析报告================================================================
    .state('tempReport',{//温度分析报告  -分析报告--jhy--2017-06-19 新版
        url: '/tempReport/{rdcId}',
        controller: 'tempReport',
        templateUrl: 'app/template/tempReport.htm'
    }).state('basicReport',{//基本版析报告  -分析报告--jhy--2017-06-19 新版
        url: '/basicReport/{rdcId}',
        controller: 'basicReport',
        templateUrl: 'app/template/basicReport.htm'
    }).state('wiseReport',{//聪慧版析报告  -分析报告--jhy--2017-06-19 新版
        url: '/wiseReport/{rdcId}',
        controller: 'wiseReport',
        templateUrl: 'app/template/wiseReport.htm'
    }).state('cpswaterCost',{//实时水耗
    	url: '/cpswaterCost/{groupID}',
    	controller: 'cpswaterCost',
        templateUrl: 'app/template/waterCostGroup.htm'
    }).state('overTempCountAndTime',{
    	url:'/overTempCountAndTime/{rdcId}',
    	controller: 'overTempCountAndTime',
        templateUrl: 'app/template/overTempCountAndTime.htm'
    }).state('overTemperatureYZ',{
    	url:'/overTemperatureYZ/{rdcId}',
    	controller: 'overTemperatureYZ',
        templateUrl: 'app/template/overTemperatureYZ.htm'
    }).state('BWYZ',{
    	url:'/BWYZ/{rdcId}',
    	controller: 'BWYZ',
        templateUrl: 'app/template/BWYZ.htm'
    }).state('WDZQYZ',{
    	url:'/WDZQYZ/{rdcId}',
    	controller: 'WDZQYZ',
        templateUrl: 'app/template/WDZQYZ.htm'
    }).state('doorAnalysis',{
    	url:'/doorAnalysis/{rdcId}',
    	controller: 'doorAnalysis',
        templateUrl: 'app/template/doorAnalysis.htm'
    }).state('baoyangReminder',{
    	url:'/baoyangReminder',
    	controller: 'baoyangReminder',
        templateUrl: 'app/template/baoyangReminder.htm'
    }).state('baoyangWeixiuRecords',{
    	url:'/baoyangWeixiuRecords',
    	controller: 'baoyangWeixiuRecords',
        templateUrl: 'app/template/baoyangWeixiuRecords.htm'
    }).state('baoyangWeixiuApply',{
    	url:'/baoyangWeixiuApply',
    	controller: 'baoyangWeixiuApply',
        templateUrl: 'app/template/baoyangWeixiuApply.htm'
    }).state('hotAnalysis',{
    	url:'/hotAnalysis',
    	controller: 'hotAnalysis',
        templateUrl: 'app/template/hotAnalysis.htm'
    }).state('alarmTemp',{//温度告警
    	url:'/alarmTemp',
    	controller: 'alarmTemp',
        templateUrl: 'app/template/alarmTemp.htm'
    }).state('alarmTempDatil',{//告警预览--》针对集团多账号
    	url:'/alarmTempDatil',
    	controller: 'alarmTempDatil',
        templateUrl: 'app/template/alarmTempDatil.htm'
    }).state('lightGroup',{//灯组
    	url:'/lightGroup',
    	controller: 'lightGroup',
        templateUrl: 'app/template/lightGroup.htm'
    }).state('maintainComfirm',{//maintainComfirm
    	url:'/maintainComfirm',
    	controller: 'maintainComfirm',
        templateUrl: 'app/template/maintainComfirm.htm'
    }).state('maintenancealarm',{//维修告警
    	url:'/maintenancealarm/{st}',
    	controller: 'maintenancealarm',
        templateUrl: 'app/template/maintenancealarm.htm'
    }).state('maintenancenotice',{//服务商维修通知
    	url:'/maintenancenotice',
    	controller: 'maintenancenotice',
        templateUrl: 'app/template/maintenancenotice.htm'
    }).state('maintainRequest',{//冷库维修通知单
    	url:'/maintainRequest/{ids}_{st}',
    	controller: 'maintainRequest',
        templateUrl: 'app/template/maintainRequest.htm'
    }).state('maintainRepair',{//冷库维修确认单
    	url:'/maintainRepair/{ids}_{st}',
    	controller: 'maintainRepair',
        templateUrl: 'app/template/maintainRepair.htm'
    }).state('personInfo',{//冷库维修确认单
    	url:'/personInfo',
    	controller: 'personInfo',
        templateUrl: 'app/template/personInfo.htm'
    }).state('message',{//所有告警信息
        url:'/message',
        controller: 'message',
        templateUrl: 'app/template/message.htm'
    }).state('warnLog',{//告警日志
	   url:'/warnLog',
	   controller: 'warnLog',
       templateUrl: 'app/template/warnLog.htm'
    })	//==================================================设置================================================
	.state('accessConfiguration',{//权限配置
        url:'/accessConfiguration',
        controller: 'accessConfiguration',
        templateUrl: 'app/template/accessConfiguration.htm'
    }).state('paramConf',{//参数回写
        url:'/paramConf',
        controller: 'paramConf',
        templateUrl: 'app/template/paramConf.htm'
    });
    
    

//    .state('rdcPower', {//rdc用电量----Temp
//        url: '/rdcPower/:rdcId',
//        controller: 'rdcPower',
//        templateUrl: 'app/template/rdcPower.htm'
//    })
    //    .state('myColdStorage',{维修确认单
//    	url:'/myColdStorage/:storageID',
//    	controller: 'myColdStorage',
//        templateUrl: 'app/template/myColdStorage.html'
//    })
//    .state('report',{//月度报表
//    	url:'/report-{time}-{item}',
//    	controller: 'report',
//        templateUrl: 'app/template/report.html'
//    })
//    .state('coldStorageMap', {//冷库地图
//        url: '/coldStorageMap/:storageID',
//        controller: 'coldStorageMap',
//        templateUrl: 'app/template/coldStorageMap.html'
//    })
    //
//  .state('warncoldAnalysis', {//制冷告警统计
//      url: '/warncoldAnalysis/{rdcId}',
//      controller: 'warncoldAnalysis',
//      templateUrl: 'app/template/warncoldAnalysis.html'
//  })
//  .state('coldStorageMonitor', {
//      url: '/coldStorageMonitor/:storageID',
//      controller: 'coldStorageMonitor',
//      templateUrl: 'app/template/coldStorageMonitor.html'
//  })
//  .state('compressorMonitor', {
//      url: '/compressorMonitor/:storageID',
//      controller: 'compressorMonitor',
//      templateUrl: 'app/template/compressorMonitor.html'
//  })
//  .state('designStorage',{//选型
//	url:'/designStorage',
//	controller: 'designStorage',
//    templateUrl: 'app/template/designStorage.html'
//})
//  .state('alarmLog',{//告警日志
//	url:'/alarmLog/',
//	controller: 'alarmLog',
//    templateUrl: 'app/template/alarmLog.html'
//})
//  .state('overTemperatureTime',{
//	url:'/overTemperatureTime/{rdcId}',
//	controller: 'overTemperatureTime',
//	templateUrl: 'app/template/overTemperatureTime.html'
//})
//.state('overTemperature',{
//	url:'/overTemperature/{rdcId}',
//	controller: 'overTemperature',
//    templateUrl: 'app/template/overTemperature.html'
//})
//.state('overTemperatureCount',{
//	url:'/overTemperatureCount/{rdcId}',
//	controller: 'overTemperatureCount',
//    templateUrl: 'app/template/overTemperatureCount.html'
//})
});

//var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);  
//var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);  

/*window.alert=function(msg){
	var newmsg = msg;
	layer.alert(newmsg)
}*/

//导航栏选中的高亮显示
function activeLi(ops){$('.my_sidebar li').removeClass('active');$(ops).addClass('active');window.scroll(0,0);}
$('.goTop').click(function(event){$('html,body').stop().animate({'scrollTop':0}, 400);});
$(window).scroll(function(event) {if ($(window).scrollTop() >= $(window).height()) {$('.goTop').show();} else {$('.goTop').hide();}});//一键回到顶部
