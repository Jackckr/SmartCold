var coldWeb = angular.module('ColdWeb', ['ui.bootstrap', 'ui.router', 'ui.checkbox',
    'ngCookies', 'xeditable', 'isteven-multi-select', 'angucomplete', 'angular-table','ngFileUpload','remoteValidation']);
coldWeb.constant('coldWebUrl', 'http://www.smartcold.org.cn/i/');
// coldWeb.constant('coldWebUrl', 'http://localhost:8081/i/');
angular.element(document).ready(function ($ngCookies, $http, $rootScope) {
	angular.bootstrap(document, ['ColdWeb']);
});
coldWeb.run(function (editableOptions, naviService,adminService, $location) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    naviService.setNAVI();
    $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/admin/findAdmin'}).success(function(data){
      	admin = data.entity;
      	if(admin == null || admin.id == 0){
  			url = "http://" + $location.host() + ":" + $location.port() + "/login.html";
  			window.location.href = url;
  		}
  		adminService.setAdmin(admin);
      });
});

coldWeb.config(function ($httpProvider) {
	//$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.interceptors.push(function ($q, $injector) {
        return {
            'response': function (response) {
                return response;
            },
            'responseError': function (rejection) {
                var modal = $injector.get('$Modal');
                modal.open({
                    animation: true,
                    templateUrl: 'app/template/error.html',
                    controller: 'error',
                    backdrop: true,
                    resolve: {
                        rejection: function () {
                            return rejection;
                        }
                    }
                });

                return $q.reject(rejection);
            }
        };
    });
});

coldWeb.factory('adminService',['$rootScope','$http', function($rootScope,$http){
	return {
		setAdmin: function(admin){
	    	$rootScope.admin = admin;
	    	$rootScope.logout = function () {
	        	$http.get('/i/admin/logout').success(function(data){
	        		$rootScope.admin = null;
	            });
	        	window.location.reload();
	        };
	        $rootScope.gotoSmartCold = function(){
	        	cookies = document.cookie.split(";")
	        	url = "http://www.smartcold.net";
	        	angular.forEach(cookies,function(item){
	        		item = item.trim();
	        		if(item.startsWith("token=")){	        			
	        			url = url + "/#/" + item;
	        		}
	        	})
	        	window.open(url);
	        }
	    },
	}
}])

coldWeb.factory('naviService', ['$rootScope', '$state', function ($rootScope, $state) {
    return {
        setNAVI: function () {
            $rootScope.toColdStorageList = function () {
                $state.go('coldStoragelist', {});
            };
            $rootScope.toColdStorageComment = function (storageId) {
                $state.go('coldStorageComment', {'storageId': storageId});
            };
        },
    };
}]);

coldWeb.filter('objectCount', function () {
    return function (input) {
        var size = 0, key;
        for (key in input) {
            if (input.hasOwnProperty(key)) size++;
        }
        return size;
    }
});

coldWeb.filter('toArray', function () {
    'use strict';

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).filter(function (key) {
            if (key.charAt(0) !== "$") {
                return key;
            }
        }).map(function (key) {
            if (!(obj[key] instanceof Object)) {
                obj[key] = {value: obj[key]};
            }

            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    };
});


coldWeb.directive('toggleClass', function() {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            element.bind('click', function() {
	                if(element.attr("class") == "empty") {
	                    element.removeClass("empty");
	                    element.addClass(attrs.toggleClass);
	                    window.location.href=attrs.url;
	                } else {
	                    element.removeClass("highlight");
	                    element.addClass("empty");
	                }
	            });
	        }
	    };
	});

coldWeb.directive('snippet', function () {
    return {
        restrict: 'E',
        template: '<pre><div class="hidden code" ng-transclude></div><code></code></pre>',
        replace: true,
        transclude: true,
        link: function (scope, elm, attrs) {
            scope.$watch(function () {
                return elm.find('.code').text();
            }, function (newValue, oldValue) {
                if (newValue != oldValue) {
                    elm.find('code').html(hljs.highlightAuto(newValue).value);
                }
            });
        }
    };
});


coldWeb.directive('star', function () {
  return {
    template: '<ul class="rating" ng-mouseleave="leave(order)">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="click(order,$index + 1)" ng-mouseover="over(order,$index + 1)">' +
        '\u2605' +
        '</li>' +
        '</ul>{{overVal?overVal:ratingVal}} 分',
    scope: {
      ratingValue: '=',
      max: '=',
      order: '=',
      readonly: '@',
      onClick: '='
    },
    controller: function($scope){
      $scope.ratingValue = $scope.ratingValue || 0;
      $scope.max = $scope.max || 5;
	  $scope.ratingVal = 0;
	  $scope.overVal = null;
	  $scope.stars = [];
	  for(var i=0; i< $scope.max;i++){
		  $scope.stars.push({
              filled: i < $scope.ratingVal
            });
	  }
	  var updateStars = function (val) {
          for (var i = 0; i < $scope.max; i++) {
            $scope.stars[i].filled = i < val;
          }
        };
      $scope.click = function(i,val){
        $scope.ratingVal = val;
    	updateStars(val);
        $scope.onClick(i,val);
      };
      $scope.over = function(i,val){
    	$scope.overVal = val;
    	updateStars(val);
      };
      $scope.leave = function(i){
    	  $scope.overVal = null;
    	updateStars($scope.ratingVal);
      }
      updateStars(0);
    },
    link: function (scope, elem, attrs) {
      elem.css("text-align", "center");
 
    }
  };
});

coldWeb.directive('activeLink', ['$location', '$filter', function (location, filter) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = element.children().attr('href') + "";
            path = filter('limitTo')(path, path.length - 1, 1);
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {
                if (newPath.indexOf(path) > -1) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    };
}]);

coldWeb.filter('sizeformat', function () {
    return function (size) {
        if (size / (1024 * 1024 * 1024) > 1)
            return (size / (1024 * 1024 * 1024)).toFixed(2) + 'G';
        else if (size / (1024 * 1024) > 1)
            return (size / (1024 * 1024)).toFixed(2) + 'M';
        else if (size / 1024 > 1)
            return (size / 1024).toFixed(2) + 'K';
        else
            return size + 'B'
    }
});

coldWeb.filter('objectLength',function(){
    return function(obj,len){
        return Object.keys(obj).length + (len?len:0);
    }
});


coldWeb.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    //index
    $stateProvider.state('login', {
        url: '/login',
        controller: 'login',
        templateUrl: 'app/template/login.html?4'
    }).state('home', {
        url: '/home',
        controller: 'home',
        templateUrl: 'app/template/home.html'
    }).state('search', {
        url: '/search',
        controller: 'search',
        templateUrl: 'app/template/search.html'
    }).state('info', {
        url: '/info/{id}',
        controller: 'info',
        templateUrl: 'app/template/info.html'
    }).state('multi-query', {
        url: '/multi-query/{key}',
        controller: 'multi-query',
        templateUrl: 'app/template/multi-query.html'
    }).state('goods-list', {
        url: '/goods-list/{key}',
        controller: 'goods-list',
        templateUrl: 'app/template/goods-list.html'
    }).state('coldStoragelist', {
        url: '/storageManage',
        controller: 'storageManage',
        templateUrl: 'app/template/storageManage.html'
    }).state('commentManage', {
        url: '/commentManage',
        controller: 'commentManage',
        templateUrl: 'app/template/commentManage.html'
    }).state('review', {
        url: '/coldStorage/{rdcID}/review',
        controller: 'review',
        templateUrl: 'app/template/review.html'
    }).state('coldStorageAdd', {
        url: '/coldStorageAdd',
        controller: 'coldStorageAdd',
        templateUrl: 'app/template/coldStorageInfo.html'
    }).state('coldStorageEdit', {
        url: '/coldStorageEdit/:rdcID',
        controller: 'coldStorageEdit',
        templateUrl: 'app/template/editStorage.html'
    }).state('coldStorageMap', {
        url: '/coldStorageMap',
        controller: 'coldStorageMap',
        templateUrl: 'app/template/coldStorageMap.html'
    }).state('adminlist', {
        url: '/adminlist',
        controller: 'adminlist',
        templateUrl: 'app/template/adminManage.html'
    }).state('infoManage', {
        url: '/infoManage',
        controller: 'infoManage',
        templateUrl: 'app/template/infoManage.html'
    }).state('spiderConfig', {
        url: '/spiderConfig',
        controller: 'spiderConfig',
        templateUrl: 'app/template/spiderConfig.html'
    }).state('storageConfig', {
        url: '/storageConfig',
        controller: 'storageConfig',
        templateUrl: 'app/template/storageConfig.html'
    }).state('operatinLog',{
    	url: '/operationLog',
    	controller: 'operationLog',
    	templateUrl: 'app/template/operationLog.html'
    }).state('coldStorageAudit', {
        url: '/coldStorageAudit/:rdcID',
        controller: 'coldStorageAudit',
        templateUrl: 'app/template/editStorage.html'
    }).state('coldStorageHonorAudit', {
        url: '/coldStorageHonorAudit/:rdcId',
        controller: 'coldStorageHonorAudit',
        templateUrl: 'app/template/coldStorageHonor.html'
    }).state('coldStorageAuthAudit', {
        url: '/coldStorageAuthAudit/:rdcId',
        controller: 'coldStorageAuthAudit',
        templateUrl: 'app/template/coldStorageAuth.html'
    }).state('companylist', {
        url: '/companylist',
        controller: 'companylist',
        templateUrl: 'app/template/companyManage.html'
    }).state('storageRelate', {
        url: '/storageRelate/:companyId',
        controller: 'storageRelate',
        templateUrl: 'app/template/storageRelate.html'
    }).state('userRelate', {
        url: '/userRelate/:companyId',
        controller: 'userRelate',
        templateUrl: 'app/template/userRelate.html'
    });
});