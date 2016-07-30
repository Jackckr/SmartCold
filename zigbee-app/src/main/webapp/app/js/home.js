/* 
var app = angular.module('app', []);
app.controller('homecontroller',
function($scope, $http) {
    $scope.province = null;
    $scope.initdata = function() {
        $http.get(ER.root + '/i/city/findProvinceList').success(function(data) {
            $scope.province = data;
        }); 
    };
    $scope.initevg = function() {
        $("#city").click(function(e) {
            SelCity(this, e, $scope.province);
            $("#city").siblings('i').html('&#xe62e;');
        });
    };
    var url = ER.root + '/i/city/findProvinceList';
    $.getJSON(url, function(data) {
        debugger;
    }); //
    $scope.initdata();
    $scope.initevg();
});		
*/
$().ready(function() { 
	var province=null;
	function initdata(){
		$.getJSON(ER.root+'/i/city/findProvinceList',function(data){
			province=data;
		});//
	};
	function initevg(){
		 $("#city").click(function (e) {
			SelCity(this,e,province);
			$("#city").siblings('i').html('&#xe62e;');
		});
	};
	initdata();
	initevg();
});

	



