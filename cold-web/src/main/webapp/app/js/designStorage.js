coldWeb.controller('designStorage', function ($scope, $location,$stateParams,$http,$uibModal) {
	
	$scope.infos = {
			  length: 50,
			  weight: 20,
			  height: 20,
			  outsideTemperature: 4,
			  insideTemperature: 4.5,
			  outsideHumidity: 5,
			  insideHumidity: 5.5,
			  circulation: 6,
			  loadTemperature: 7,
			  freezingHour: 12,
			  leftWall: null,
			  rightWall: null,
			  frontWall: null,
			  behindWall: null,
			  ceiling: null,
			  floor: null,
			  goods: null,
			  goodsType: null,
			  goodsFromTemperature: null,
			  goodsToTemperature: null,
			  goodsWeight: null,
			  goodsTotalWeight: null,
			  usage: null,
			  density: null,
			  pack: null,
			  refrigeration: null,
			  dailyLoad: null,
			  lightLoad: null,
			  otherLoad: null,
			  people: null,
			  costTime: null
			};
	$http.get('/i/baseInfo/findAllWallMaterial').success(function(data,status,header,config){
		$scope.materials = data;
		$scope.infos.leftWall = {material:$scope.materials[0],thickness:10,outTemperature:10};
		$scope.infos.rightWall= {material:$scope.materials[0],thickness:10,outTemperature:10};
		$scope.infos.frontWall= {material:$scope.materials[0],thickness:10,outTemperature:10};
		$scope.infos.behindWall= {material:$scope.materials[0],thickness:10,outTemperature:10};
		$scope.infos.ceiling = {material:$scope.materials[0],thickness:10,outTemperature:10};
		$scope.infos.floor = {material:$scope.materials[0],thickness:10,outTemperature:10};
	});
	
	$http.get('/i/baseInfo/findAllGoods').success(function(data,status,header,config){
	    $scope.allGoods = data;
	    $scope.goodsModel=$scope.allGoods[0];
	});
	$http.get('/i/baseInfo/findAllPack').success(function(data,status,header,config){
		$scope.packs = data;
		$scope.infos.pack = $scope.packs[0];
	});
	
	$http.get('/i/baseInfo/findAllUsage').success(function(data,status,headers,config){
		$scope.usages = data;
		$scope.infos.usage = data[0];
	})
	
	$scope.showInfos = function(){
		console.log($scope.infos);
	}
	$scope.submit = function(){
		$scope.infos.goodsType = $scope.goodsModel.id;
		console.log($scope.infos);
		$http.post('/i/calculation/calculationHeat?',data=$scope.infos).success(function(data,status,headers,config){
			console.log(data);
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : '/app/template/designResult.html',
				controller : 'designResult',
				resolve : {
					data : function() {
						$scope.infos.result = data;
						$scope.infos.goodsTypeName = $scope.goodsModel.name;
						return $scope.infos;
					}
				}
			});
			
		})
	}
	$scope.change = function(){
		changeGeometry($scope.infos.weight, $scope.infos.height, $scope.infos.length);
		console.log($scope.infos.height);
	}
//	CubeGeometry($scope.infos.weight, $scope.infos.height, $scope.infos.length);
});

coldWeb.controller('designResult', function($scope, $modalInstance, $http,
		data) {
	$scope.infos = data;
});