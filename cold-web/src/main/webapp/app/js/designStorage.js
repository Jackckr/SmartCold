coldWeb.controller('designStorage', function ($scope, $location,$stateParams,$http,$uibModal) {
	
	$scope.infos = {
			  length: 50,//冷库长度L(m)
			  weight: 20,//冷库宽度W(m)
			  height: 20,//冷库高度H(m)
			  outsideTemperature: 4,//外界温度(°C)
			  insideTemperature: 4.5,//库房温度(°C)
			  outsideHumidity: 5,//库外相对湿度(%)
			  insideHumidity: 5.5,//库内相对湿度(%)
			  circulation: 6,//流通量()
			  loadTemperature: 7,//负荷温度(°C)
			  freezingHour: 12,//冷却时间(h)
			  leftWall: null,//左面墙对象
			  rightWall: null,//右面墙
			  frontWall: null,//正面墙
			  behindWall: null,//behindWall
			  ceiling: null,//天花板
			  floor: null,//地板
			  goods: null,//存储物选择
			  goodsType: null,
			  goodsFromTemperature: null,//货物初始温度
			  goodsToTemperature: null,//设计保存温度
			  goodsWeight: null,//每日进货量
			  goodsTotalWeight: null,//存储物总重量
			  usage: null, //冷冻模式
			  density: null,//密度(kg/m³)
			  pack: null,//包装
			  refrigeration: null,//库房制冷量(kg)
			  dailyLoad: null,//日负荷(kg)
			  lightLoad: null,//照明负荷(W/㎡)
			  otherLoad: null,//其它负荷(Watt)
			  people: null,//库房工作人数
			  costTime: null//库房逗留时间(h)
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