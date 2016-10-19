/**
 * Created by maqiang34 on 16/10/18.
 * 分析报表
 */
coldWeb.controller('reportsAnalysis', function ($scope, $http,$stateParams,$rootScope) {
	$scope.rdcid=window.sessionStorage.smrdcId;//// $stateParams.rdcId; 
	$scope.getDateTimeStringBefore = function(before){ return new Date(new Date().getTime() - before *24*60*60*1000).toISOString().replace("T"," ").replace(/\..*/g,''); };
	$scope.begin = $scope.getDateTimeStringBefore(3).substr(0,10),$scope.end =$scope.getDateTimeStringBefore(0).substr(0,10),$scope.picktime = $scope.begin + ' - ' + $scope.end  ; 
	$scope.slindex=0,$scope.urlid=0,$scope.sltit="日耗电量",$scope.tabletit=null,$scope.rs_msg=null,isSuccess=false,$scope.coldstoragedoor=undefined,$scope.StorageBlower=undefined, $scope.prove=undefined;//冷库门
	$('#reservationtime').daterangepicker({startDate:$scope.begin,endDate:$scope.end , timePicker: false, timePickerIncrement: 1, format: 'YYYY-MM-DD'});
	//key
	var typemode={
			      type:[10,3,2,1,-1,4,-1,-1,-1],
			      unit:[null,null,[1,60],[60,1,1,1],null,[3600,3600],null,null,null],//换算单位
			      unite:["　(kW·h)","　(T)","","","","","","",""],
			      title:["电量","水耗","冷库门","温度分析","热量","冷风机","系统效率","货物因子","制冷运行分析"],
			      key:["'TotalPWC'","'WaterCost'","'OpenTimes','TotalTime','AvgTime';次数,时长(min),平均时长(min)","'ChaoWenShiJian','MaxTemp','ChaoWenYinZi','BaoWenYinZi';超温时长(min),最高温度(℃),超温因子(ε),保温因子(τ)","","'RunningTime','DefrosingTime';制冷时间(H),化霜时间(H)","","",""] 
	};
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
    //获得配置数据
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
    	case 7:data=null; break;//货物因子
    	case 8:data=null; break;//制冷运行分析
    	default: break;
    	}
    	if(data!=null){
    		$.each(data, function(i, vo){datainf.push({id:i,rdcid:vo.id,name:vo.name+typemode.unite[$scope.slindex] }); });
    	}
    	$scope.tabletit=datainf;
    	return JSON.stringify(datainf);
    }
    $scope.getsldata=function(){//拦截未加载数据
    	if($scope.slindex==2&&$scope.coldstoragedoor==undefined||$scope.slindex==5&&$scope.StorageBlower==undefined){
	    	if($scope.prove==undefined){$scope.prove={};$.each($rootScope.mystorages, function(i, vo){ $scope.prove[vo.id]=vo.name;});}
	    	if($scope.slindex==2){//冷库门->开门
	    			$http.get("/i/AnalysisController/getColdStorageDoor",{params:{'rdcId':$scope.rdcid}}).success(function(data){
	    				$.each(data, function(i, vo){vo.name= $scope.prove[vo.coldStorageId]+ "-"+vo.name; });$scope.coldstoragedoor=data;
	    			});
	    	}else if($scope.slindex==5){//blower->冷风机
	    			$http.get("/i/AnalysisController/getColdStorageBlower",{params:{'rdcId':$scope.rdcid}}).success(function(data){
	    				 $.each(data, function(i, vo){vo.name= $scope.prove[vo.coldStorageId]+ "-"+vo.name; }); $scope.StorageBlower=data;
	    			});
	    	}}
    };
	$scope.search = function(isexpt){//查询数据
		isSuccess=false,$scope.rs_msg=null;$scope.isLoaddata=true; 
	    var datainfo=getcofinData();
	    $("#rpt_asistb_tit").html($scope.sltit);
	    if(datainfo==null||datainfo=="[]"){$scope.rs_msg="当前冷库的没有"+typemode.title[$scope.slindex]+"相关的配置！"; $("#rpt_print").attr("disabled",!isSuccess);return;}
	    var stentime=$scope.picktime .split(" - ");
		$.ajax({
            type: "POST",
            url:'i/AnalysisController/getCasesTotalSISAnalysis',
            data:{index:$scope.urlid,isexpt:isexpt,type:typemode.type[$scope.slindex],confdata:datainfo, key:typemode.key[$scope.slindex],unit:typemode.unit[$scope.slindex], startTime:stentime[0],endTime:stentime[1]},//
            success: function(data) {
                if(data.success){
                	isSuccess=true;
                	if(isexpt){$scope.subform(data.message);}else{ if($scope.urlid==0){  $scope.dldata(data);}else{ $scope.cldata(data); } }
	               }else{
	            	   if(isexpt){ alert("导出失败！"+data.message);  }else{ $scope.rs_msg=data.message; } //em.attr("disabled",false);
	               }
	               $("#rpt_print").attr("disabled",!isSuccess);
            }
        });
	};
	$scope.subform=function(sid){//创建无刷新下载表单
		$("#rpt_expxls").attr("disabled",true);
        var expfrom= $("<form>").attr('style', 'display:none').attr('method', 'post').attr('action', 'i/AnalysisController/expSISAnalysisData').attr('id', "expdataform");
        expfrom.attr("Content-Type","application/json;charset=UTF-8");
        expfrom.append($("<input>").attr("name","sid").attr("value",sid));
        expfrom.append($("<input>").attr("name","fileName").attr("value",$scope.sltit+"分析.xls"));
        expfrom.append($("<input>").attr("name","title").attr("value",$scope.sltit));
        expfrom.appendTo('body').submit().remove();
        setTimeout(function () {$("#rpt_expxls").attr("disabled",false); }, 3000);
   };
	
	//开始绘制表格
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
		var tit=["<tr><td rowspan='2' style='line-height:5;'>日期</td>"], subtit=["<tr>"],tboy=[]; 
		$.each($scope.tabletit, function(i, vo){
			tit.push(gettbcltit(vo.name,keyts.length));
			$.each(titls, function(j, po){subtit.push(getbdltit(po));});//第二栏位标题
		});
		subtit.push("</tr>");tit.push("</tr>");
		if(tbdata){//有数据
			$.each(tbdata, function(i, vo){
				var tr="<tr><td>"+i+"</td>";  $.each(vo, function(j, jvo){  tr+=getbdltit(jvo);  });  tr+="</tr>";
			    tboy.push(tr);
			 });
		}else{//没有数据
			tboy.push("<tr><td  colspan='"+(subtit.length-1)+"'><div class='alert alert-info  text-center'>没有查询到数据！</div></td></tr>"); 
		}
		$("#rpt_asistb_thead").html(tit.join("")+subtit.join(""));
		$("#rpt_asistb_tbody").html(tboy.join(""));
	};	
	//********************************************************************事件START**********************************************************************
	$scope.slgroupsl=function(e){$scope.showobjgroup=!$scope.showobjgroup;};
	$scope.showkeyli=function($event,index,urlid){//  urlid==0->单key  1:多key
		$scope.slindex=index,$scope.urlid=urlid;
		$("#ul_key_list li").removeClass("select");
		$($event.target).addClass("select");
		$scope.sltit=$event.target.innerText;
		$scope.showobjgroup=false; 
		$scope.getsldata();
	};
    $scope.Preview=function(){ //打印预览
          $("#rpt_asis_coment").printThis({ importCSS: true,importStyle: true,  pageTitle: $scope.sltit,printContainer: true,  removeInline: false, formValues: true  });//  loadCSS: "/Content/Themes/Default/style.css",
    };
	$(document).bind('click',function(e){ 
		if($scope.showobjgroup){
			 e = e || window.event; //浏览器兼容性 
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
	//********************************************************************事件END**********************************************************************
});
