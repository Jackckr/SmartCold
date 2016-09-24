checkLogin();
angular.module('app', ['ngFileUpload']).controller('ctrl', function ($scope, Upload, $http) { 
	 $http.defaults.withCredentials=true;
	 $http.defaults.headers={'Content-Type': 'application/x-www-form-urlencoded'};
	 var rdcid  = getUrlParam("id");//当前rdc-id数据信息
	 $scope.totalfiles = [];
	 $scope.addFiles = function (files) {
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
	        var flag = true;
	        // 检查必须填写项
	        if ($scope.commentinfo == undefined || $scope.commentinfo == '' ) {
	            flag = false;
	        }
	        return flag;
	    }
	    
	    $scope.submit = function(){
	    	if(checkCommentSubmit){
			data = {
					file0: null,
					file1: null,
					file2: null,
					file3: null,
					file4: null,
					rdcID : rdcid,
					content : encodeURI($scope.commentinfo,"UTF-8"),
					grade : 1,
					locationGrade : 2,
					facilityGrade : 1,
					serviceGrade : 1,
					sanitaryGrade : 1,
			};
			for(i = 0; i < $scope.totalfiles.length; i++){
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
	    		    	   window.location.href ="colddetail.html?id="+rdcid;
	                }
		    	});
	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	        }, function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            console.log('progress: ' + progressPercentage + '% ' + evt.name);
	        });
		}
	    	else{
	    		layer.open({content: '请填写评论信息',btn: '确定'});return;
	    		}
	  };
});
