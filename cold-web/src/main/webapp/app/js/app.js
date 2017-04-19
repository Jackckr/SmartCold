var user, coldWeb = angular.module('ColdWeb', ['ui.bootstrap', 'ui.router', 'ui.checkbox','ngSanitize','ui.select', 'ngCookies', 'xeditable','angucomplete-alt','angular-table', 'bsTable']);
angular.element(document).ready(function($ngCookies, $location,$rootScope,$http) {
	   $.ajax({url: '/i/user/findUser',type: "GET", dataType: 'json',cache: false}).success(function(data){user = data;
	    	if(user.username == null){document.location.href = "/login.html";return; }
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
				    series : [ { name:lineName,type: type,data:yData, }]
				};
			return option;
		}
	};
}]);


coldWeb.factory('userService', ['$rootScope', '$state', '$http',function ($rootScope, $state,$http) {
    return {
        setUser: function (user) {
            $rootScope.user = user, $rootScope.userType=$rootScope.user.type;
            $rootScope.logout = function () {
	        	 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/logout'}).success(function(data){});
	        	 $rootScope.user =window.user=user=undefined;  window.sessionStorage.clear();
	        	 window.location.href="login.html";
	        };
        },
        setStorage: function () {
        	$rootScope.initAllByRdcId = function(rdcId){
        		     console.log("rdc:"+rdcId);
        		     $rootScope.rdcId = rdcId;window.sessionStorage.smrdcId=rdcId;//缓存rdcid
		        	 $http({method:'POST',url:'i/acl/getRUACL',params:{rdcid : $rootScope.rdcId,uid : $rootScope.user.id}}).success(function (data) {
		        			    $rootScope.aclml=data.aclml;
					      		$("#lfmenu .quanxian").attr("disabled",true).removeClass("quanxian").removeClass("hide");
					      		angular.forEach(data.aclml,function(obj,i){ 
					      			if(obj.acl){
					      				if(!obj.hasnode){  
					      					// 技术原因，无法处理
//					      					coldWeb.stateProvider.state(obj.controller,{url:obj.tourl,controller: obj.controller,  templateUrl: obj.templateUrl });
					      				}
					      			}else{
					      				$("#ml_acl"+obj.id).addClass("quanxian");$("#ml_acl"+obj.id+" *").addClass("quanxian");$("#ml_acl"+obj.id+" *").attr("disabled",true); 
					      				if($rootScope.user.type!=0){$("#ml_acl"+obj.id).addClass("hide");}
					      			}
					      		});
					      		$("#lefaside").removeClass("hide");
		        	});
		        		
		        	 $http.get('/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function(data,status,headers,config){// 初始化冷库
		        			$rootScope.Tempset=[];$rootScope.mystorages = data;$rootScope.storageModal = data[0];
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
        	};
        	$rootScope.changeRdc = function(value){
        		if(value){
        			if(value.originalObject == $rootScope.vm.choserdc){return;}
            		$rootScope.vm.choserdc = value.originalObject;
        		}
        		window.sessionStorage.cactrdc=JSON.stringify($rootScope.vm.choserdc);
        		$rootScope.initAllByRdcId($rootScope.vm.choserdc.id);
        		
        	};
        	
            if ($rootScope.user != null && $rootScope.user!='' && $rootScope.user!= undefined && $rootScope.user.id != 0){
            	if(window.sessionStorage.cactrdcdata&&window.sessionStorage.cactrdc){
            		var data=JSON.parse(window.sessionStorage.cactrdcdata);
            		var cutrdc=JSON.parse(window.sessionStorage.cactrdc);
            		$rootScope.vm = {choserdc:cutrdc,allUserRdcs:data};
    				$rootScope.initAllByRdcId($rootScope.vm.choserdc.id);
            	}else{
            		$http.get('/i/rdc/findRDCsByUserid?userid=' + $rootScope.user.id).success(function(data,status,headers,config){
        				if(data.length == 0){document.location.href = "/notAudit.html";return;}
        				window.sessionStorage.cactrdcdata=JSON.stringify(data);
        				$rootScope.vm = {choserdc:data[0],allUserRdcs:data};
        				$rootScope.initAllByRdcId($rootScope.vm.choserdc.id);
        	       });
            	}
            	
            }

            $rootScope.toMyCompressor = function (compressorID) {  $state.go('compressorPressure', {'compressorID': compressorID}); };
            $rootScope.toMyBlowers = function () { $state.go('compressorBlower', {'rdcId': $rootScope.rdcId}); };
            $rootScope.openColdDiv = function (){ $state.go('coldStorageDiv',{'storageID': $rootScope.rdcId}); };
            $rootScope.openLightDiv = function (){ $state.go('light',{'storageID': $rootScope.rdcId});};
            $rootScope.openWarn = function (){$state.go('warn',{'rdcId': $rootScope.rdcId});};
            $rootScope.toRdcPower = function () { $state.go('rdcPower', {'rdcId': $rootScope.rdcId}); };
            $rootScope.toMyStorageTemper = function (storageID) {$state.go('coldStorageTemper', {'storageID': storageID});};
            $rootScope.toMyStorageDoor = function (storageID) {$state.go('coldStorageDoor', {'storageID': storageID});};
//            $rootScope.toMap = function () { $state.go('coldStorageMap', {}); };
//            $rootScope.toReport = function () { var time = 'daily';var item = 'data';$state.go('report', {'time':time,'item':item});};
        },
    };
}]);
coldWeb.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/cold360Physical");
    coldWeb.stateProvider=$stateProvider;
    //index
    $stateProvider.state('cold360Physical',{
		url:'/cold360Physical',
		controller: 'cold360Physical',
	    templateUrl: 'app/template/cold360Physical.html'
    }).state('about',{
    	url:'/about',
    	controller: 'base0',
        templateUrl: 'app/template/about.html'
    }).state('login',{
    	url:'/login',
    	controller: 'login',
        templateUrl: 'app/template/login.html'
    }).state('warn', {
        url: '/warn/:rdcId',
        controller: 'warn',
        templateUrl: 'app/template/warn.html'
    }).state('warncoldAnalysis', {//制冷告警统计
        url: '/warncoldAnalysis/{rdcId}',
        controller: 'warncoldAnalysis',
        templateUrl: 'app/template/warncoldAnalysis.html'
    }).state('coldStorageMonitor', {
        url: '/coldStorageMonitor/:storageID',
        controller: 'coldStorageMonitor',
        templateUrl: 'app/template/coldStorageMonitor.html'
    }).state('compressorMonitor', {
        url: '/compressorMonitor/:storageID',
        controller: 'compressorMonitor',
        templateUrl: 'app/template/compressorMonitor.html'
    }).state('coldStorageDoor', {
        url: '/coldStorageDoor/:storageID',
        controller: 'coldStorageDoor',
        templateUrl: 'app/template/coldStorageDoor.html'
    }).state('coldStorageInOutGoods', {
        url: '/coldStorageInOutGoods',
        controller: 'coldStorageInOutGoods',
        templateUrl: 'app/template/coldStorageInOutGoods.html'
    }).state('coldStorageTemper', {
        url: '/coldStorageTemper/:storageID',
        controller: 'coldStorageTemper',
        templateUrl: 'app/template/coldStorageTemper.html'
    }).state('compressorPressure', {
        url: '/compressorPressure/:compressorID',
        controller: 'compressorPressure',
        templateUrl: 'app/template/compressorPressure.html'
    }).state('compressorBlower', {
        url: '/compressorBlower/{rdcId}',
        controller: 'compressorBlower',
        templateUrl: 'app/template/compressorBlower.html'
    }).state('coldStorageDiv', {
        url: '/coldStorageDiv/:storageID',
        controller: 'coldStorageDiv',
        templateUrl: 'app/template/coldStorageDiv.html'
    }).state('rdcPower', {
        url: '/rdcPower/:rdcId',
        controller: 'rdcPower',
        templateUrl: 'app/template/rdcPower.html'
    })
    .state('historyData',{
    	url:'/historyData',
    	controller: 'historyData',
        templateUrl: 'app/template/historyData.html'
    }).state('exphistoryData',{
    	url:'/exphistoryData',
    	controller: 'exphistoryData',
    	templateUrl: 'app/template/exphistoryData.html'
    }).state('power',{
    	url:'/power/{powerid}',
    	controller: 'power',
        templateUrl: 'app/template/power.html'
    }).state('waterCost',{
    	url:'/waterCost',
    	controller: 'waterCost',
        templateUrl: 'app/template/waterCost.html'
    }).state('platformDoor',{
    	url:'/platformDoor/{doorid}',
    	controller: 'platformDoor',
        templateUrl: 'app/template/platformDoor.html'
    }).state('other',{
    	url:'/otherDevice',
    	controller: 'other',
        templateUrl: 'app/template/other.html'
    }).state('light',{
    	url:'/light/:storageID',
    	controller: 'light',
        templateUrl: 'app/template/light.html'
    }).state('reportsAnalysis',{//分析报表 -参数 rdcID
    	url: '/reportsAnalysis/{rdcId}',
    	controller: 'reportsAnalysis',
        templateUrl: 'app/template/reportsAnalysis.html'
    }).state('coolingAnalysis',{//制冷系统分析  -参数 rdcID
    	url: '/coolingAnalysis/{rdcId}',
    	controller: 'coolingAnalysis',
        templateUrl: 'app/template/coolingAnalysis.html'
    }).state('runningAnalysis',{//制冷系统分析  -运行分析--jhy
    	url: '/runningAnalysis/{rdcId}',
    	controller: 'runningAnalysis',
        templateUrl: 'app/template/runningAnalysis.html'
    }).state('goodsYzAnalysis',{//运管分析  -货物因子分析--jhy
    	url: '/goodsYzAnalysis/{rdcId}',
    	controller: 'goodsYzAnalysis',
        templateUrl: 'app/template/goodsYzAnalysis.html'
    }).state('monthReport',{//分析  -分析报告--jhy--2016-10-31
    	url: '/monthReport/{rdcId}',
    	controller: 'monthReport',
        templateUrl: 'app/template/monthReport.html'
    }).state('cpswaterCost',{//
    	url: '/cpswaterCost/{groupID}',
    	controller: 'cpswaterCost',
        templateUrl: 'app/template/waterCostGroup.html'
    }).state('overTemperature',{
    	url:'/overTemperature/{rdcId}',
    	controller: 'overTemperature',
        templateUrl: 'app/template/overTemperature.html'
    }).state('overTemperatureYZ',{
    	url:'/overTemperatureYZ/{rdcId}',
    	controller: 'overTemperatureYZ',
        templateUrl: 'app/template/overTemperatureYZ.html'
    }).state('BWYZ',{
    	url:'/BWYZ/{rdcId}',
    	controller: 'BWYZ',
        templateUrl: 'app/template/BWYZ.html'
    }).state('WDZQYZ',{
    	url:'/WDZQYZ/{rdcId}',
    	controller: 'WDZQYZ',
        templateUrl: 'app/template/WDZQYZ.html'
    }).state('doorAnalysis',{
    	url:'/doorAnalysis/{rdcId}',
    	controller: 'doorAnalysis',
        templateUrl: 'app/template/doorAnalysis.html'
    }).state('baoyangReminder',{
    	url:'/baoyangReminder',
    	controller: 'baoyangReminder',
        templateUrl: 'app/template/baoyangReminder.html'
    }).state('baoyangWeixiuRecords',{
    	url:'/baoyangWeixiuRecords',
    	controller: 'baoyangWeixiuRecords',
        templateUrl: 'app/template/baoyangWeixiuRecords.html'
    }).state('baoyangWeixiuApply',{
    	url:'/baoyangWeixiuApply',
    	controller: 'baoyangWeixiuApply',
        templateUrl: 'app/template/baoyangWeixiuApply.html'
    }).state('hotAnalysis',{
    	url:'/hotAnalysis',
    	controller: 'hotAnalysis',
        templateUrl: 'app/template/hotAnalysis.html'
    }).state('alarmLog',{
    	url:'/alarmLog',
    	controller: 'alarmLog',
        templateUrl: 'app/template/alarmLog.html'
    }).state('designStorage',{//选型
    	url:'/designStorage',
    	controller: 'designStorage',
        templateUrl: 'app/template/designStorage.html'
    }).state('lightGroup',{//灯组
    	url:'/lightGroup',
    	controller: 'lightGroup',
        templateUrl: 'app/template/lightGroup.html'
    }).state('maintainComfirm',{//maintainComfirm
    	url:'/maintainComfirm',
    	controller: 'maintainComfirm',
        templateUrl: 'app/template/maintainComfirm.html' 
    }).state('maintenancealarm',{//维修告警
    	url:'/maintenancealarm',
    	controller: 'maintenancealarm',
        templateUrl: 'app/template/maintenancealarm.html' 
    }).state('maintenancenotice',{//服务商维修通知
    	url:'/maintenancenotice',
    	controller: 'maintenancenotice',
        templateUrl: 'app/template/maintenancenotice.html' 
    }).state('maintainRequest',{//冷库维修通知单
    	url:'/maintainRequest/{ids}',
    	controller: 'maintainRequest',
        templateUrl: 'app/template/maintainRequest.html' 
    }).state('maintainRepair',{//冷库维修确认单
    	url:'/maintainRepair',
    	controller: 'maintainRepair',
        templateUrl: 'app/template/maintainRepair.html' 
    }).state('warningMsg',{//冷库维修确认单
    	url:'/warningMsg',
    	controller: 'warningMsg',
        templateUrl: 'app/template/warningMsg.html' 
    });
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
   
});

//var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);  
//var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);  

/*window.alert=function(msg){
	var newmsg = msg;
	layer.alert(newmsg)
}*/

//导航栏选中的高亮显示
function activeLi(ops){$('.my_sidebar li').removeClass('active');$(ops).addClass('active');}
