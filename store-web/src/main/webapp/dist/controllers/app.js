/*
* store 360 system
* date:2017-09-13
* */
//
var  app = angular.module('storeWeb', ['ui.bootstrap', 'ui.router','oc.lazyLoad','ngCookies']);
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
app.run(function($rootScope, $state,$http,$cookies) {
	  $http.get('/i/user/findUser').success(function(data) {
		if (data == null||data=="") {
			document.location.href = "login.html";
			return;
		}
		;
		$rootScope.user = data;
	});//初始化user
//      userService.setUser(user);
//	  userService.setStorage();
});


app.factory('userService', ['$rootScope', '$state', '$http','$cookies',function ($rootScope, $state,$http,$cookies) {
//    return {
//        setUser: function (user) {
//            $rootScope.logout = function () {
//	        	 $.ajax({type: "GET",cache: false,dataType: 'json',url: '/i/user/logout'}).success(function(data){});
//	        	 $rootScope.user =window.user=user=undefined; 
//	        	 window.sessionStorage.clear();
//	        	// window.localStorage.clear();
//                 window.location.href=$rootScope.companyLoad.login+".html";
//	        };
//        }
//    };
}]);

app.config(function ($stateProvider, $urlRouterProvider,$ocLazyLoadProvider) {
	$urlRouterProvider.otherwise("/blank");
	$stateProvider.state('blank', {
        url: '/blank',
        controller: 'blank',
        templateUrl: 'dist/view/blank.html',
        resolve:{ deps:["$ocLazyLoad",function($ocLazyLoad){ return $ocLazyLoad.load("dist/controllers/blank.js"   ); }]}
    }).state('humiture', {
        url: '/humiture',
        controller: 'humiture',
        templateUrl: 'dist/view/humiture.html',
        resolve:{ deps:["$ocLazyLoad",function($ocLazyLoad){ return $ocLazyLoad.load("dist/controllers/humiture.js" ); }]}
    });
    
   
});

