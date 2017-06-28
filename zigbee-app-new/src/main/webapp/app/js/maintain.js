checkLogin();
var app = angular.module('app', ['ngFileUpload']);
app.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A', link: function (scope, element, attr) {
            $timeout(function () {
                scope.$emit('ngRepeatFinished');
            }, 100);
        }
    };
});
app.service('userService', function($rootScope,  $http) {
    initAllByRdcId= function(rootRdcId){
        $rootScope.rdcId = rootRdcId;
        console.log(rootRdcId)
        $http({method:'POST',url:ER.coldroot + '/i/acl/getRUACL',params:{rdcid : $rootScope.rdcId,uid : window.user.id}}).success(function (data) {
            $rootScope.aclml=data.aclml;
            $rootScope.pagstate=[];
            $("body .role_limit").attr("disabled",true).removeClass("role_limit").removeClass("role_hide");
            angular.forEach(data.aclml,function(obj,i){
                if(obj.acl){
                    if(!obj.hasnode){}
                }else{
                    $("#ml_acl"+obj.id).addClass("role_limit");
                    $("#ml_acl"+obj.id+" *").addClass("role_limit");
                    $("#ml_acl"+obj.id+" *").attr("disabled",true);
                    if(user.type==1 || user.type==2){
                        $("#ml_acl"+obj.id).addClass("role_hide");
                        $("#ml_acl"+obj.id+" *").addClass("role_hide");
                    }
                }
            });
        });
    }
})
app.controller('maintain', function ($scope, $location, $http, $timeout, $rootScope, Upload, userService) {
	var pageNum =  totalPages = 0;
    $scope.user = window.user;
    $http.defaults.withCredentials = true;
    $http.defaults.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    $scope.searchUrl = ER.coldroot + "/i/rdc/searchRdc?filter=";
    $scope.alarmTotalCnt = 0;
    $scope.alarmMsgs = []; 

    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var rootRdcId = $.getUrlParam('storageID');

    $http.get(ER.coldroot + '/i/rdc/findRDCsByUserid?userid=' + window.user.id).success(function (data) {
        if (data && data.length > 0) {
            $scope.storages = data;
            if (!rootRdcId) {
                if (window.localStorage.rdcId) {
                	initAllByRdcId(window.localStorage.rdcId);
                    findByRdcId(window.localStorage.rdcId);
                } else {
                    $scope.currentRdc = $scope.storages[0];
                    $scope.rdcId = $scope.storages[0].id;
                    $scope.rdcName = $scope.storages[0].name;
                    $scope.viewStorage($scope.storages[0].id);
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

    $scope.smgroid = null;
    $scope.sytime = undefined;
    $scope.viewStorage = function (rdcId) {
        window.localStorage.rdcId = $scope.rdcId;
        //根据rdcid查询该rdc的报警信息
        $http.get(ER.coldroot + '/i/warlog/findWarningLogsByRdcID', {
            params: {
                "rdcId": $scope.rdcId
            }
        }).success(function (data) {
            if (data && data.length > 0) {
                $scope.alarmTotalCnt = data.length;
            }
        });
        $http.get(ER.coldroot + '/i/compressorGroup/findByRdcId?rdcId=' + rdcId).success(function (data) {
            $scope.compressorGroups = data;
            var oid = [];
            angular.forEach($scope.compressorGroups, function (item) {
                oid.push(item.id);
                $http.get(ER.coldroot + '/i/compressor/findBygroupId?groupId=' + item.id).success(function (data) {
                    item.compressors = data;
                })
            })
            $scope.smgroid = oid.join(',');
            $http.get(ER.coldroot + '/i/physicalController/getCompressorinfo', {params: {oids: $scope.smgroid}}).success(function (data) {
                $scope.sytime = data.entity;
                angular.forEach($scope.compressorGroups, function (item) {
                    angular.forEach(item.compressors, function (obj) {
                        obj.sytm = $scope.aredayTime(obj);
                    });
                });
            });
        });
        $(".one").show();
        $(".two").hide();
        $('.searchTop').hide();
    }

    $scope.aredayTime = function (obj) {
        if (obj.maintenancetime && obj.lastMaintainTime) {
            var sytime = $scope.sytime[obj.id];
            if (sytime <= 0) {
                return '已超保养期' + sytime;
            }
            return "还剩  " + parseInt(sytime) + "小时";
        } else {
            return "未设置保养时间";
        }
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
    }
    
    $scope.changeRdc = function (rdc) {
        $scope.rdcId = rdc.id;
        $scope.rdcName = rdc.name;
        $scope.searchContent = "";
        $scope.alarmTotalCnt = 0;
        $scope.viewStorage(rdc.id);
        initAllByRdcId(rdc.id);
    }
    
    
    /*tab切换*/
   $(".mylog").click(function (event) {
        var _index = $(this).index();
        $('.mainTainBottomL>div').eq(_index).show().siblings().hide();
        $(this).addClass('current').siblings().removeClass('current');
        $scope.setp=1;$scope.st=null;$scope.rep=null;
       if(_index==2){
        	//维修记录
        	$scope.status="6"; 
        	$scope.initData();
        }else{
        //维修
	        if( $scope.user.type==2){
	       	  //维修商
	      	  $scope.status="1,2,3,4,5"; 
	      	  $scope.initData_notice();
	      	}else{
	      	  //冷库主
	      	  $scope.status="0,1,2,3,4,5"; 
	      	  $scope.initData();
	      	}
	    }
    })
    /**
     * **********************************************************************222**********************************************************************
     * 新版维修
     * 2017-04-26
     * 
     *      
     */
    
    $scope.setp=1;
    $scope.remode=["未处理 ","已忽略 ","解除故障","放弃维修"];//终止流程
    $scope.stmode=["未处理 ","待维修","等确认","维修中","维修清单确认","维修签字","已完成 "];
	$scope.level=undefined; $scope.keyword=undefined;$scope.sqobj=undefined;
    $scope.initData=function(){
      $scope.sqobj=undefined;
	  $http.get(ER.coldroot + '/i/warningMint/getWarningMintByRdcId',{params: {rdcId:window.localStorage.rdcId,status:$scope.status,level:$scope.level,keyword:$scope.keyword}}).success(function(data,status,config,header){
		  $scope.maintdata=data;
  	  });
    };
    //申请维修
    $scope.tol_forMaint=function(obj){
    	$scope.setp=2;$scope.sqobj=obj;
    };
    //删除
    $scope.tol_del=function(id){
    	 if(!confirm("您确信要刪除这条告警吗？")){return;}$http({method:'DELETE',url:ER.coldroot + '/i/warningMint/delMaintAlarmByIds',params:{'ids': id}}).success(function (data) {$scope.initData(); });
    };
    //忽略
    $scope.tol_ignore=function(id,status,msg){
    	if(!confirm(msg)){return;}$http({method: 'POST',url: ER.coldroot + '/i/warningMint/upMaintAlarmstatuByIds',params: {ids :id,userId: user.id,status:status}}).success(function (data) { $scope.initData();});
    };
    //确定维修 ~维修确认
    $scope.tol_goMaint=function(id,st,rep){
/*start*/
    	$scope.warids=id;$scope.st=st;$scope.rep=rep;
		if(!$scope.warids){return;}
		$scope.maintenance={note:"", cost:0.00,repairtime:null, bookingtime:null };
		$scope.initdata_first=function(){
			$http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 0}}).success(function(data){
		    	 $scope.pwartype=data;
		  	});
		    $http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 1}}).success(function(data){
		    	 $scope.subwartype=data;//默认二级菜单
		  	});
		    $http.get(ER.coldroot + '/i/warningMint/getWarningMintById',{params: {ids: $scope.warids,rdcId: window.localStorage.rdcId}}).success(function(data,status,config,header){
				  $scope.company=data.company;//公司信息
				  $scope.wuser=data.user;//维修人员信息
				  $scope.maintuser=$rootScope.user;//维修人
				  $scope.wardata=data.warData;//初始告警信息
				  $scope.cuttstatus=$scope.wardata[0].status;
                  $scope.desc = $scope.wardata[0].desc;
                  $scope.picPath = $scope.wardata[0].picPath.split(",");
		  	 });
		   
		};
		$scope.initdata_first();
		
		$scope.swartype=new Array();    $scope.nwardata=new Array();
		//查看/确认
			$http.get(ER.coldroot + '/i/warningMint/getMaintenanceByWId',{params: {wid: $scope.warids}}).success(function(data){
				$scope.maintenance=data;
				$scope.maintenance.repairtime=$scope.maintenance.repairtime.slice(0,19)
				$scope.maintenance.bookingtime=$scope.maintenance.bookingtime.slice(0,19)
				$("#wx").val($scope.maintenance.repairtime);
				$("#orderTime").val($scope.maintenance.bookingtime);
				$scope.nwardata=JSON.parse($scope.maintenance.faultmapper);
				$("input[id^='ck_server']").attr("disabled",true);
				angular.forEach($scope.maintenance.servertype.split(","),function(obj,i){
					$("#ck_server"+obj).attr("checked",true);
					$("#ck_server"+obj).parent().addClass("on");
				});
				angular.forEach($scope.nwardata,function(obj,i){
					$http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(data){
			    		 $scope.swartype[i]=data;
				  	 });
				}); 
			});
			
			$scope.tol_advice=function(isreject,status,msg){
				if(!confirm(msg)){return;}
				$http({method: 'POST',url: ER.coldroot + '/i/warningMint/rejectMaintenanceByWarId',params: {isreject:isreject, wid:$scope.warids, mid:$scope.maintenance.id, status:status}}).success(function (data) { 
					if(data){
						alert("提交成功！");
					}else{
						alert("提交失敗！流程已锁定！");
					}
					$scope.st=null;
					$scope.step=1;
					$scope.initData();
				});
			};
/*end*/
    };
	//维修清单签字确认
	$scope.tol_goMaintRepair = function(id, st,rep) {
		$scope.unit=[{id:1,name:'个'},{id:2,name:'套'},{id:3,name:'台'}];
		$scope.swartype=new Array();  $scope.faultmapper=new Array();//实际故障
		$scope.mwartype=new Array();  $scope.maintresult=new Array();//实际处理结果
		$scope.ordertype=new Array(); $scope.detailedList=new Array();//订单结果
		$scope.wids=id,$scope.st=st;$scope.maintid=null;$scope.rep=rep;
		$scope.cuttusertype=($scope.st==1&&(user.type==0||user.type>2));
		$http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 0}}).success(function(data){
	    	 $scope.pwartype=data;
	  	});
	    $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 1}}).success(function(data){
	    	 $scope.subwartype=data;//默认二级菜单
	  	});
	    //获得初始异常消息
	    $http.get( ER.coldroot + '/i/warningMint/getWarningMintById',{params: {ids: $scope.wids,rdcId:  $rootScope.rdcId}}).success(function(data,status,config,header){
			  $scope.company=data.company;//公司信息
			  $scope.wuser=data.user;//维修人员信息
			  $scope.maintuser=$rootScope.user;//维修人
			  $scope.wardata=data.warData;//初始告警信息
			  $scope.cuttstatus=$scope.wardata[0].status;
	  	 });
	    //获得附加异常消息   
	    $http.get( ER.coldroot + '/i/warningMint/getMaintenanceByWId',{params: {wid:$scope.wids}}).success(function(data){
			$scope.maintenance=data;
			$scope.maintid=$scope.maintenance.id;
			$scope.faultmapper=JSON.parse($scope.maintenance.faultmapper);
			angular.forEach($scope.faultmapper,function(obj,i){
				$http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(data){
		    		 $scope.swartype[i]=data;
			  	 });
			}); 
			 $scope.initMode();
		});
	    $scope.initMode=function(){
			$http.get( ER.coldroot + '/i/warningMint/getMaintconFirmaByMid',{params: {mid:$scope.maintid}}).success(function(data){
				if(data&&data.length>0){
					  $scope.maintconfirma=data[0];
					  $scope.cost=$scope.maintconfirma.cost;
					  $scope.note=$scope.maintconfirma.note;
					  $("#radio_service"+$scope.maintconfirma.serverType).attr("checked",true);
					  $("#begin").val( $scope.maintconfirma.starttime.slice(0,19));
					  $("#end").val( $scope.maintconfirma.endtime.slice(0,19));
					  $scope.phenomena=JSON.parse($scope.maintconfirma.phenomena);//实际现象
					  $scope.maintresult=JSON.parse($scope.maintconfirma.maintresult);//实际结果
					  if( $scope.maintresult.length>0){
						  angular.forEach( $scope.maintresult,function(obj,i){ 
							  $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(req){
						    		 $scope.mwartype[i]=req;
							  	 });
						  });
					  }
				  }
			  });
			  //获得订单详情
			  $http.get( ER.coldroot + '/i/warningMint/getMaintorderByMid',{params: {mid:$scope.maintid}}).success(function(data){
				  if(data.length>0){
					  angular.forEach(data,function(obj,i){ 
						  $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.wpid}}).success(function(req){
					    		 $scope.ordertype[i]=req;
						  	 });
					  });
					  $scope.detailedList=data;
				  }
			  });
			  $("#div_maintainRepair input").attr({"disabled":true});
			  if($scope.cuttstatus==6){
				  $('#star').raty({precision: true ,score: $scope.maintenance.score, size     : 24 });
				  $("#txt_evaluate").val($scope.maintenance.evaluate);
			  }else if($scope.cuttusertype){
				  $('#star').raty({precision: true ,score: 5, size     : 24, });
				  $scope.tol_advice=function(isreback,status,msg){
					  $http({method: 'POST',url:  ER.coldroot + '/i/warningMint/rejectMaintconfirmaById',
						  params: {  isreback:isreback, wid:$scope.wids, mid:$scope.maintid, status:status, score :$("#star input").val(), evaluate:$("#txt_evaluate").val()}}).success(function (data) { 
							if(data){alert("维修完成！");}else{alert("提交失敗！流程已锁定！");}
							$scope.st=null;
							$scope.initData();
						});
					  
				  };
			  }			  		  
	    }
	};
	//合并处理
	$scope.tol_batch=function(){
	   
    };
    $scope.totalfiles = [];
    $scope.addFiles = function (files) {
        for(var j=0,fileLen=files.length;j<fileLen;j++){
            var _file=files[j].name;
            var i=_file.lastIndexOf('.');
            var len=_file.length;
            var extEndName=_file.substring(i+1, len);
            var extName="GIF,BMP,JPG,JPEG,PNG";
            //首先对格式进行验证
            if(extName.indexOf(extEndName.toUpperCase())==-1) {
            	alert("只能上传"+extName+"格式的文件");
                return false
            }else if(files[j].size > 10485760){
                alert("最大只能上传10M的图片");
                return false
            }
        }
        if(files.length==0){return;};
        var allfiles = $scope.totalfiles.concat(files);
        if(allfiles.length>10){alert("最多选择10张！");return;}
        $scope.totalfiles=allfiles;
    };
    $scope.drophonor = function(honorfile){
        angular.forEach($scope.totalfiles,function(item, key){
            if(item == honorfile){
                $scope.totalfiles.splice(key,1);
                return false;
            }
        });
    };
    
    $scope.tol_submit=function(){//
        layer.open({
            type: 2
            ,content: '图片提交中，请稍后~~~'
            ,shadeClose:false
        });
        data={
            pic0:null,pic1:null,pic2:null,pic3:null,pic4:null,
            pic5:null,pic6:null,pic7:null,pic8:null,pic9:null,
            rdcId:$rootScope.rdcId,
            ids:$scope.sqobj.id ,
            userId: user.id,
            status:1,
            node:$("#tex_node").val()
        };
        for(i = 0; i < $scope.totalfiles.length; i++){
            data["pic" + i] = $scope.totalfiles[i];
        };
        Upload.upload({
            data: data,
            method:'post',
            url: ER.coldroot + '/i/warningMint/addMaintAlarmstatuByIds',
            headers: {'Content-Transfer-Encoding': 'utf-8'}
        }).then(function (resp) {
            layer.closeAll();
            alert('提交成功');
            $scope.tol_back(); $scope.initData();
        });
    };
    
    $scope.tol_back=function(){
    	$scope.setp=1;	$scope.sqobj=undefined;
    };
    
    $scope.isselall=false;//默认未选中
    $scope.tol_selallevt=function(isck){
    	for(var i=0;i<$scope.maintdata.length;i++){  
            if(isck===true){  
                $scope.maintdata[i].state=true;  
            }else {  
                $scope.maintdata[i].state=false;  
            }  
          } 
    };
    $scope.tol_selall_wx=function(isck){
    	for(var i=0;i<$scope.maintdata_notice.length;i++){  
    		if(isck===true){  
    			$scope.maintdata_notice[i].state=true;  
    		}else {  
    			$scope.maintdata_notice[i].state=false;  
    		}  
    	} 
    };

    /**
	 * **********************************************************************888**********************************************************************
	 * 
	 * 维修商js
	 * 
	 * 
	 */
    
    /**
     * maintenancenotice
     */
	$scope.initData_notice = function() {
		$http.get(ER.coldroot + '/i/warningMint/getWarningMintByRdcId', {
			params : {
				rdcId : window.localStorage.rdcId,
				status : $scope.status,
				level : $scope.level,
				keyword : $scope.keyword
			}
		}).success(function(data, status, config, header) {
			$scope.maintdata_notice = data;
		});
	};
	//$scope.initData_notice();
	//申请维修
	$scope.tol_forMaint_notice = function(id, st,rep) {
		/**
		 * 维修商初步确认
		 */
		$scope.warids=id;$scope.st=st;$scope.rep=rep;
		if(!$scope.warids){return;}
		$scope.maintenance={note:"", cost:0.00,repairtime:null, bookingtime:null };
		$scope.initdata_first=function(){
			$http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 0}}).success(function(data){
		    	 $scope.pwartype=data;
		  	});
		    $http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 1}}).success(function(data){
		    	 $scope.subwartype=data;//默认二级菜单
		  	});
		    $http.get(ER.coldroot + '/i/warningMint/getWarningMintById',{params: {ids: $scope.warids,rdcId: window.localStorage.rdcId}}).success(function(data,status,config,header){
				  $scope.company=data.company;//公司信息
				  $scope.wuser=data.user;//维修人员信息
				  $scope.maintuser=$rootScope.user;//维修人
				  $scope.wardata=data.warData;//初始告警信息
				  $scope.cuttstatus=$scope.wardata[0].status;
                  $scope.desc = $scope.wardata[0].desc;
                  $scope.picPath = $scope.wardata[0].picPath.split(",");
				  if(st==0){
					  jeDate({
						dateCell:"#wx",isinitVal:true,isTime:true, 
						format:"YYYY-MM-DD hh:mm:ss",minDate:jeDate.now(-7),maxDate: jeDate.now(0)
					  })
					  jeDate({
						dateCell:"#orderTime",isinitVal:true,isTime:true, 
						format:"YYYY-MM-DD hh:mm:ss",minDate: jeDate.now(0)
					  })
				  }
		  	 });
		};
		$scope.initdata_first();
		
		$scope.swartype=new Array();    $scope.nwardata=new Array();
		if($scope.st==0){//查看or 审批
		 	$scope.addSelect=function(){//添加故障
		 		var item={id:2,pid:1};
		 		var index=  $scope.nwardata.push(item);
		 		$scope.swartype[index-1]=$scope.subwartype;
		     };
		     $scope.removerSelect=function(index){ $scope.nwardata.splice(index,1); };
		     $scope.changepwartype=function(index,item){//修改类型
		    	 $http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: item.pid}}).success(function(data){
		    		 $scope.swartype[index]=data;
		    		 item.id=$scope.swartype[index][0].id;
			  	 });
		     };
			$scope.submit=function(){
				var servertype="";
				var em_servertype=$("[name ='service']:checked");
				if(em_servertype.length>0){for(var i=0;i<em_servertype.length;i++){servertype += em_servertype[i].value +","; } servertype=servertype.substring(0,servertype.length-1);}else{
					alert("请选择服务性质再提交~");
					return false
				}
				$scope.maintenance.servertype=servertype;
				$scope.maintenance.rdcid=$rootScope.rdcId;
				$scope.maintenance.warmappid=$scope.warids;
				$scope.maintenance.repairtime=$("#wx").val();
				$scope.maintenance.bookingtime=$("#orderTime").val();
				$scope.maintenance.faultmapper=JSON.stringify( $scope.nwardata);
			    $.ajax({type: 'POST',data: $scope.maintenance,url: ER.coldroot + "/i/warningMint/addMaintenance",success: function(data){
			            alert("维修确认单已发送！");
			            $scope.st = 2;
			            $scope.rep = null;
			            $scope.initData_notice();
			   }});				
			}
		}else{
			 //查看
			$http.get(ER.coldroot + '/i/warningMint/getMaintenanceByWId',{params: {wid: $scope.warids}}).success(function(data){
				$scope.maintenance=data;
				$scope.maintenance.repairtime=$scope.maintenance.repairtime.slice(0,19);
				$scope.maintenance.bookingtime=$scope.maintenance.bookingtime.slice(0,19);
//				$("#wx").val($scope.maintenance.repairtime.slice(0,19));
//				$("#orderTime").val($scope.maintenance.bookingtime.slice(0,19));
				$scope.nwardata=JSON.parse($scope.maintenance.faultmapper);
				$("input[id^='ck_server']").attr("disabled",true);
				angular.forEach($scope.maintenance.servertype.split(","),function(obj,i){
					$("#ck_server"+obj).attr("checked",true);
					$("#ck_server"+obj).parent().addClass("on");
				});
				angular.forEach($scope.nwardata,function(obj,i){
					$http.get(ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(data){
			    		 $scope.swartype[i]=data;
				  	 });
				}); 
			});
			
			$("#div_sh input").attr({"disabled":true});
			$scope.tol_advice=function(isreject,status,msg){
				if(!confirm(msg)){return;}
				$http({method: 'POST',url:ER.coldroot + '/i/warningMint/rejectMaintenanceByWarId',params: {isreject:isreject, wid:$scope.warids, mid:$scope.maintenance.id, status:status}}).success(function (data) { 
					if(data){alert("提交成功！");}else{alert("提交失敗！流程已锁定！");}
				});
			};
		}
		/*
		 * 初步确认end
		 * */
	};
	//维修清单确认
	//查看维修结果
    $scope.tol_ckrest=function(id){
    	$state.go('maintainRepair', {'ids':id,'st':1});
    };
	$scope.tol_gotRepair_notice = function(id, st,rep) {
		/**
		 * 维修商进一步确认
		 */
		$scope.unit=[{id:1,name:'个'},{id:2,name:'套'},{id:3,name:'台'}];
		$scope.swartype=new Array();  $scope.faultmapper=new Array();//实际故障
		$scope.mwartype=new Array();  $scope.maintresult=new Array();//实际处理结果
		$scope.ordertype=new Array(); $scope.detailedList=new Array();//订单结果
		$scope.wids=id,$scope.st=st;$scope.maintid=null;$scope.rep=rep;
		$scope.cuttusertype=($scope.st==1&&(user.type==0||user.type>2));
		$http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 0}}).success(function(data){
	    	 $scope.pwartype=data;
	  	});
	    $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: 1}}).success(function(data){
	    	 $scope.subwartype=data;//默认二级菜单
	  	});
	    //获得初始异常消息
	    $http.get( ER.coldroot + '/i/warningMint/getWarningMintById',{params: {ids: $scope.wids,rdcId:  $rootScope.rdcId}}).success(function(data,status,config,header){
			  $scope.company=data.company;//公司信息
			  $scope.wuser=data.user;//维修人员信息
			  $scope.maintuser=$rootScope.user;//维修人
			  $scope.wardata=data.warData;//初始告警信息
			  $scope.cuttstatus=$scope.wardata[0].status;
			  $scope.desc = $scope.wardata[0].desc;
              $scope.picPath = $scope.wardata[0].picPath.split(",");
	  	 });
	    //获得附加异常消息   
	    $http.get( ER.coldroot + '/i/warningMint/getMaintenanceByWId',{params: {wid:$scope.wids}}).success(function(data){
			$scope.maintenance=data;
			$scope.maintid=$scope.maintenance.id;
			$scope.faultmapper=JSON.parse($scope.maintenance.faultmapper);
			angular.forEach($scope.faultmapper,function(obj,i){
				$http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(data){
		    		 $scope.swartype[i]=data;
			  	 });
			}); 
			 $scope.init_repair();
		});
		
	    $scope.init_repair=function(){
	 		if( $scope.st==0){//服务新建维修单
				 $scope.cuttstatus=4;
				 jeDate({dateCell:"#begin",isinitVal:true,isTime:true, format:"YYYY-MM-DD hh:mm:ss",minDate: jeDate.now(-7),maxDate: jeDate.now(0)})
			 	 jeDate({dateCell:"#end",isinitVal:true,isTime:true, format:"YYYY-MM-DD hh:mm:ss",minDate: jeDate.now(0)})
				//1.实际故障联动
				$scope.addfSelect=function(){//添加故障
			 		var item={id:2,pid:1};
			 		var index=  $scope.faultmapper.push(item);
			 		$scope.swartype[index-1]=$scope.subwartype;
			     };
			     $scope.removerfSelect=function(index){ $scope.faultmapper.pop(index); };
			     $scope.changefselecttype=function(index,item){//修改类型
			    	 $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: item.pid}}).success(function(data){
			    		 $scope.swartype[index]=data;
			    		 item.id=$scope.swartype[index][0].id;
				  	 });
			     };
			     //2.实际维修联动
			     $scope.addmSelect=function(){//添加故障
				 		var item={id:2,pid:1};
				 		var index=  $scope.maintresult.push(item);
				 		$scope.mwartype[index-1]=$scope.subwartype;
			    };
				$scope.removermSelect=function(index){ $scope.maintresult.pop(index); };
				$scope.changemselecttype=function(index,item){
					 $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: item.pid}}).success(function(data){
			    		 $scope.mwartype[index]=data;
			    		 item.id=$scope.mwartype[index][0].id;
				  	 });
				};
				//3.订单详情order
				 $scope.uplist=function(isadd,index){
					if(isadd){	
						var obj={wpid:1,wid:2,number:1,price:0.00,unit:1,rdcId:$rootScope.rdcId,maintid:$scope.maintenance.id};
						 index=$scope.detailedList.push(obj);
						 $scope.ordertype[index-1]=$scope.subwartype;
					}else{
						$scope.detailedList.pop(index);
				 }};
		         $scope.changeordertype=function(index,item){//修改清单父级选项
		        	 $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: item.wpid}}).success(function(data){
			    		 $scope.ordertype[index]=data;
			    		 item.wid=$scope.ordertype[index][0].id;
				  	 });
			     };
			     $scope.note="";
				$scope.cost=0.00;
				var watch =$scope.$watch('detailedList', function(){ $scope.cost=0; angular.forEach($scope.detailedList,function(obj,i){  $scope.cost+=obj.number*obj.price;}); },true);//监听
				$scope.$on('$destroy',function(){  watch;});
				//提交维修清单 
				$scope.addMaintenance=function(){
					var servertype="";
					var em_servertype=$("[name ='service']:checked");
					if(em_servertype.length>0){for(var i=0;i<em_servertype.length;i++){servertype += em_servertype[i].value +","; } servertype=servertype.substring(0,servertype.length-1);}
					var vo ={ 
							wids:$scope.wids,
							 rdcId:$rootScope.rdcId ,
							 maintid:$scope.maintid,
							 starttime:$("#begin").val(),
							 endtime:$("#end").val(),
							 phenomena:JSON.stringify($scope.faultmapper),
							 maintresult:JSON.stringify($scope.maintresult),
							 detaileds:JSON.stringify($scope.detailedList),
							 cost:$scope.cost,
							 note:$("#notes").val(),
							 serverType:servertype
				  };
				  $http({ method:'POST', params: vo,  url: ER.coldroot + '/i/warningMint/addMaintConfirma' }).success(function(data){ 
					  alert(data?"提交成功！":"提交失败");
					  $scope.st = $scope.rep =null;
					  $scope.initData_notice();
					 // $state.go("maintenancenotice");
				  }) ;
				}; 
			}else{//查看
			  $http.get( ER.coldroot + '/i/warningMint/getMaintconFirmaByMid',{params: {mid:$scope.maintid}}).success(function(data){
				if(data&&data.length>0){
					  $scope.maintconfirma=data[0];
					  $scope.cost=$scope.maintconfirma.cost;
					  $scope.note=$scope.maintconfirma.note;
					  $("#radio_service"+$scope.maintconfirma.serverType).attr("checked",true);
					  $("#begin").val( $scope.maintconfirma.starttime.slice(0,19));
					  $("#end").val( $scope.maintconfirma.endtime.slice(0,19));
					  $scope.phenomena=JSON.parse($scope.maintconfirma.phenomena);//实际现象
					  $scope.maintresult=JSON.parse($scope.maintconfirma.maintresult);//实际结果
					  if( $scope.maintresult.length>0){
						  angular.forEach( $scope.maintresult,function(obj,i){ 
							  $http.get( ER.coldroot + '/i/warningMint/getWarningType',{params: {pid: obj.pid}}).success(function(req){
						    		 $scope.mwartype[i]=req;
							  	 });
						  });
					  }
				  }
			  });
			  //获得订单详情
			  $http.get( ER.coldroot + '/i/warningMint/getMaintorderByMid',{params: {mid:$scope.maintid}}).success(function(data){
				  if(data.length>0){
					  angular.forEach(data,function(obj,i){ 
						  $http.get('/i/warningMint/getWarningType',{params: {pid: obj.wpid}}).success(function(req){
					    		 $scope.ordertype[i]=req;
						  	 });
					  });
					  $scope.detailedList=data;
				  }
			  });
			  $("#div_maintainRepair input").attr({"disabled":true});
			
			  if($scope.cuttstatus==6){
				  $('#star').raty({precision: true ,score: $scope.maintenance.score, size: 24 });
				  $("#txt_evaluate").val($scope.maintenance.evaluate);
			  }else if($scope.cuttusertype){
				  $("#txt_evaluate").attr({"disabled":false});
				  $('#star').raty({precision: true ,score: 5, size: 24, });
				  $scope.tol_advice=function(isreback,status,msg){
					  $http({method: 'POST',url:  ER.coldroot + '/i/warningMint/rejectMaintconfirmaById',
						  params: {  isreback:isreback, wid:$scope.wids, mid:$scope.maintid, status:status, score :$("#star input").val(), evaluate:$("#txt_evaluate").val()}}).success(function (data) { 
							if(data){alert("维修完成！");}else{alert("提交失敗！流程已锁定！");}
							$scope.initData_notice();
						});
				  };
			  }
			} 
	    };
		/*
		 * 进一步确认end
		 * */
	};
	//清除故障
	$scope.tol_ignore_notice = function(id, status, msg) {
		if (!confirm(msg)) {
			return;
		}
		$http({
			method : 'POST',
			url : ER.coldroot + '/i/warningMint/upMaintAlarmstatuByIds',
			params : {
				ids : id,
				userId : null,
				status : status
			}
		}).success(function(data) {
			$scope.initData_notice();
		});
	};
	//合并处理
    $scope.tol_batch_notice=function(){
	   alert('开发ing')
    };
	 /**
     * maintenancenotice
     */
	/**
	 * **********************************************************************666**********************************************************************
	 * 
	 * 维修商js end
	 * 
	 * 
	 */
	function checkInput() {
        var flag = true;
        // 检查必须填写项
        if ($scope.unitname == undefined || $scope.unitname == '') {flag = false;}
		if ($scope.reason == undefined || $scope.reason == '') {flag = false;}
		if ($scope.ordertime == undefined || $scope.ordertime == '') {flag = false;}
        return flag;
    }
    
    $scope.$watch('rdcId',$scope.initMainit,true);//监听冷库变化
    $scope.initPic = function () {
        baguetteBox.run('.baguetteBoxOne', {animation: 'slideIn', buttons: true});
    };
    $scope.initPic();
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        baguetteBox.run('.baguetteBoxOne', {buttons: true});
        imgBoxHide()
    });
});

