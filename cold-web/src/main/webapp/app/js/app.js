var coldWeb = angular.module('ColdWeb', ['ui.bootstrap', 'ui.router', 'ui.checkbox',
                                         'ngCookies', 'xeditable', 'isteven-multi-select','angucomplete','angular-table']);
var user;

angular.element(document).ready(function($ngCookies, $location) {
	$.ajax({
	      url: '/i/user/findUser',
	      type: "GET",
	      dataType: 'json'
	    }).success(function(data){
	    	user = data;
            console.log(user);
	    	if(user.username == null){
	    		if(window.location.pathname != "/login.html" && window.location.pathname != '/register.html'){
	    			document.location.href = "login.html";
	    		}
	        }
	    	angular.bootstrap(document, ['ColdWeb']);
	    });
});


coldWeb.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

coldWeb.run(function(userService) {
      userService.setUser(user);
	  userService.setStorage('test');
});


coldWeb.config(function($httpProvider) {
	$httpProvider.interceptors.push(function ($q,$injector) {
        return {
            'response': function (response) {
                return response;
            },
            'responseError': function (rejection) {
            	var modal = $injector.get('$Modal');
            	modal.open({
            		animation : true,
                    templateUrl: 'app/template/error.html',
                    controller: 'error',
                    backdrop: true,
                    resolve: {
                    	rejection : function() {
                    		return rejection;
                    	}
                    }
                });

                return $q.reject(rejection);
            }
        };
    });
});


coldWeb.factory('userService', ['$rootScope', '$state', function ($rootScope, $state) {
    return {
        setUser: function (user) {
            $rootScope.user = user;
        },
        setStorage: function (user) {
/*            $rootScope.compressors = [{'name': "压缩机组", 'id': 0}, {'name': "风机", 'id': 1}];
             $rootScope.toMyCompressor = function (compressorId) {
             if (compressorId === 0) {
             $state.go('compressorPressure', {'compressor': compressorId});
             } else if (compressorId === 1) {
             $state.go('compressorBlower', {'compressor': compressorId});
             }
             };*/

            $rootScope.compressors = [{'name': "压缩机组1", 'id': 0}, {'name': "压缩机组2", 'id': 1}, {'name': "压缩机组3", 'id': 2}];
            $rootScope.toMyCompressor = function (compressorID) {
                $state.go('compressorPressure', {'compressorID': compressorID});
            };
            $rootScope.toMyBlowers = function () {
                $state.go('compressorBlower', {'user': user});
            };
            $rootScope.mystorages = [{'name': "上海-浦东-#1", 'id': 1}, {'name': "上海-浦东-#2",'id': 2}, {'name': "北京-五环-#1", 'id': 3}];
//      xuyanan coldStorageDiv.html - -
            $rootScope.openColdDiv = function (storageID){
            	console.log("openColdDiv: "+storageID);
            	$state.go('coldStorageDiv',{'storageID': storageID});
            }
            $rootScope.toMyStorage = function (type, storageID) {
                console.log(type);
                console.log(storageID);
                if (type === 1) {
                    $state.go('coldStorageTemper', {'storageID': storageID});
                } else if (type === 2) {
                $state.go('coldStorageDoor', {'storageID': storageID});
                      } else if (type === 3) {
                $state.go('coldStorageInOutGoods', {'storageID': storageID});
                             }
                };
            $rootScope.toMap = function () {
                $state.go('coldStorageMap', {});
            };
            $rootScope.toReport = function () {
                var time = 'daily';
                var item = 'energy';
                $state.go('report', {'time':time,'item':item});
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

coldWeb.directive('activeLink', ['$location','$filter', function (location,filter) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = element.children().attr('href') + "";
            path = filter('limitTo')(path,path.length - 1 ,1);
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

coldWeb.filter('sizeformat',function(){
    return function(size){
        if(size / (1024 * 1024 * 1024) > 1)
            return (size/(1024*1024*1024)).toFixed(2)+'G';
        else if(size / (1024*1024) > 1)
            return (size/(1024*1024)).toFixed(2)+'M';
        else if(size / 1024 > 1)
            return (size/1024).toFixed(2)+'K';
        else
            return size+'B'
    }
});

coldWeb.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/about");

    //index
    $stateProvider.state('about',{
    	url:'/about',
    	controller: 'base',
        templateUrl: 'app/template/about.html'
    }).state('login',{
    	url:'/login',
    	controller: 'login',
        templateUrl: 'app/template/login.html'
    }).state('myColdStorage',{
    	url:'/myColdStorage/:storageID',
    	controller: 'myColdStorage',
        templateUrl: 'app/template/myColdStorage.html'
    }).state('designStorage',{
    	url:'/designStorage',
    	controller: 'designStorage',
        templateUrl: 'app/template/designStorage.html'
    }).state('report',{
    	url:'/report-{time}-{item}',
    	controller: 'report',
        templateUrl: 'app/template/report.html'
    }).state('coldStorageMap', {
        url: '/coldStorageMap/:storageID',
        controller: 'coldStorageMap',
        templateUrl: 'app/template/coldStorageMap.html'
    }).state('coldStorageMonitor', {
        url: '/coldStorageMonitor/:storageID',
        controller: 'coldStorageMonitor',
        templateUrl: 'app/template/coldStorageMonitor.html'
    }).state('compressorMonitor', {
        url: '/compressorMonitor/:storageID',
        controller: 'compressorMonitor',
        templateUrl: 'app/template/compressorMonitor.html'
    }).state('coldStorageDoor', {
        url: '/coldStorageDoor/:storageID',
        controller: 'coldStorageDoor',
        templateUrl: 'app/template/coldStorageDoor.html'
    }).state('coldStorageInOutGoods', {
        url: '/coldStorageInOutGoods/:storageID',
        controller: 'coldStorageInOutGoods',
        templateUrl: 'app/template/coldStorageInOutGoods.html'
    }).state('coldStorageTemper', {
        url: '/coldStorageTemper/:storageID',
        controller: 'coldStorageTemper',
        templateUrl: 'app/template/coldStorageTemper.html'
    }).state('compressorPressure', {
        url: '/compressorPressure/:storageID',
        controller: 'compressorPressure',
        templateUrl: 'app/template/compressorPressure.html'
    }).state('compressorBlower', {
        url: '/compressorBlower/:storageID',
        controller: 'compressorBlower',
        templateUrl: 'app/template/compressorBlower.html'
    }).state('coldStorageDiv', {
        url: '/coldStorageDiv/:storageID',
        controller: 'coldStorageDiv',
        templateUrl: 'app/template/coldStorageDiv.html'
    });

});