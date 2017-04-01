coldWeb.controller('roleManage', function ($scope, $state, $cookies, $http, $location) {
	
	//==================================================================================================================================================================
	$scope.selobjid=null;$scope.gluser=null;$scope.glrdc=null;$scope.glsuer=null;
	$scope.slmode=[{name:"RDC",value:"0"},{name:"RUA",value:"1"},{name:"USER",value:"2"},{name:"ROLE",value:"3"},{name:"GROUP",value:"4"}];
	$scope.tablemode=[[["name"],["冷库名称"]],[["uname","cname"],["用户名","冷库名称"]],[["name"],["用户名"]],[["name"],["角色名称"]],[["name"],["组名称"]]];
	$scope.type=$scope.slmode[0].value,$scope.colem1="name",$scope.colem2="name", $scope.keyword=null;
	
	$scope.checkall=function(){ var  checkAll=$("#div_ml input[type=checkbox]"); for(var i=0; i<checkAll.length; i++){ checkAll[i].checked=true; 
	checkAll[i].disabled= false;
	$(checkAll[i]).removeClass("ckdis");
	
	}};
	$scope.changenaclruMode=function(user){$scope.gluser=user;$("#tb_ruu_body tr").removeClass("seclectTr");$("#tr_ruu_"+user.id).addClass("seclectTr");};
	$scope.changenaclrdMode=function(rdc){$scope.glrdc=rdc;$("#tb_rur_body tr").removeClass("seclectTr");$("#td_rur_"+rdc.id).addClass("seclectTr");};
	$scope.initruaclrdc = function(key){$scope.glrdc=null;$http({method : 'POST',url : 'i/acl/getObjByType',params : {type :0,keyword : key,row:5}}).success(function(data) {	$scope.rurdcs = data;});};
	$scope.initruacluser= function(key){$scope.gluser=null;$http({method : 'POST',url : 'i/acl/getObjByType',params : {type :2,keyword :key,row:5}}).success(function(data) {$scope.ruusers = data;});};
	$scope.addruacl=function(){
		if($scope.gluser!=null&&$scope.glrdc!=null){
			var mapper='{"uname":"'+$scope.gluser.name+'","cname":"'+$scope.glrdc.name+'"}';
			$http({method : 'POST',url : 'i/acl/addruMapper',params : { rdcid:$scope.glrdc.id, userid:$scope.gluser.id, mapper :mapper }}).success(function(data) {if(!data){	alert("关联失败！已经存在关联权限！");}$scope.initData(false);});
		}
	};
	$scope.initData=function(isrload){
		   $scope.selobjid=null; $scope.objnacl = null;
			$http({method : 'POST',url : 'i/acl/getObjByType',params : {type : $scope.type,keyword : $scope.keyword}}).success(function(data) {
				if( $scope.type==1){
					if(!isrload){
						$scope.initruaclrdc();
						$scope.initruacluser();
					}
					var mapper=null,alldata=[];
					 angular.forEach(data,function(obj,i){
						 mapper=angular.fromJson(obj.name); obj.cname=mapper.cname; obj.uname=mapper.uname; alldata.push(obj);
					  });
					 data=null;data=alldata;
				}
				$scope.objDataList = data;
			});
	};
	
	$scope.changenaclMode=function(obj){	
		if(obj!=null&&obj!=undefined){
			$scope.selobjid=obj.id;
			 $scope.objnacl = null;
			$scope.checkall();
			$("#tb_body tr").removeClass("seclectTr");
			$("#tr_row_"+obj.id).addClass("seclectTr");
		    $http({method : 'POST',url : 'i/acl/getObjNACLByTID',params : {type : $scope.type,id :obj.id,oid:obj.rdcid}}).success(function(data) {
			  $scope.objnacl = data;
//			  if($scope.objnacl.length>0){
				  if($scope.objnacl.nacl!=undefined&& $scope.objnacl.nacl.length>0&&$scope.objnacl.nacl[0].nacl!=undefined&&$scope.objnacl.nacl[0].nacl!=""){
				      var nacl=$scope.objnacl.nacl[0].nacl.split(",");
					  angular.forEach(nacl,function(obj,i){
						  $("#div_ml input[aid='"+obj+"']").attr("checked", false); $("#div_ml input[pid='"+obj+"']").attr("checked", false);
					  });
			      }
			    if($scope.objnacl.dacl!=undefined&&$scope.objnacl.dacl.length>0&&$scope.objnacl.dacl[0].nacl!=undefined&&$scope.objnacl.dacl[0].nacl!=""){
			      var nacl=$scope.objnacl.dacl[0].nacl.split(",");
				   angular.forEach(nacl,function(obj,i){
					  $("#div_ml input[aid='"+obj+"']").attr("checked", false).attr("disabled", true).addClass("ckdis");  // 
					  $("#div_ml input[pid='"+obj+"']").attr("checked", false).attr("disabled", true).addClass("ckdis");
				  });
		        }
//			  }
		  });}
	};
	
	$scope.saveacl=function(){
		  var newacl=[];
		  var nalcinput=$("#div_ml input[type=checkbox]").not("input:checked");  
		  if(nalcinput.length==0){
			newacl=null;
		  }else{
			for(var i=0; i<nalcinput.length; i++){
				var em=$(nalcinput[i]),pid=em.attr("pid"), aid= em.attr("aid");
				if(pid==0){
					newacl.push(aid);
				}else{
					if(newacl.indexOf(pid)==-1){newacl.push(aid);}
				}
			}
		  }
		  if($scope.selobjid){
			  var id=$scope.objnacl.nacl.length>0?$scope.objnacl.nacl[0].id:null;
			  $http({method : 'POST',url : 'i/acl/upObjNACLByTID',params : {type : $scope.type,id : id,oid:$scope.selobjid,nacl:newacl }}).success(function(data) {
				  alert(data?"保存成功！":"保存失败！");
				  $scope.initData();
				 // $scope.changenaclMode($scope.selobjid);
			  });
		  }
	};
	$scope.initData();
	$scope.checkall();
	//========================================================================================================================================================================================


	//zTreeObj
	var zTreeObj=null;$scope.tretype=4;$scope.ztrmode=[[],[],[],["添加用户","删除用户"],["添加角色","删除角色"],["添加组","删除组"]];//
	$scope.ztisnone=0;$scope.ztaddobj="";
	$scope.cksuser=function(ruu){	$("#stb_ruu_body tr").removeClass("seclectTr");$("#stting_ruu_"+ruu.id).addClass("seclectTr");$scope.glsuer=ruu;};
	$scope.inittru=function(filter){	$scope.glsuer=null;$http({method : 'POST',url : 'i/acl/getObjByType',params : {type :2,keyword :filter,row:20}}).success(function(data) {$scope.susers = data;});};
	function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
		if($scope.ztisnone<3){	var nodes = zTreeObj.getNodes();   for (var i = 0; i < nodes.length; i++) { zTreeObj.expandNode(nodes[i], true, false, true); } $scope.ztisnone++;}
	};
	function zTreeOnClick(event, treeId, treeNode) {
		if(treeNode!=null){
			$scope.tretype=treeNode.type;
			$("#tre_del_obj").html($scope.ztrmode[$scope.tretype][1]);
			$("#tre_add_obj").html($scope.ztrmode[$scope.tretype][0]);
		}
	};
	
	$scope.inittre=function(){
		if(zTreeObj!=null){return;}
		$scope.inittru();
		var setting = {
				view: {selectedMulti: false},
				async: {
					enable: true,
					url:"i/acl/getTreeNode",
					autoParam: ["id","pid","gid", "type","rtype","hastc"],
				},callback: {
					onClick: zTreeOnClick,
					onAsyncSuccess: zTreeOnAsyncSuccess
				}
			};
		zTreeObj=$.fn.zTree.init($("#treeDemo"), setting);
	};
	
	
	$('.role_on_off').click(function(event) {				
				if ($(this).parents(".filter").hasClass('current')) {
					$(this).parents(".filter").removeClass('current');
				} else {
					$(this).parents(".filter").addClass('current');
					$(this).parents(".filter").siblings(".filter").removeClass('current');
				}
	});
	$(".filter input:checkbox").click(function(event) {
		var pid=$(this).attr("pid"), em= "#mid_"+$(this).attr("mid");
		if(this.checked){    
			if(pid==0){//父节点
				 var  checkAll=$(em+" .role_list input:checkbox");
				 for(var i=0; i<checkAll.length; i++){ checkAll[i].checked=true;}
				 window.Event.returnValue = false;
			}else{//子节点
				 var  checkAll=$(em+" .oneFilter input:checkbox");
				 for(var i=0; i<checkAll.length; i++){ checkAll[i].checked=true;}
				 window.Event.returnValue = false;
			}
	    }else{    
	    	if(pid==0){//父节点
	    		 var  checkAll=$(em+" .role_list input:checkbox");
				 for(var i=0; i<checkAll.length; i++){ checkAll[i].checked=false;}
				 window.Event.returnValue = false;
			}else{
				 var  ckdlength=$(em+" .role_list input:checkbox:checked").length;
				 if(ckdlength==0){
					 var  checkAll=$(em+" .oneFilter input:checkbox");
					 for(var i=0; i<checkAll.length; i++){ checkAll[i].checked=false;}
					 window.Event.returnValue = false;
				 }
			}
	    } 
	});
	//==================================================================================================================================================================
});
