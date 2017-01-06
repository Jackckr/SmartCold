coldWeb.controller('personalComment', function ($rootScope, $scope, $state, $cookies, $http, $location) {
	$scope.load = function(){
		 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/findUser'}).success(function(data,status,config,headers){
			$rootScope.user = data;
			if($rootScope.user == undefined || $rootScope.user.id == 0){
				url = "http://" + $location.host() + ":" + $location.port();
				window.location.href = url;
			}
	    })
    }
    $scope.load();
	 // 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 0;
    // 当前页
    $scope.bigCurrentPage = 1;
    
	$scope.getComments = function() {
    	$http.get('/i/comment/findCommentsByUserId', {
            params: {
                "userID": $rootScope.user.id,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.percommentsDto = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	$scope.pageChanged = function() {
		$scope.getComments();
	}
	$scope.getComments();
	
	$scope.goModal = function (obj) {
   	 	//console.log("rdcID" + rdcID);
        $('#my_Modal').modal('show');
        $http.get("/i/comment/getCommentById", {
            params: { 'id': obj.commentdto.id }
        }).success(function (data) {
        	 if(data.success){
        		  var data = data.entity;
			       $scope.id=data.data.id;
				   $scope.rdcLogo=data.rdc.logo;//冷库图片
				   $scope.name=data.rdc.name;//冷库名
				   $scope.content=data.data.content; //评价具体内容
				   $scope.grade=data.data.grade;
				   $scope.time=formatCSTDate(data.data.addTime,"yyyy-MM-dd hh:mm:ss"); //评价具体时间
				   $scope.pics=data.img; //评价图片
			   }else{
			       alert("获取数据失败！");// goback();
			   } 
        });
    };
    $scope.goDetail = function (rdcID) {
    	console.log("rdcID" + rdcID);
    	$state.go('coldStorageComment', {"rdcID": rdcID});
    };
	
	
	$scope.goDeleteComment = function(commentID){
    	var r=confirm("删除评价？");
    	if(r){
    		$http({
    			method:'DELETE',
    			url:'/i/comment/deleteByCommentID',
    			params:{
    				'commentID':commentID
    			}
    		}).success(function (data) {
				//alert("删除成功");
				$state.reload(); 
        });
    	}
    }
});

//格式化CST日期的字串
function formatCSTDate(strDate,format){
  return formatDate(new Date(strDate),format);
}
 
//格式化日期,
function formatDate(date,format){
  var paddNum = function(num){
    num += "";
    return num.replace(/^(\d)$/,"0$1");
  }
  //指定格式字符
  var cfg = {
     yyyy : date.getFullYear() //年 : 4位
    ,yy : date.getFullYear().toString().substring(2)//年 : 2位
    ,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
    ,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
    ,d  : date.getDate()   //日 : 如果1位的时候不补0
    ,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
    ,hh : date.getHours()  //时
    ,mm : paddNum(date.getMinutes()+0) //分
    ,ss : paddNum(date.getSeconds()+0) //秒
  }
  format || (format = "yyyy-MM-dd hh:mm:ss");
  return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
} 