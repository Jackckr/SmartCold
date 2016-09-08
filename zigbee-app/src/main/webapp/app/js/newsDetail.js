 var app = angular.module('app', []);
     app.controller('newsdetail', function($http, $location,$scope) { 
	 $http.defaults.withCredentials=true;
	 $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 var arrurl=getUrlParam("id");
	 if(arrurl!=''&&arrurl!=undefined){
		 $http.get(ER.root+'/i/information/findInformationByID', {
				params : {
					"inforID" : arrurl
				}
			}).success(function(data) {
				$scope.informationDetail = data;
				document.getElementById("infoContent").innerHTML=$scope.informationDetail.content;
		});
	}
});
