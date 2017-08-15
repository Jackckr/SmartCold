checkLogin();
angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) {
    $http.defaults.withCredentials=true;  $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
    var id=getUrlParam("id");
    window.flag2=1;
    $scope.unit = "Kg";
    $scope.publishunit = 1;
    $scope.telephone =  window.user.telephone.trim();
    if(id){
//
        $http.get(ER.root+'/i/ShareRdcController/getRdcByUid', { params: {  "rdcId": id,uid:window.user.id } }).success(function (data) {
            if(data.success){ $scope.rdcdto = data.data[0];}
        });
    };

    $http.get(ER.root+'/i/ShareRdcController/getGDFilterData').success(function(data) {$scope.good_type = data.entity.gt;}); //加载区域数据

    $scope.typeCode = document.getElementById('typeCode').value;
    $scope.typeText = document.getElementById('typeText').value;
    $scope.rdcflag= document.getElementById('rdcflag').value;
    $scope.totalfiles = [];
    $scope.addFiles = function (files) {
        for(var j=0,fileLen=files.length;j<fileLen;j++){
            var _file=files[j].name;
            var i=_file.lastIndexOf('.');
            var len=_file.length;
            var extEndName=_file.substring(i+1, len);
            var extName="GIF,BMP,JPG,JPEG,PNG";
            //首先对格式进行验证
            if(extName.indexOf(extEndName.toUpperCase())==-1) {
                layer.open({content: "只能上传"+extName+"格式的文件",btn: '确定'});
                return false
            }else if(files[j].size > 10485760){
                layer.open({content: "最大只能上传10M的图片",btn: '确定'});
                return false
            }
        }
        if(files.length==0){return;};
        var allfiles = $scope.totalfiles.concat(files);
        if(allfiles.length>10){/*alert("最多选择10张！")*/ layer.open({content: '最多选择10张哦',btn: '确定'});return;}
        $scope.totalfiles=allfiles;
    };
    $scope.drophonor = function(honorfile){
        angular.forEach($scope.totalfiles,function(item, key){  if(item == honorfile){  $scope.totalfiles.splice(key,1);  return false; }  });
    };
    function checkGoodsSubmit(){ // 检查必须填写项    货品
        if ($scope.title == undefined || $scope.title == '' ) {  return false; }
        if ($scope.unitprice == undefined) { return false; }
        if ($scope.codeLave11 == undefined || $scope.codeLave11 == '') { return false; }
        if ($scope.sqm == undefined || $scope.sqm == '') {  return false;  }
        if ($scope.telephone.trim() == undefined || $scope.telephone.trim() == '') {  return false; }
        if ($scope.validStartTime == undefined || $scope.validStartTime == '') { return false; }
        if ($scope.validEndTime == undefined || $scope.validEndTime == '') { return false;  }
        return true;
    }

    $scope.goodSubmit = function(){
        $scope.rdcID = '';
        $scope.validStartTime = $("#sttime").val();
        $scope.validEndTime = $("#endtime").val();
        $scope.rdcAddress = $("#province option:selected").text()+"-"+$("#city option:selected").text();
        if(window.flag2==1){
            $scope.typeCode = 2;
            $scope.typeText = "求购";
        }
        if($scope.rdcflag==0)
        {
            $scope.rdcID = $scope.rdcdto.rdcID;
            $scope.provinceId=$scope.rdcdto.provinceid;
            $scope.cityId=$scope.rdcdto.cityid;
            $scope.rdcAddress = $scope.rdcdto.address;
        }
        if(Date.parse($('#sttime').val().replace(/-/g,"/")) > Date.parse($('#endtime').val().replace(/-/g,"/"))){
            layer.open({content:'开始时间和结束时间冲突，请更改~',btn: '确定'});
            return false
        }
        if(checkMobile($scope.telephone.trim()) == false){
            layer.open({content:'请输入正确的手机号码或者座机号码~',btn: '确定'});
            return false
        }
        if(checkGoodsSubmit()){
            if($scope.title.length<6||$scope.title.length>24){
                layer.open({content: '描述文字长度范围是6~24位，请检查~', btn: '确定'});
                return;
            }else if($scope.sqm.toString().length > 11){
                layer.open({content:'数量不合法哦~',btn: '确定'});return;
            }else if($scope.unitprice == undefined || $scope.unitprice == null || $scope.unitprice == ""){
                $scope.unitprice = "";
            }else if($scope.unitprice.toString().length>11){
                layer.open({content:'单价不合法哦~',btn: '确定'});return;
            }
            layer.open({
                type: 2
                ,content: '努力加载中~~~'
                ,shadeClose:false
            });

            var simdata = {
                title:$scope.title,
                uid:window.user.id,
                provinceid : $scope.provinceId,
                cityid : $scope.cityId,
                codeLave1:$scope.codeLave11,
                unit1 : $scope.unit1,
                unitPrice : $scope.unitprice,
                validStartTime : $scope.validStartTime,
                validEndTime : $scope.validEndTime,
                sqm:$scope.sqm,
                telephone:$scope.telephone.trim(),
                note : $scope.note,
                dataType : 1,
                typeCode : $scope.typeCode,
                typeText : $scope.typeText,
                rdcID : $scope.rdcID,
                detlAddress:$scope.rdcAddress,
                publishunit:$scope.publishunit,
                username:window.user.username,
                unit:"元/吨"
            };
            var sdata  = JSON.stringify(simdata);
            var data = {data:sdata, "files":$scope.totalfiles};
            Upload.upload({
                url: ER.root+"/i/ShareRdcController/shareFreeRelease",
                headers :{ 'Content-Transfer-Encoding': 'utf-8' },
                data: data
            }).then(function (resp) {
                layer.closeAll();
                layer.open({
                    content: resp.data.message
                    ,btn: '确定'
                    ,shadeClose:false
                    ,yes:function(){
                        if(data!=null&&data!=undefined)
                            window.location.href ="releasesuccess.html?id=2";
                    }
                });
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.name);
            });
        }
        else {
            //alert("请填写标记*的必选项在提交!");
            layer.open({content: '请填写标记<em>*</em>的必选项再提交哦~',btn: '确定'});
        }
    };

});
