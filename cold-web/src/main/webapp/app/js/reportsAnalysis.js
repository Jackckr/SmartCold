/**
 * 分析报表
 */
coldWeb.controller('reportsAnalysis', function ($scope, $http,$stateParams,$rootScope) {
	$scope.getDateTimeStringBefore = function(before){ return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,''); };
	$scope.begin = $scope.getDateTimeStringBefore(3).substr(0,10);
	$scope.end =$scope.getDateTimeStringBefore(0).substr(0,10);
	$scope.picktime = $scope.begin + ' - ' + $scope.end  ; 
	$scope.rdcid=window.sessionStorage.smrdcId;//// $stateParams.rdcId; 
	$scope.coldstoragedoor=undefined,$scope.StorageBlower=undefined;//冷库门
	$scope.slindex=0,$scope.urlid=0,$scope.sltit="日耗电量",$scope.tabletit=null,$scope.rs_msg=null;
	$('#reservationtime').daterangepicker({startDate:$scope.begin,endDate:$scope.end , timePicker: false, timePickerIncrement: 1, format: 'YYYY-MM-DD'});
	var typemode={title:["电量","水耗","开门","温度分析","热量","冷风机","系统效率"],key:["'TotalPWC'","'WaterCost'","'OpenTimes','TotalTime';次数,时长（min）","'ChaoWenShiJian','MaxTemp','ChaoWenYinZi','BaoWenYinZi';超温时长（min）,最高温度（℃）,超温因子（ε）,保温因子（τ ）","-1这是站位","'RunningTime','DefrosingTime';制冷时间（min）,化霜时间（min）","-1这是站位"] ,type:[10,3,2,1,-1,4,-1]};
	$scope.slgroupsl=function(e){$scope.showobjgroup=!$scope.showobjgroup;};
	$scope.showkeyli=function($event,index,urlid){
		$scope.slindex=index,$scope.urlid=urlid;
		$("#ul_key_list li").removeClass("select");
		$($event.target).addClass("select");
		$scope.sltit=$event.target.innerText;
		$scope.showobjgroup=false; 
		$scope.getsldata();
	};

	$scope.expdata=function(){//导出数据
    
    };
    $scope.Preview=function(){ //打印预览
           $("#rpt_asis_coment").printThis({ importCSS: true,importStyle: true, printContainer: true,  pageTitle: $scope.sltit, removeInline: false, formValues: true  });//  loadCSS: "/Content/Themes/Default/style.css",
    };
    $scope.getsldata=function(){//拦截未加载数据
    	if($scope.slindex==2){
    		if($scope.coldstoragedoor==undefined){
    			$http.get("/i/AnalysisController/getColdStorageDoor",{params:{'rdcId':$scope.rdcid}}).success(function(data){
    				$scope.coldstoragedoor=data;
    			});
    		};
    	}else if($scope.slindex==5){
    		if($scope.StorageBlower==undefined){
    			$http.get("/i/AnalysisController/getColdStorageBlower",{params:{'rdcId':$scope.rdcid}}).success(function(data){
    				$scope.StorageBlower=data;
    			});
    		};
    	}
    };
    function getcofinData(){
    	var data=null, datainf=[];
    	switch($scope.slindex)
    	{
    	case 0:data=  $rootScope.powers; break;//电表 -> 日耗电量->ok
    	case 1:data= $rootScope.compressorGroups;break;//压缩机组 -> 水耗->ok
    	case 2:data=$scope.coldstoragedoor; break;//冷库门->开门
    	case 3:data=$rootScope.mystorages; break;//冷库->温度分析
    	case 4:data=null; break;//冷库->热　　量
    	case 5:data=$scope.StorageBlower; break;//blower->冷风机
    	case 6:data=null; break;//系统效率
    	 default:
    		 	 break;
    	}
    	if(data!=null){$.each(data, function(i, vo){ datainf.push({id:i,rdcid:vo.id,name:vo.name});});}
    	$scope.tabletit=datainf;
    	return JSON.stringify(datainf);
    	
    }
	/**
	 * 搜索数据
	 */
	$scope.search = function(){
		$scope.rs_msg=null;
	    var datainfo=getcofinData();
	    $("#rpt_asistb_tit").html($scope.sltit);
	   if(datainfo==null||datainfo=="[]"){$scope.rs_msg="当前冷库的没有"+typemode.title[$scope.slindex]+"相关的配置！";return;}
		$.ajax({
            type: "POST",
            url:'i/AnalysisController/getCasesTotalSISAnalysis',
            data:{index:$scope.urlid, rdcId:$scope.rdcid,type:typemode.type[$scope.slindex],confdata:datainfo, key:typemode.key[$scope.slindex], startTime:$scope.begin,endTime:$scope.end},//
            success: function(data) {
                if(data.success){
	               if($scope.urlid==0){
	            	   $scope.dldata(data);
	               }else{
	            	   $scope.cldata(data);
	               }
               }else{
            	   $("#rpt_asis_table").addClass("hide");
            	   alert("err!");
               }
            }
        });
		
	};
	
	function getbdltit(value){
	    if(value==null||value==''||value=='null')return '<td>0</td>';else return "<td>"+value+"</td>";
    }
	
	function gettbcltit(value,cl){
	    if(value==null||value==''||value=='null')return '<td  colspan="'+cl+'"></td>';else return '<td colspan="'+cl+'">'+value+'</td>';
    }
	$scope.dldata=function(data){//处理单key
         var tbdata=data.entity.tbdata;
         var tit=[],tboy=[]; 
         tit.push("<td>日期</td>");
         $.each($scope.tabletit, function(i, vo){tit.push(getbdltit(vo.name)); });
         if(tbdata){//有数据
         	$.each(tbdata, function(i, vo){var tr="<tr><td>"+i+"</td>"; 
         	$.each(vo, function(j, jvo){tr+=getbdltit(jvo); }); tr+="</tr>";tboy.push(tr);});
         }else{//没有数据
         	tboy.push("<tr><td  colspan='"+tit.length+"'><div class='alert alert-info  text-center'>没有查询到数据！</div></td></tr>"); 
         }
         $("#rpt_asistb_thead").html(tit.join(""));
         $("#rpt_asistb_tbody").html(tboy.join(""));
	};	
	$scope.cldata=function(data){//处理多key
		var tbdata=data.entity.tbdata;
		var titls=data.entity.titls;
		var keyts=data.entity.keyts;
		var tit=["<tr><td rowspan='2'>日期</td>"], subtit=["<tr>"],tboy=[]; 
		$.each($scope.tabletit, function(i, vo){
			tit.push(gettbcltit(vo.name,keyts.length));
			$.each(titls, function(j, po){subtit.push(getbdltit(po));});//第二栏位标题
		});
		subtit.push("</tr>");tit.push("</tr>");
		if(tbdata){//有数据
			$.each(tbdata, function(i, vo){
				var tr="<tr><td>"+i+"</td>"; 
			   $.each(vo, function(j, jvo){  tr+=getbdltit(jvo);  }); 
			   tr+="</tr>";
			   tboy.push(tr);
			 });
		}else{//没有数据
			tboy.push("<tr><td  colspan='"+(subtit.length-1)+"'><div class='alert alert-info  text-center'>没有查询到数据！</div></td></tr>"); 
		}
		$("#rpt_asistb_thead").html(tit.join("")+subtit.join(""));
		$("#rpt_asistb_tbody").html(tboy.join(""));
	};	
	
	$(document).bind('click',function(e){ 
		if($scope.showobjgroup){
			var e = e || window.event; //浏览器兼容性 
			var elem = e.target || e.srcElement; 
			while (elem) { //循环判断至跟节点，防止点击的是div子元素 
			if (elem.id && elem.id=='filter_sl_div') { 
			   return; 
			 } 
			 elem = elem.parentNode; 
			}
			$scope.$apply(function () { $scope.showobjgroup=false; });
		}
	});
});
