coldWeb.controller('maintenancealarm', function ($rootScope, $scope,$stateParams, $state, $cookies, $http, $location,baseTools,Upload) {
	$scope.st=$stateParams.st;
	if($scope.st==1||$scope.st==2){var statusmode=["0","0,1,2,3,4,5","6"];$scope.status=statusmode[$scope.st];}else{return;}
	$scope.setp=1;
	$scope.remode=["未处理 ","已忽略 ","解除故障","放弃维修"];//终止流程
	$scope.stmode=["未处理 ","待维修","等确认","维修中","维修清单确认","清单审核","已完成 "];//正常流程
	$scope.level=undefined; $scope.keyword=undefined;$scope.sqobj=undefined;
    $scope.initData=function(){
      $scope.sqobj=undefined;
	  $http.get('/i/warningMint/getWarningMintByRdcId',{params: {rdcId: $rootScope.rdcId,status:$scope.status,level:$scope.level,keyword:$scope.keyword}}).success(function(data,status,config,header){
		  $scope.maintdata=data;
  	  });
    };
    $scope.initData();
    //申请维修
    $scope.tol_forMaint=function(obj){
    	$scope.setp=2;$scope.sqobj=obj;
    };
    //删除
    $scope.tol_del=function(id){
    	 if(!confirm("您确信要刪除这条告警吗？")){return;}$http({method:'DELETE',url:'/i/warningMint/delMaintAlarmByIds',params:{'ids': id}}).success(function (data) {$scope.initData(); });
    };
    //忽略
    $scope.tol_ignore=function(id,status,msg){
    	if(!confirm(msg)){return;}$http({method: 'POST',url: '/i/warningMint/upMaintAlarmstatuByIds',params: {ids :id,userId: $rootScope.user.id,status:status}}).success(function (data) { $scope.initData();});
    };
    //确定维修 ~维修确认
    $scope.tol_goMaint=function(id,st){$state.go('maintainRequest', {'ids': id,st:st}); };
    //维修清单确认
    $scope.tol_goMaintRepair=function(id,st){$state.go('maintainRepair', {'ids': id,st:st});};
    
    //合并处理
    $scope.tol_batch=function(){
	   
    };
    //查看维修结果
    $scope.tol_ckrest=function(id){
    	$state.go('maintainRepair', {'ids':id,'st':1});
    };
    //图片上传
    $scope.totalhonorfiles = [];
    $scope.addHonorFiles = function (files) {
        if($scope.totalhonorfiles.length + files.length > 10){
            alert("最多上传十张图片");
            return;
        }
        $scope.totalhonorfiles = $scope.totalhonorfiles.concat(files);
        getpics();
    }
    $scope.drophonor = function(honorfile){
        angular.forEach($scope.totalhonorfiles,function(item, key){
            if(item == honorfile){
                $scope.totalhonorfiles.splice(key,1);
            }
        })
        getpics();
    }
    //建立一个可存取到该file的url
    function getObjectURL(file) {
        var url = null ;
        if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        } else if (window.createObjectURL!=undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        }
        return url ;
    }
    function getpics() {
        $scope.pics=[];
        angular.forEach($scope.totalhonorfiles,function (item, index) {
            var pic=new Object();
            pic.path = getObjectURL(item);
            pic.file=item;
            $scope.pics = $scope.pics.concat(pic);
        });
    }
    $scope.tol_submit=function(){//
       data={
            pic0:null,
            pic1:null,
            pic2:null,
            pic3:null,
            pic4:null,
            pic5:null,
            pic6:null,
            pic7:null,
            pic8:null,
            pic9:null,
            rdcId:$rootScope.rdcId,
            ids:$scope.sqobj.id ,
            userId: $rootScope.user.id,
            status:1,
            node:$("#tex_node").val()
        }
        for(i = 0; i < $scope.totalhonorfiles.length; i++){
            data["pic" + i] = $scope.totalhonorfiles[i];
        }
        Upload.upload({
            data: data,
            method:'post',
            url: '/i/warningMint/addMaintAlarmstatuByIds',
            headers: {'Content-Transfer-Encoding': 'utf-8'}
        }).then(function (resp) {
            $scope.tol_back(); $scope.initData();
        });
    	/*$http({
    		method: 'POST',
    		url: '/i/warningMint/upMaintAlarmstatuByIds',
    		params: {ids:$scope.sqobj.id ,userId: $rootScope.user.id,status:1,node:$("#tex_node").val()}
    	}).success(function (data) {  $scope.tol_back(); $scope.initData();});*/
    };
    
    $scope.tol_back=function(){
    	$scope.setp=1;	$scope.sqobj=undefined;
    };
    
    $scope.isselall=false;
    $scope.tol_selallevt=function(isck){
//    	$('#tb_body input[name="ck_obj"]').attr("checked",true);
    };
    
});

