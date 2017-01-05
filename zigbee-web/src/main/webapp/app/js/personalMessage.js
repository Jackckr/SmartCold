coldWeb.controller('personalMessage', function ($rootScope, $scope, $state, $cookies, $http, $location) {
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
	$scope.getMsgs = function() {
    	$http.get('/i/message/findMessageByUserId', {
            params: {
                "userID": $rootScope.user.id,
                pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize
            }
        }).success(function (data) {
        	$scope.msgs = data.data;
        	$scope.bigTotalItems = data.total;
        });
	}
	
	$scope.pageChanged = function() {
		$scope.getRdcs();
	}
	$scope.getMsgs();
	$scope.goShowMsg = function (obj) {
		console.log(obj+'------'+obj.oid)
	   $scope.appmode=[{title:["","货品","配送","冷库"]}];//1:货品 2：配送 3:仓库
	   $http.get("/i/orders/findOrderByOrderId",  { params: {id:obj.oid,uid:obj.userid}  })
	   .success(function(data) { //获得数据
		 if(data.success){
			   $scope.rsd=data.entity.rsd; //发布的信息
			   $scope.orders=data.entity.orders; //联络单信息
			   $scope.ownerUser=data.entity.ownerUser; //发布者信息
			   $scope.orderUser=data.entity.orderUser; //联络单者信息
			   $scope.orders.generatetime=formatCSTDate($scope.orders.generatetime,"yyyy-MM-dd hh:mm:ss")
			    if($scope.rsd){
			       $('#order_Modal').modal('show');
			       $scope.datatype=$scope.rsd.dataType;
			       $scope.typetitle=$scope.appmode[0].title[$scope.datatype]+data.entity.rsd.typeText;
			    }else{
			      alert("商品信息已失效！");
			    }
		   }else{
		       alert("获取数据失败！");// goback();
		   }
       });
	}
	$scope.getTeleNum = function () {
    	$http.get("/i/orders/getTelephone", {
    	    params: {
    	        orderid : $scope.orders.id,
    	    	ownerTele: $scope.orders.ownertele,
    	    	userTele : $scope.orders.usertele,
    	    	ownerName : $scope.orders.ownername,
    	    	userName : $scope.orders.username
    	    }
    	}).success(function (data) {
     		alert("对方联系人的手机号已经发送到您的手机，请及时联系");
    	});
    };
	$scope.deleteMsg = function(msgID){
	    	var r=confirm("删除消息？");
	    	if(r){
	    		$http({
	    			method:'DELETE',
	    			url:'/i/message/deleteMessage',
	    			params:{
	    				'msgID':msgID
	    			}
	    		}).success(function (data) {
    				//alert("删除成功");
    				$state.reload(); 
            });
	    	}
	    }
	    
});

