var coldWeb = angular.module('ColdWeb', ['ui.bootstrap', 'ui.router', 'ui.checkbox',
                                         'ngCookies', 'xeditable', 'isteven-multi-select','angucomplete','angular-table']);
var user;

angular.element(document).ready(function($ngCookies, $location) {
	document.cookie="token=" + document.location.hash.substr(2,document.location.hash.length);
	$.ajax({
	      url: '/i/user/findUser',
	      type: "GET",
	      dataType: 'json'
	    }).success(function(data){
	    	user = data;
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
	  userService.setStorage();
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


coldWeb.factory('userService', ['$rootScope', '$state', '$http', function ($rootScope, $state,$http) {
    return {
        setUser: function (user) {
            $rootScope.user = user;
        },
        setStorage: function () {
            var compressors = [];
            var mystorages = [];
            if ($rootScope.user != null && $rootScope.user!='' && $rootScope.user!= undefined && $rootScope.user.id != 0){
                // 拉取压缩机组列表
                $http.get('/i/compressorGroup/findByUserId', {
                    params: {
                        "userId": $rootScope.user.id
                    }
                }).success(function (result) {
                    console.log("result:" + result);
                    for (var i = 0; i < result.length; i++) {
                        console.log("compressors:" + result[i].groupId + ",rdcId: " + result[i].rdcId);
                        compressors.push({
                            name: "压缩机组" + result[i].groupId,
                            id: result[i].groupId
                        });
                    }
                    $rootScope.compressors = compressors;
                })
                // 拉取冷库列表
                $http.get('/i/coldStorage/findByUserId', {
                    params: {
                        "userId": $rootScope.user.id
                    }
                }).success(function (result) {
                    console.log("result:" + result);
                    for (var i = 0; i < result.length; i++) {
                        console.log("mystorages:" + result[i].coldStorageID + ",rdcId: " + result[i].rdcId);
                        mystorages.push({
                            name: result[i].name,
                            id: result[i].coldStorageID
                        });
                    }

                    $rootScope.mystorages = mystorages;
                    $rootScope.rdcId = result[0].rdcId;
                })
            }

            $rootScope.toMyCompressor = function (compressorID) {
                $state.go('compressorPressure', {'compressorID': compressorID});
            };
            $rootScope.toMyBlowers = function () {
                $state.go('compressorBlower', {'userId': $rootScope.user.id});
            };
            //$rootScope.mystorages = [{'name': "上海-浦东-#1", 'id': 1}, {'name': "上海-浦东-#2",'id': 2}, {'name': "北京-五环-#1", 'id': 3}];
//      xuyanan coldStorageDiv.html - -
 /*           $rootScope.openColdDiv = function (storageID){
            	console.log("openColdDiv: "+storageID);
            	$state.go('coldStorageDiv',{'storageID': storageID});
            }*/
            $rootScope.openColdDiv = function (){
                console.log("openColdDiv: "+$rootScope.rdcId);
                $state.go('coldStorageDiv',{'storageID': $rootScope.rdcId});
            }
            $rootScope.openWarn = function (){
                console.log("openWarn: "+$rootScope.rdcId);
                $state.go('warn',{'rdcId': $rootScope.rdcId});
            }
            $rootScope.toRdcPower = function () {
                console.log($rootScope.rdcId);
                $state.go('rdcPower', {'rdcId': $rootScope.rdcId});
            };
            $rootScope.toMyStorageTemper = function (storageID) {
                console.log(storageID);
                $state.go('coldStorageTemper', {'storageID': storageID});
            };
            $rootScope.toMyStorageDoor = function (storageID) {
                console.log(storageID);
                $state.go('coldStorageDoor', {'storageID': storageID});
            };
            $rootScope.toMyStorageGoods = function (storageID) {
                console.log(storageID);
                $state.go('coldStorageInOutGoods', {'storageID': storageID});
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
    }).state('warn', {
        url: '/warn/:rdcId',
        controller: 'warn',
        templateUrl: 'app/template/warn.html'
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
        url: '/compressorPressure/:compressorID',
        controller: 'compressorPressure',
        templateUrl: 'app/template/compressorPressure.html'
    }).state('compressorBlower', {
        url: '/compressorBlower/:userId',
        controller: 'compressorBlower',
        templateUrl: 'app/template/compressorBlower.html'
    }).state('coldStorageDiv', {
        url: '/coldStorageDiv/:storageID',
        controller: 'coldStorageDiv',
        templateUrl: 'app/template/coldStorageDiv.html'
    }).state('rdcPower', {
        url: '/rdcPower/:rdcId',
        controller: 'rdcPower',
        templateUrl: 'app/template/rdcPower.html'
    });

});