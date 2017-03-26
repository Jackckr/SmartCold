coldWeb.controller('roleManage', function ($scope, $state, $cookies, $http, $location) {
	$scope.mode=[[{name:"RDC",value:"0"},{name:"user",value:"1"},{name:"role",value:"2"},{name:"Group",value:"3"}],["RDC名称","用户名","角色名称","组名称",""]];
	$scope.type=$scope.mode[0][0].value,$scope.keyword=null;
	$scope.selobjid=null;
	
	$scope.checkall=function(){
		 var  checkAll=$("#div_ml input[type=checkbox]");
		 for(var i=0; i<checkAll.length; i++){ checkAll[i].checked=true;}
	};
	
	
	$scope.initData=function(){
		   $scope.selobjid=null; $scope.objnacl = null;
			$http({method : 'POST',url : 'i/acl/getObjByType',params : {type : $scope.type,keyword : $scope.keyword}}).success(function(data) {
				$scope.objDataList = data;
			});
	};
	
	$scope.changenaclMode=function(id){	
		if(id&&id!=""){
			$scope.selobjid=id;
			 $scope.objnacl = null;
			$scope.checkall();
			$("#tb_body tr").removeClass("seclectTr");
			$("#tr_row_"+id).addClass("seclectTr");
		    $http({method : 'POST',url : 'i/acl/getObjNACLByTID',params : {type : $scope.type,id :id}}).success(function(data) {
			  $scope.objnacl = data;
			  if($scope.objnacl.length>0){
				      var nacl=$scope.objnacl[0].nacl.split(",");
					  angular.forEach(nacl,function(obj,i){
						  $("#div_ml input[aid='"+obj+"']").attr("checked", false); $("#div_ml input[pid='"+obj+"']").attr("checked", false);
					  });
			  }
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
			  var id=$scope.objnacl.length>0?$scope.objnacl[0].id:null;
			  $http({method : 'POST',url : 'i/acl/upObjNACLByTID',params : {type : $scope.type,id : id,oid:$scope.selobjid,nacl:newacl }}).success(function(data) {
				  alert(data?"保存成功！":"保存失败！");
				  $scope.changenaclMode($scope.selobjid);
			  });
			  
		  }
		
		
		 
			
//		  if( $scope.objnacl&&$scope.type){ }
	};
	
	
	$scope.initData();
	$scope.checkall();
	
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
});
