coldWeb.controller('commentManage', function ($scope, $state, $cookies, $http, $location) {
	$scope.optAudit = '8';
	// 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
	$scope.comments = [];
	$scope.getComments = function(){
		$scope.selected = [];
	    $http({
	    	method:'POST',
	    	url:'/i/comment/findByPage',
	    	params:{
	    		pageNum : $scope.bigCurrentPage,
	    		pageSize : $scope.maxSize,
	    		keyword:$scope.keyword
	    	}}).success(function (data) {
	    	 $scope.bigTotalItems = data.total;
		     $scope.comments = data.list;
	    });
	}
    
    $scope.pageChanged = function () {
    	 $scope.getComments();
    }
    $scope.getComments();


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

    $scope.deleteComment = function(id){
    	var r=confirm("删除评论？");
    	if(r){
	    	$http({
	    		method:'DELETE',
	    		url:'/i/comment/deleteCommentByID',
	    		params:{
	    			'id':id
	    		}
	    	}).success(resDelRdc);
    	}
    }
    
    $scope.deleteComments = function(){
    	var r=confirm("批量删除评论？");
    	if(r){
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
    
    $scope.goSearch = function(){
    	$scope.getComments();
    }
});