coldWeb.controller('commentManage', function ($scope, $state, $cookies, $http, $location) {
	$scope.optAudit = '8';
	$scope.comments = [];
	$scope.initTable = function(pageNum,pageSize){
		    $http({method:'POST',url:'/i/comment/findByPage',params:{pageNum : pageNum,pageSize : pageSize}}).success(function (data) {
		    	 $scope.bigTotalItems = data.total;
			      $scope.comments = data.list;
		    });
	}
    // 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
    $scope.pageChanged = function () {
    	 $scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    }
    $scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    // 获取当前冷库的列表
    $scope.auditChanged = function(optAudiet){
    	$scope.initTable($scope.bigCurrentPage, $scope.maxSize);
    }

    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });

    
    $scope.selected = [];
    $scope.toggle = function (rdc, list) {
		  var idx = list.indexOf(rdc);
		  if (idx > -1) {
		    list.splice(idx, 1);
		  }
		  else {
		    list.push(rdc);
		  }
    };
    $scope.exists = function (rdc, list) {
    	return list.indexOf(rdc) > -1;
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.comments.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.comments.length) {
        	$scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        	$scope.selected = $scope.comments.slice(0);
        }
    };


    $scope.goRdcMap = function () {
        $state.go('coldStorageMap', {});
    }

    

    $scope.goEditRdc = function (rdcID) {
        $state.go('coldStorageEdit', {"rdcID": rdcID});
    }
    
    $scope.deleteComment = function(id){
    	$http({
    		method:'DELETE',
    		url:'/i/comment/deleteCommentByID',
    		params:{
    			'id':id
    		}
    	}).success(resDelRdc);
    }
    
    $scope.deleteComments = function(){
    	var ids = $scope.getIDsFromSelected();
    	if(ids.length >0 ){
    		$http({
    			method:'DELETE',
    			url:'/i/comment/deleteByIds',
    			params:{
    				'ids': ids
    			}
    		}).success(resDelRdc);
    	}
    }
    
    $scope.getIDsFromSelected = function(audit){
    	var ids = [];
    	for(i in $scope.selected){
    		ids.push($scope.selected[i].id);
    	}
    	return ids;
    }
    
    function resDelRdc(data){
    	if(data.status == 0){
			alert("删除成功");
			location.reload();
		}
    }
    
    $scope.goAddRdc = function () {
        $http.get('/i/user/findUser').success(function(data){
            $rootScope.user = data;
            if($rootScope.user == null || $rootScope.user.id == 0){
                url = "http://" + $location.host() + ":" + $location.port() + "/login.html#/coldStorageAdd";
                window.location.href = url;
            } else {
                $location.path("/coldStorageAdd");
            }
        })
    }
});