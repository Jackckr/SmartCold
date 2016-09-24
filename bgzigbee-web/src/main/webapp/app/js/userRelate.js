/**
 * Created by qiunian.sun on 16/4/9.
 */
coldWeb.controller('userRelate', function ($rootScope, $scope, $state, $cookies, $http, $location, $stateParams) {
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
	$scope.getUsers = function() {
		$http({
			method : 'POST',
			url : '/i/user/findUserList',
			params : {
				pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize,
				audit : $scope.optAudit,
				keyword : encodeURI($scope.keyword,"UTF-8"),
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
			$scope.Allusers = data.list;
		});
	}

	$scope.pageChanged = function() {
		$scope.getUsers();
	}
	$scope.getUsers();
	// 获取当前冷库的列表
	$scope.auditChanged = function(optAudiet) {
		$scope.getUsers();
	}

	$scope.goSearch = function () {
		$scope.getUsers();
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

	$scope.addCompanyUser = function(user) {
		var data = {
			userId : user.id,
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/addCompanyUser',
			data:$.param(data)
		}).success(function (data) {
			alert("绑定成功");
			$scope.findRelatedUsers();
		});
	}

	$scope.findRelatedUsers = function() {
		var data = {
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/findRelatedUsers',
			data:$.param(data)
		}).success(function (data) {
			$scope.relatedUsers = data;
		});
	}
	$scope.findRelatedUsers();

	$scope.delCompanyUser = function(user) {
		var data = {
			userId : user.id,
			companyId : $scope.companyId
		};
		$http({
			method:'POST',
			url:'/i/company/delCompanyUser',
			data:$.param(data)
		}).success(function (data) {
			alert("解绑成功");
			$scope.findRelatedUsers();
		});
	}
});