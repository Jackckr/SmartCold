/*
* store 360 system
* date:2017-09-13
* */
//
var  app = angular.module('storeWeb', ['ui.bootstrap', 'ui.router','oc.lazyLoad','ngCookies']),sys={version:"1.2.3"};
//对模块的注册
app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider","$stateProvider",function ($provide, $compileProvider, $controllerProvider, $filterProvider,$stateProvider) {
	            app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.stateProvider=$stateProvider;//接管后对权限预处理
}]);
//
app.run(function($rootScope, $state,$http,$cookies, $templateCache) {
	  $http.get('/i/user/findUser').success(function(data) {if (data == null||data=="") {document.location.href = "login.html";return;}$rootScope.user = data;});//初始化user
//	  $http.get('/i/systemController/getVersion').success(function(data) {
//		  window.localStorage.clear();
//		  $templateCache.remove(current.templateUrl);
//	  });//初始化版本
	
	  $rootScope.logout = function () {
     	  $http.get('/i/user/logout').success(function(data) {});
     	 $rootScope.user =undefined; 
     	 window.sessionStorage.clear();
     	 $cookieStore.remove('token');
         window.location.href=$rootScope.companyLoad.login+".html";
     };
	  
//      userService.setUser(user);
//	    userService.setStorage();
});


//app.factory('userService', ['$rootScope', '$state', '$http','$cookies',function ($rootScope, $state,$http,$cookies) {
////    return {
////        setUser: function (user) {
////            
////        }
////    };
//}]);

app.config(function ($stateProvider, $urlRouterProvider,$ocLazyLoadProvider) {
	$urlRouterProvider.otherwise("/blank");
	$stateProvider.state('blank', {
        url: '/blank',
        controller: 'blank',
        templateUrl: 'dist/view/blank.html',
        resolve:{ deps:["$ocLazyLoad",function($ocLazyLoad){ return $ocLazyLoad.load("dist/controllers/blank.js"   ); }]}
    })
    .state('humiture', {
        url: '/humiture',
        controller: 'humiture',
        templateUrl: 'dist/view/humiture.html',
        resolve:{ deps:["$ocLazyLoad",function($ocLazyLoad){ return $ocLazyLoad.load("dist/controllers/humiture.js" ); }]}
    })
    .state('storeTemp', {//大数据测试
    	url: '/storeTemp',
    	controller: 'storeTemp',
    	templateUrl: 'dist/view/storeTemp.html',
    	resolve:{ deps:["$ocLazyLoad",function($ocLazyLoad){ return $ocLazyLoad.load("dist/controllers/storeTemp.js" ); }]}
    })
    ;
    
   
});

