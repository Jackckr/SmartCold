/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('storageRelate', function ($rootScope, $scope, $state, $cookies, $http, $location, $stateParams) {
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	$scope.companyId = $stateParams.companyId;

	$scope.optAudit = '8';
	// 显示最大页数
    $scope.maxSize = 10;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;
	$scope.rdcs = [];
	$scope.getRdcs = function(){
		$scope.selected = [];
		var data = {
	    		pageNum : $scope.bigCurrentPage,
	    		pageSize : $scope.maxSize, 
	    		audit:$scope.optAudit,
	    		keyword:$scope.keyword
	    	};
		var serData = $.param(data);
	    $http({
	    	method:'POST',
	    	url:'/i/rdc/findRdcDTOByPage',
	    	data:$.param(data)
	    }).success(function (data) {
	    	 $scope.bigTotalItems = data.total;
		     $scope.rdcs = data.list;
	    });
	}

	$scope.findCompanyById = function () {
		var data = {
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/findCompanyById',
			data:$.param(data)
		}).success(function (data) {
			$scope.companyName = data.name;
		});
	}
	$scope.findCompanyById();
    
    $scope.pageChanged = function () {
    	 $scope.getRdcs();
    }
    $scope.getRdcs();
    // 获取当前冷库的列表
    $scope.auditChanged = function(optAudiet){
    	$scope.getRdcs();
    }

    $http.get('/i/city/findProvinceList').success(function (data) {
        $scope.provinces = data;
    });

    $scope.goSearch = function () {
        $scope.getRdcs();
    }

	$scope.getAudit = function (i) {
		if (i == 0)
			return '待审核';
		else if (i == 1) {
			return '通过';
		} if (i == 2) {
			return '已认证';
		} else {
			return '未通过';
		}
	}

	$scope.addCompanyRdc = function(rdc) {
		var data = {
			rdcId : rdc.id,
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/addCompanyRdc',
			data:$.param(data)
		}).success(function (data) {
			alert("绑定成功");
			$scope.findRelatedRdcs();
		});
	}

	$scope.findRelatedRdcs = function() {
		var data = {
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/findRelatedRdcs',
			data:$.param(data)
		}).success(function (data) {
			$scope.relatedRdcs = data;
		});
	}
	$scope.findRelatedRdcs();
	$scope.delCompanyRdc = function(rdc) {
		var data = {
			rdcId : rdc.id,
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/delCompanyRdc',
			data:$.param(data)
		}).success(function (data) {
			alert("解绑成功");
			$scope.findRelatedRdcs();
		});
	}
});