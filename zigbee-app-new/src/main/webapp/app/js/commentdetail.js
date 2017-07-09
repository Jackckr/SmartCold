checkLogin();
angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	 $http.defaults.withCredentials=true;
	 $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 var rdcid  = getUrlParam("id");//当前rdc-id数据信息
	 $scope.totalfiles = [], $scope.totalauthfiles = [], $scope.isDisabled = false;
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
			if(allfiles.length>5){/*alert("最多选择10张！")*/ layer.open({content: '最多选择5张哦',btn: '确定'});return;}
	        $scope.totalfiles=allfiles; 
	    };
	    $scope.drophonor = function(honorfile){
	        angular.forEach($scope.totalfiles,function(item, key){
	            if(item == honorfile){
	                $scope.totalfiles.splice(key,1);
	                return false;
	            }
	        });
	    };
	    
	    
	    function checkCommentSubmit(){
	        return $scope.commentinfo!= undefined && $scope.commentinfo != ''; // 检查必须填写项
	    }
	    
	    $scope.submit = function(){
	    	if(window.grade == undefined || window.locationGrade == undefined || window.facilityGrade == undefined || window.serviceGrade == undefined || window.sanitaryGrade == undefined){
	    		layer.open({content: '评分最低分为1分哦　*^_^*',btn: '确定'});return;
	    	}
	    	if(checkCommentSubmit()){
	    		layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });
	    	if($scope.commentinfo==undefined){$scope.commentinfo="";}
			data = {
					file0: null,
					file1: null,
					file2: null,
					file3: null,
					file4: null,
					commerID:window.user.id,
					rdcID : rdcid,
					content : encodeURI($scope.commentinfo,"UTF-8"),
					grade : window.grade,
					locationGrade : window.locationGrade,
					facilityGrade : window.facilityGrade,
					serviceGrade : window.serviceGrade,
					sanitaryGrade : window.sanitaryGrade,
			};
			for(var i = 0; i < $scope.totalfiles.length; i++){
				data["file" + i] = $scope.totalfiles[i];
			}
			Upload.upload({
	            url: ER.root+'/i/review/add',
	            headers :{ 'Content-Transfer-Encoding': 'utf-8' },
	            data: data
	        }).then(function (resp) {
	        	layer.closeAll();
		    	layer.open({
		    		content: '评价成功'
		    		,btn: '确定'
	    			,shadeClose:false
	                ,yes:function(){
	                	if(data!=null&&data!=undefined)
	    		    	   window.location.href ="rdcdetail.html?id="+rdcid;
	                }
		    	});
	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	        }, function (evt) {});
		}
	    	else{
	    		layer.open({content: '评论内容不能为空或者特殊字符~',btn: '确定'});return;
	    	}
	  };
	  /**
	   * 冷库认证 js
	   * 
	   * 2017.3.29
	   * 
	  */
	    $scope.dropauth = function (authfile) {
	        angular.forEach($scope.totalauthfiles, function (item, key) {
	            if (item == authfile) {
	                $scope.totalauthfiles.splice(key, 1);
	                return false;
	            }
	        })
	    }
	    $scope.addAuthFiles = function (files) {
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
	        	}else{
	        		if ($scope.totalauthfiles.length + files.length > 1) {
	        			layer.open({content: '只能上传1张图片哦',btn: '确定'});
	                    return;
	                }
	                $scope.totalauthfiles = $scope.totalauthfiles.concat(files);
	        	}
	    	}
	        
	    }
	    function checkCommit(){
	        if($scope.totalauthfiles.length !== 1)
	            return false;
	        else
	            return true;
	    }
	    $scope.submit_auth = function () {
	        if (checkCommit()) {
	        	layer.open({
	        		type: 2
	        		,content: '努力加载中~~~'
	        		,shadeClose:false
			    });
	            $scope.isDisabled = true;
	            var data = {
                    authfile: null,
	                rdcId: rdcid,
	                userId:window.user.id,
					userName:window.user.username,
					type:window.user.type
	            }
	            data["authfile"] = $scope.totalauthfiles[0];

	            Upload.upload({
	                url:  ER.root+'/i/rdc/attestationRdc',
	                headers: {'Content-Transfer-Encoding': 'utf-8'},
	                data: data
	            }).then(function (resp) {
	            	layer.closeAll();
			    	layer.open({
			    		content: "提交成功,等待审核"
			    		,btn: '确定'
		    			,shadeClose:false
		                ,yes:function(){
		                	if(data!=null&&data!=undefined)
		    		    	   window.location.href ="rdcdetail.html?id="+rdcid;
		                }
			    	});
	                $scope.isDisabled = false;
	            });
	        } else {
	        	layer.open({content: '请上传冷库认证图片再提交哦',btn: '确定'});
	        }
	    }
});
