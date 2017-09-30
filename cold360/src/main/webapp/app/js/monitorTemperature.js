checkLogin();
app.controller('monitorTemperature',function ($scope, $location, $http, $rootScope, userService) {
	$scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    Highcharts.setOptions({ global: { useUTC: false }});

    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var rootRdcId = $.getUrlParam('storageID');
    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            if (!rootRdcId) {
                if (window.localStorage.rdcId) {
                    initAllByRdcId(localStorage.rdcId);
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
                    initAllByRdcId($scope.rdcId);
                }
            } else {
                initAllByRdcId(rootRdcId);
                findByRdcId(rootRdcId);
            }
        }
    });

    function findByRdcId(rootRdcId) {
        $http.get(ER.coldroot + '/i/rdc/findRDCByRDCId?rdcID=' + rootRdcId).success(function (data) {
            $scope.currentRdc = data[0];
            $scope.rdcName = data[0].name;
            $scope.rdcId = data[0].id;
            $scope.viewStorage($scope.rdcId);
        });
    }

    $scope.viewStorage = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        //查询温度配置
        $http.get(ER.coldroot + '/i/temp/getTempsetByRdcId', {params: {"rdcId": rdcId } }).success(function (data) {
        		$scope.tempsets = data;
        });

        $http.get(ER.coldroot + '/i/coldStorageSet/findStorageSetByRdcId?rdcID=' + rdcId).success(function (data) {
            if (data && data.length > 0) {
                $scope.mystorages = data;
                for (var i = 0; i < $scope.mystorages.length; i++) {
                    $scope.load($scope.mystorages[i],false);
                }
            }
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    };
    $scope.searchRdcs = function (searchContent) {
        // 超管特殊处理
        if ($scope.user.roleid == 3) {
            $http.get(ER.coldroot + '/i/rdc/searchRdc?type=1&filter=' + searchContent).success(function (data) {
                if (data && data.length > 0) {
                    $scope.storages = data;
                }
            });
        }
    };
    $scope.changeRdc = function (rdc) {
        clearSwiper();
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.viewStorage(rdc.id);
        initAllByRdcId(rdc.id);
    };

    $scope.goElectric = function () {
        window.location.href='monitorElectric.html?storageID=' + $scope.rdcId;
    };
    $scope.goFacility = function () {
        window.location.href='monitorFacility.html?storageID=' + $scope.rdcId;
    };
    $scope.goOtherMonitor = function () {
        window.location.href='monitorCooling.html?storageID=' + $scope.rdcId;
    };

    var formatTime = function (timeString) {
        if (typeof(timeString) == "string") {
            return new Date(Date.parse(timeString) + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "");
        } else {
            return new Date(timeString.getTime() + 8 * 60 * 60 * 1000).toISOString().replace("T", " ").replace(/\..*/, "");
        }
    };

    $scope.swiper = 0, $scope.cacholds=[], $scope.cachnams=[];
    
    $scope.load = function (storage,isreload ) {
       var storageID = storage.id;
       var olds=[],names=[];
       var endTime = new Date(), startTime = new Date(endTime.getTime() - 1.5 * 60 * 60 * 1000);
       if( $scope.cacholds[storageID]){
    	   olds= $scope.cacholds[storageID];
    	   names= $scope.cachnams[storageID];
       }else{
			  angular.forEach($scope.tempsets,function(obj){  
				   if(obj.coldStorageId==storageID){   
					olds.push(obj.id);
				    names.push(obj.name);
				   } 
			  }); 
    	   $scope.cacholds[storageID]=olds;
    	   $scope.cachnams[storageID]=names;
       }
       $scope.initchData(storageID,olds,names,startTime,endTime);
    };
    
    
    
    
    $scope.initchData = function (storageID,olds,names,startTime,endTime) {
    	if(olds.length==0){return;};
        $http.get(ER.coldroot +'/i/util/getColdStatus', { params: {"oid": storageID}}).success(function (result) {$scope.isOverTemp=result; });
        $http.get(ER.coldroot +'/i/temp/getTempByTime', { params: {"oid": storageID, oids:olds,names:names, 'key':'Temp', "startTime": formatTime(startTime), "endTime": formatTime(endTime)}}).success(function (result) {
            var name = result.name;
        	var curtemper=[], yData = [], maxTime=endTime.getTime(), tempMap = result.tempMap,systime=result.systime;
            var datumTemp =  parseFloat(result.startTemperature) + 0.5 * parseFloat(result.tempdiff);//基准温度
        	var i= 0,tempList=newdata = [],vo=cuttime=lasttime=null; 
            for(var key in tempMap) { 
             	 vo=cuttime=null, tempList=tempMap[key], newdata = [],lasttime=startTime.getTime();
                 if( tempList.length>0){
	                 for ( i = 0; i < tempList.length; i++) {
						 vo=tempList[i];
						 if(i>0){ lasttime=newdata[newdata.length-1].x;}
						 cuttime=new Date(vo.addtime).getTime();
	                	 if(cuttime-lasttime>900000){ newdata.push({ x: lasttime+60000,y: null });} //修正中间数据短传问题1
	                	 newdata.push({ x: cuttime,y: vo.value });
					}
	                if( systime-cuttime>1800000&&systime-maxTime<900000){//大于半个小时。。提醒
	                	newdata.push({ x: maxTime,y:null }); 
	                }   //修正尾部数据短传问题2
	               if(newdata[newdata.length-1].y!=null){ curtemper.push(newdata[newdata.length-1].y.toFixed(2));}
                 }else{
                	 if(!$scope.isErr){ $scope.isErr=true;}
                	 newdata.push({ x: startTime.getTime(),y:null });
                	 newdata.push({ x: maxTime,y:null });
                 }
                yData.push({"name": key, "data": newdata });
            } 
            yData.push({ name: '基准温度', color: 'red',dashStyle: 'solid', marker: { symbol: 'circle' },data: [{x: startTime.getTime(),y: datumTemp},{x: endTime.getTime(),y: datumTemp}]});//处理基准温度
            $scope.initHighchart(storageID,name,curtemper,datumTemp,yData);
          });
         
    };

    $scope.initHighchart=function(storageID,storageName, curtemper,datumTemp,yData ){
    	  var mainId = 'main' + storageID;
    	  if($("#"+mainId).length>0){//已经创建
              $("#tm"+mainId).html(curtemper+"℃");
    	  }else{
    		  $("#chartView").last().append('<div class="swiper-slide">' +'<p class="actually">' +storageName + '</p>' + '<p id="tm'+mainId+'" class="temperaturenum">' + curtemper + '℃</p>' + '<div id=' + mainId + '></div> ');
    	  }
		  $("#"+mainId).highcharts({
			  series: yData,
              legend: { enabled: false },
              exporting: {enabled: false},
              credits: { enabled: false },
              plotOptions: { series: { marker: { enabled: false } }},
              title: { text: '' },
              xAxis: {  type: 'datetime', tickPixelInterval: 150,  },
              yAxis: {title: {text: '温度(℃)' }, plotLines: [{value: 0,width: 1, color: '#808080' },  { color: 'red',   dashStyle: 'solid',   value: datumTemp, width: 2, label: {  text: '基准温度(' + datumTemp + '℃)',align: 'right',   x: 0   }  }] },
              tooltip: { formatter: function () {  return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2); } },
              chart: {
                  type: 'spline',
                  renderTo: 'temperatureChart',
                  animation: Highcharts.svg, // don't animate in old IE
                  marginRight: 10,
                  backgroundColor: {  linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},stops: [ [0, 'rgb(210, 214, 222)'],[1, 'rgb(210, 214, 222)'] ]  }, borderColor: '#d2d6de', borderWidth: 2, className: 'dark-container', plotBackgroundColor: 'rgba(210, 214, 222, .1)',  plotBorderColor: '#d2d6de', plotBorderWidth: 1
              }
			  
		  });
    };
    $scope.close=function () {
        $scope.isOverTemp=false;
    }

    function clearSwiper() {
        $scope.swiper = 0;
        $("div").remove(".swiper-slide");
    }
    
    clearInterval($rootScope.timeTicket);
    $rootScope.timeTicket = setInterval(function () {
        if ($scope.mystorages && $scope.mystorages.length > 0) {
            for (var i = 0; i < $scope.mystorages.length; i++) {
                $scope.load($scope.mystorages[i],true);
            }
        }
    }, 30000);

});
