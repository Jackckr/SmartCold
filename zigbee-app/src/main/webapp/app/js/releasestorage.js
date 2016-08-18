checkLogin();
angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	 $http.defaults.withCredentials=true;$http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	var url=window.location.href;
	var arrurl=url.split("?id=");
	if(arrurl[1]!=''&&arrurl[1]!=undefined){
	 $http.get(ER.root+'/i/rdc/findRDCEntityDtoByRdcId', {
         params: {
             "rdcID": arrurl[1]
         }
     }).success(function (data) {
    	 $scope.rdcdto = data;
    	 $scope.star = [];
    	 $scope.nostar = [];
    	 $scope.star.length = $scope.rdcdto.score;
    	 $scope.nostar.length = 5-$scope.rdcdto.score;
     });
	}
	$scope.totalfiles = [];
	$scope.telephone = window.user.telephone;
	 $scope.goaddrdcpag=function(){
			  $location.path("/coldStorageAdd");
	  };
	  // 获取省列表
	    $http.get(ER.root+'/i/city/findProvinceList').success(function (data) {
	        $scope.provinces = data;
	    });

	    // 根据省ID查询城市列表
	    $scope.provinceSelected = function () {
	        $http.get(ER.root+'/i/city/findCitysByProvinceId', {
	            params: {
	                "provinceID": $scope.provinceId
	            }
	        }).success(function (data) {
	            $scope.citys = data;
	            $scope.cityId = data[0].cityID;
	        });
	    }

	    $scope.citySelected = function () {
	    }
	    // 获取商品存放类型
	    $http.get(ER.root+'/i/rdc/findAllTemperType').success(function (data) {
	        $scope.temperTypes = data;
	        $scope.temperType = data[0].id;
	    });

	    $scope.TemperTypeSelected = function () {
	    }

	    // 获取冷库温度类型
	    $http.get(ER.root+'/i/rdc/findAllStorageType').success(function (data) {
	        $scope.storageTypes = data;
	        $scope.storageType = data[0].id;
	    });
	    
	    $http.get(ER.root+'/i/ShareRdcController/getPSFilterData').success(function(data) {
        	$scope.codeLave1 = data.entity.fm;
        	$scope.codeLave2 = data.entity.cl;
        	$scope.ps_cr_type = data.entity.sk;
        }); //
	    
	    $http.get(ER.root+'/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据
	    $scope.StorageTypeSelected = function () {
	    }
	    $scope.addFiles = function(files) {
		    $scope.totalfiles = $scope.totalfiles.concat(files);
		    $("#list").empty();
		    var files = $scope.totalfiles; // FileList object
		    for (var i = 0,
		    f; f = files[i]; i++) {
		        if (!f.type.match('image.*')) { continue; }
		        var reader = new FileReader();
		        reader.onload = (function(theFile) { return function(e) { var innerHTML = ['<span id="imglistp'+i+'"><img class="thumb " src="', e.target.result, '" title="', escape(theFile.name), '"/></span>'].join(''); $("#list").append(innerHTML); };})(f); reader.readAsDataURL(f);//<i  onclick="releaseItem.drop('+i+')">×</i>
		    }
		};
		$scope.dataType = document.getElementById('dataType').value;
		$scope.typeCode = document.getElementById('typeCode').value;
		$scope.typeText = document.getElementById('typeText').value;
	    $scope.rdcflag = document.getElementById('rdcflag').value;
	    
		$scope.carSubmit = function(){
			$scope.rdcID = '';
			$scope.rdcAddress = '';
			if(window.flag==1){
				$scope.typeCode = 2;
				$scope.typeText = "找车";
			}
			if($scope.rdcflag==1)
			{
				$scope.rdcID = $scope.rdcdto.id;
				$scope.rdcAddress = $scope.rdcdto.address;
				}
			var vo = {}; 
			var simdata = {
					title:$scope.title,
					codeLave1:$scope.codeLave11,
					codeLave2:$scope.codeLave22,
					codeLave3:$scope.codeLave3,
					unitPrice : $scope.unitprice,
					unit1:$scope.staddress,
					unit2:$scope.toaddress,
					validStartTime:$scope.startTime,
					validEndTime : $scope.arriveTime,
					telephone:$scope.telephone,
					note : $scope.note,
					dataType : $scope.dataType,
					typeCode : $scope.typeCode,
					typeText : $scope.typeText,
					rdcID : $scope.rdcID,
					address:$scope.rdcAddress
					
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	window.location.href ="coldtransportlist.html"; 
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
		}
	    
	    
		$scope.goodSubmit = function(){
			$scope.rdcID = '';
			$scope.rdcAddress = '';
			if( $scope.unit1==""||$scope.unit1==undefined){
				$scope.typeCode = 2;
				$scope.typeText = "求购";
			}
			if($scope.rdcflag==1)
			{
				$scope.rdcID = $scope.rdcdto.id;
				$scope.rdcAddress = $scope.rdcdto.address;
				}
			var vo = {}; 
			var simdata = {
					title:$scope.title,
					provinceid : $scope.provinceId,
					cityid : $scope.cityId,
					codeLave1:$scope.codeLave1,
					unit1 : $scope.unit1,
					unitPrice : $scope.unitprice,
					validEndTime : $scope.reservationtime,
					sqm:$scope.sqm,
					telephone:$scope.telephone,
					note : $scope.note,
					dataType : $scope.dataType,
					typeCode : $scope.typeCode,
					typeText : $scope.typeText,
					rdcID : $scope.rdcID,
					address:$scope.rdcAddress
					
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	window.location.href ="goodslist.html"; 
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
		}
		
		
		$scope.submit = function(){
			$scope.rdcID = '';
			$scope.rdcAddress = '';
			if( $scope.provinceId==""||$scope.provinceId==undefined){
				$scope.typeCode = 1;
				$scope.typeText = "出租";
				$scope.rdcID = $scope.rdcdto.id;
				$scope.rdcAddress = $scope.rdcdto.address;
			}
			var vo = {}; 
			var simdata = {
					title:$scope.title,
					provinceid : $scope.provinceId,
					cityid : $scope.cityId,
					codeLave2 : $scope.temperType,
					codeLave1:$scope.storageType,
					unit : $scope.unit,
					unitPrice : $scope.unitPrice,
					validEndTime : $scope.reservationtime,
					telephone:$scope.telephone,
					note : $scope.note,
					dataType : $scope.dataType,
					typeCode : $scope.typeCode,
					typeText : $scope.typeText,
					rdcID : $scope.rdcID,
					address:$scope.rdcAddress
			};
			var sdata  = JSON.stringify(simdata);
			var data = {data:sdata, "files":$scope.totalfiles};
			Upload.upload({
		        url: ER.root+"/i/ShareRdcController/shareFreeRelease",
		        headers :{ 'Content-Transfer-Encoding': 'utf-8' },
		        data: data
		    }).then(function (resp) {
		    	alert(resp.data.message);
		    	window.location.href ="storehouse.html"; 
		    }, function (resp) {
		        console.log('Error status: ' + resp.status);
		    }, function (evt) {
		        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		        console.log('progress: ' + progressPercentage + '% ' + evt.name);
		    });
		}
});
