/**
 * Created by maqiang34 on 16/10/18.
 * 分析报表
 */
coldWeb.controller('reportsAnalysis1', function ($scope, $http,$stateParams,$rootScope) {
	$scope.cuttunit=null;$scope.resdata=null;$scope.sisrdcid=[],$scope.sisrdcname=[],$scope.slindex=0,$scope.keytype=1,$scope.sltit="温度分析";
	if( $rootScope.user.role==3){$scope.rdclist=[$rootScope.vm.choserdc];}else{$scope.rdclist=$rootScope.vm.allUserRdcs;}//rdc策略
	$scope.getDateTimeStringBefore = function(before){ return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,''); };
	$scope.begin = $scope.getDateTimeStringBefore(3).substr(0,10),$scope.end =$scope.getDateTimeStringBefore(0).substr(0,10),$scope.picktime = $scope.begin + ' - ' + $scope.end  ; 
	$('#reservationtime').daterangepicker({startDate:$scope.begin,endDate:$scope.end , timePicker: false, timePickerIncrement: 1, format: 'YYYY-MM-DD'});
	var typemode={
			type:[1,10,3,2,1,4,-1,1,5],//分析类型
			unit:[[1,1,1,1,60],null,null,[1,60,60],null,[3600,3600],null,null,[3600,1,60]],//换算单位
			unite:["","　(kW·h)","　(T)","","","","","",""],//
			title:["温度分析","电量","水耗","冷库门","热量","冷风机","系统效率","货物因子","制冷运行分析"],
			key:["'MinTemp','MaxTemp','AvgTemp','ChaoWenCiShu','ChaoWenShiJian';最低温度(℃),最高温度(℃),平均温度(℃),超温次数,超温时长(min)","'TotalPWC'","'WaterCost'","'OpenTimes','TotalTime','AvgTime';次数,时长(min),平均时长(min)","'GoodsHeat','QFrost','QForklift','Qlighting','WallHeat','Qblower','Qctdoor';Q货,Q霜,Q叉,Q照,Q保,Q风,Q门","'RunningTime','DefrosingTime';制冷时间(H),化霜时间(H)","avg","'GoodsLiuTongYinZi'","'RunningTime','RunningCount','avg';运行总时间(H),运行总次数,平均时间(min)"] 
	};
	//********************************************************************开始装逼模式**********************************************************************

	
	$scope.search=function(isexpt){
		var stentime=$scope.picktime.split(" - ");
		$scope.cuttunit=typemode.unite[$scope.slindex];
		if($scope.keytype==1){
			keymod=typemode.key[$scope.slindex].split(';');
			$scope.keyks=keymod[0].split(','),$scope.keyts=keymod[1].split(',');
		}else{
			$scope.keyks=[typemode.key[$scope.slindex]];
			$scope.keyts=[typemode.title[$scope.slindex]];
		}
		
	    console.log($scope.slindex+":"+$scope.keytype);
	    $http({  
		    method:'POST',  
		    url:'i/AnalysisReportController/getSisDataByRdc',  
		    params:{
		    	type:typemode.type[$scope.slindex],
		    	keytype:$scope.keytype,
		    	title:typemode.title[$scope.slindex],
		    	key:typemode.key[$scope.slindex], 
		    	rdcIds:$scope.sisrdcid,
		    	rdcNames:$scope.sisrdcname,
		    	unit:typemode.unit[$scope.slindex],
		    	isexpt:isexpt,startTime:stentime[0],endTime:stentime[1]}
		}).success(function(data){  
			  if (data.success) {
					$scope.resdata = data.data;
					$scope.cuttrdc = data.data[0] ;
				} else {
					
				}
				$("#rpt_print").attr("disabled", !data.success);
		}) ;
	};
	
	
	
	 $scope.chan_data_view=function($event,index,rdcid){
		 $scope.cuttrdc = $scope.resdata[index] ;
         $($event.target).addClass('currentRdc').siblings('span').removeClass('currentRdc')
	 };


    $scope.showrdc=false;
    $scope.showrdclist=function(e){$scope.showrdc=!$scope.showrdc;};
    $scope.showkeyrdcli=function($event,index,rdcid,name){//展示下拉rdc
        $scope.showrdc=true;
        var em=$($event.target);
        if(em.hasClass('select')){
            em.removeClass("select");
            $scope.removearry( $scope.sisrdcid,rdcid);
            $scope.removearry( $scope.sisrdcname,name);
		}else{
            em.addClass("select");
            $scope.sisrdcid.push(rdcid);
            $scope.sisrdcname.push(name);
		}
    };
	
	$scope.initdata=function(){//模拟数据
	 angular.forEach($scope.rdclist,function(rdc,i){
		 if(rdc.id==$rootScope.rdcId){
			 $scope.sisrdcid.push(rdc.id);
			 $scope.sisrdcname.push(rdc.name);
		 }
	 });
   };
   $scope.initdata();
   
   $scope.removearry=function(aray,val){
	   var index = aray.indexOf(val);
	   if (index > -1) {
		   aray.splice(index, 1);
	   }
   };
   
   Array.prototype.remove = function(val) {
	   
	   };
	//********************************************************************事件START  不要关心**********************************************************************
    function gettbcltit(value,cl){//获取标题1
	    if(value==null||value==''||value=='null')return '<td  colspan="'+cl+'" ></td>';else return '<td colspan="'+cl+'">'+value+'</td>';
    }
	function getbdltit(value){//获取标题2
	    if(value==null||value==''||value=='null'){
	    	return '<td>0</td>';
	    }else{
	    	if( typeof value=="number"&& $scope.slindex!=3){return "<td>"+value.toFixed(2)+"</td>";}//排除温度因子
	    	return "<td>"+value+"</td>";
	    }
    }
	$scope.slgroupsl=function(e){$scope.showobjgroup=!$scope.showobjgroup;};
	$scope.showkeyli=function($event,index,keytype){//  urlid==0->单key  1:多key
        var em=$($event.target),disid=em.attr("disid") ;if(!disid){ alert("你妹！"); return;}
		$scope.slindex=index,$scope.keytype=keytype;
		$("#ul_key_list li").removeClass("select");
        em.addClass("select");
		$scope.sltit=$event.target.innerText;
		$scope.showobjgroup=false; 
		$scope.cuttrdc =null;
	};
    $scope.Preview=function(){ //打印预览
          $("#rpt_asis_coment").printThis({ importCSS: true,importStyle: true,  pageTitle: $scope.sltit,printContainer: true,  removeInline: false, formValues: true  });//  loadCSS: "/Content/Themes/Default/style.css",
    };
	$(document).bind('click',function(e){ 
		if($scope.showobjgroup||$scope.showrdc){
			 e = e || window.event; //浏览器兼容性 
			var elem = e.target || e.srcElement; 
			while (elem) { //循环判断至跟节点，防止点击的是div子元素 
			if (elem.id && elem.id=='filter_sl_div'||elem.id=='rdcBox') {  return;  }
			 elem = elem.parentNode; 
			}
			$scope.$apply(function () { $scope.showobjgroup=false;$scope.showrdc=false; });
		}
	});
	//********************************************************************事件END**********************************************************************
});
