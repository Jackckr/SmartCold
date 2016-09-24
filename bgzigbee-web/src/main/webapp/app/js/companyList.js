coldWeb.controller('companylist', function ($rootScope, $scope, $state, $cookies, $http, $location) {
    $scope.load = function () {
        $.ajax({type: "GET", cache: false, dataType: 'json', url: '/i/admin/findAdmin'}).success(function (data) {
            $rootScope.admin = data.entity;
            if ($rootScope.admin == null || $rootScope.admin.id == 0) {
                url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
                window.location.href = url;
            }
        });
    };
    $scope.load();
    $scope.Allcompanys = [];
    $scope.admin = "";
    // 显示最大页数
    $scope.maxSize = 12;
    // 总条目数(默认每页十条)
    $scope.bigTotalItems = 12;
    // 当前页
    $scope.bigCurrentPage = 1;


    $scope.getCompanys = function () {
        $http({
            method: 'POST',
            url: '/i/company/findCompanyList',
            params: {
                pageNum: $scope.bigCurrentPage,
                pageSize: $scope.maxSize,
                keyword: $scope.keyword
            }
        }).success(function (data) {
            $scope.bigTotalItems = data.total;
            $scope.Allcompanys = data.list;
        });
    }

    $scope.pageChanged = function () {
        $scope.getCompanys();
    }
    $scope.getCompanys();

    $scope.goSearch = function () {
        $scope.getCompanys();
    }

    $.ajax({type: "GET", cache: false, dataType: 'json', url: '/i/admin/findAdmin'}).success(function (data) {
        $scope.admin = data.entity;
    });

    function delcfm() {
        if (!confirm("确认要删除？")) {
            return false;
        }
        return true;
    }

    $scope.goDeleteCompany = function (companyID) {
        if (delcfm()) {
            $http.get('/i/company/deleteCompany', {
                params: {
                    "companyID": companyID
                }
            }).success(function (data) {
            });
            $state.reload();
        }
    }

    $scope.deleteCompanys = function () {
        if (delcfm()) {
            var companyIDs = [];
            for (i in $scope.selected) {
                companyIDs.push($scope.selected[i].id);
            }
            if (companyIDs.length > 0) {
                $http({
                    method: 'DELETE',
                    url: '/i/company/deleteByCompanyIDs',
                    params: {
                        'companyIDs': companyIDs
                    }
                }).success(function (data) {
                });
            }
            window.location.reload();
        }
    }

    $scope.selected = [];
    $scope.toggle = function (company, list) {
        var idx = list.indexOf(company);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(company);
        }
    };
    $scope.exists = function (company, list) {
        return list.indexOf(company) > -1;
    };
    $scope.isChecked = function () {
        return $scope.selected.length === $scope.Allcompanys.length;
    };
    $scope.toggleAll = function () {
        if ($scope.selected.length === $scope.Allcompanys.length) {
            $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = $scope.Allcompanys.slice(0);
        }
    };

    function checkInput() {
        var flag = true;
        // 检查必须填写项
        if ($scope.companyname == undefined || $scope.companyname == '') {
            flag = false;
        }
        return flag;
    }


    $scope.submit = function () {
        if (checkInput()) {
            $http({
                method: 'GET',
                url: '/i/company/addCompany',
                params: {
                    'name': encodeURI($scope.companyname, "UTF-8"),
                    'address': encodeURI($scope.companyAddress, "UTF-8")
                }
            }).then(
                function (resp) {
                    alert("添加成功");
                    window.location.reload();
                },
                function (resp) {
                    console.log('Error status: ' + resp.status);
                },
                function (evt) {
                    var progressPercentage = parseInt(100.0
                        * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage
                        + '% ' + evt.name);
                });
        } else {
            alert("请填写集团名称!");
        }
    }

    $scope.goRelateRdc = function (company) {
        $state.go('storageRelate', {"companyId": company.id});
    }

    $scope.goRelateUser = function (company) {
        $state.go('userRelate', {"companyId": company.id});
    }
});
