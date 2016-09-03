coldWeb.controller('infoManage', function($rootScope, $scope, $state, $cookies,
		$http, $location, Upload) {
	$scope.load = function() {
		$.ajax({
			type : "GET",
			cache : false,
			dataType : 'json',
			url : '/i/admin/findAdmin'
		}).success(
				function(data) {
					$rootScope.admin = data.entity;
					if ($rootScope.admin == null || $rootScope.admin.id == 0) {
						url = "http://" + $location.host() + ":"
								+ $location.port() + "/login.html";
						window.location.href = url;
					}
				});
		//实例化编辑器
		//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
		var ue = UE.getEditor('editor');
	};
	$scope.load();
	$scope.id = 0;
	$scope.maxSize = 10;
	// 总条目数(默认每页十条)
	$scope.bigTotalItems = 10;
	// 当前页
	$scope.bigCurrentPage = 1;
	// 获取资讯分类列表
	$http.get('/i/information/findAllInforCategory').success(function(data) {
		$scope.inforCategorys = data;
		$scope.inforCategory = data[0].id;
	});

	// 获取资讯列表
	$scope.getAllInformation = function() {
		$http({
			method : 'POST',
			url : '/i/information/findAllInformationForAdmin',
			params : {
				pageNum : $scope.bigCurrentPage,
				pageSize : $scope.maxSize,
				keyword : $scope.keyword,
				posterID : $rootScope.admin.id
			}
		}).success(function(data) {
			$scope.bigTotalItems = data.total;
			$scope.AllInformation = data.list;
		});
	};

	$scope.getAllInformation();

	$scope.pageChanged = function() {
		$scope.getAllInformation();
	};

	$scope.goSearch = function() {
		$scope.getAllInformation();
	};
	
	
	

	function delcfm() {
		if (!confirm("确认要删除？")) {
			return false;
		}
		return true;
	}

	$scope.goDelete = function(inforID) {
		if (delcfm()) {
			$http.get('/i/information/deleteInformation', {
				params : {
					"inforID" : inforID
				}
			}).success(function(data) {
				$scope.getAllInformation();
			});
		}
	};
	
	$scope.goDetail = function(inforID) {
	  $http.get('/i/information/findInformationByID', {
				params : {
					"inforID" : inforID
				}
			}).success(function(data) {
				$scope.informationDetail = data;
				document.getElementById("content").innerHTML=$scope.informationDetail.content;
			});
	};
	

	$scope.goEdit = function(inforID) {
		// 获取当前冷库的详情
		$http.get('/i/information/findInformationByID', {
			params : {
				"inforID" : inforID
			}
		}).success(
				function(data) {
					$scope.inforCategory = data.category;
					$scope.title = data.title;
					$scope.mainwords = data.keywords;
					$scope.content = data.content;
					$scope.id = data.id;
					$scope.coverpic = data.coverpic;
					UE.getEditor('editor').setContent($scope.content);
					$('#img0').attr("src",$scope.coverpic);
					$('#myTab li').eq(0).addClass('active').siblings()
							.removeClass('active');
					$('#addNews').addClass('active').addClass('in').siblings()
							.removeClass('active').removeClass('in');
				});
	};

	function checkInput() {
		var flag = true;
		// 检查必须填写项
		if ($scope.title == undefined || $scope.title == '') {
			flag = false;
		}
		if ($scope.content == undefined || $scope.content == '') {
			flag = false;
		}
		return flag;
	}
	 $scope.addCoverPic = function (arrangePic) {
	   };

	$scope.inforSubmit = function() {
		// alert(UE.getEditor('editor').getContent());
		$scope.content = UE.getEditor('editor').getContent();
		if (checkInput()) {
			 data = {
					    'id' : $scope.id,
						'title' : $scope.title,
						'category' : $scope.inforCategory,
						'posterid' : $rootScope.admin.id,
						'keywords' : $scope.mainwords,
						'content' : $scope.content,
						'uploadcoverpic' : $scope.coverpic
		            };
			  Upload.upload({
	                url: '/i/information/addInformation',
	                headers :{ 'Content-Transfer-Encoding': 'utf-8' },
	                data: data
	            }).then(
						function(resp) {
							alert("添加成功");
							window.location.reload();
						},
						function(resp) {
							console.log('Error status: ' + resp.status);
						},
						function(evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded
									/ evt.total);
							console.log('progress: ' + progressPercentage + '% '
									+ evt.name);
						});
		} else {
			alert("标题和内容不允许为空!");
		}
	};

	/* 
	 function getAllHtml() {
	     alert(UE.getEditor('editor').getAllHtml());
	 }
	 function isFocus(e){
	     alert(UE.getEditor('editor').isFocus());
	     UE.dom.domUtils.preventDefault(e);
	 }
	 function setblur(e){
	     UE.getEditor('editor').blur();
	     UE.dom.domUtils.preventDefault(e);
	 }
	 function insertHtml() {
	     var value = prompt('插入html代码', '');
	     UE.getEditor('editor').execCommand('insertHtml', value);
	 }
	 function createEditor() {
	     enableBtn();
	     UE.getEditor('editor');
	 }
	
	 function getContent() {
	     var arr = [];
	     arr.push("使用editor.getContent()方法可以获得编辑器的内容");
	     arr.push("内容为：");
	     arr.push(UE.getEditor('editor').getContent());
	     alert(arr.join("\n"));
	 }
	 function getPlainTxt() {
	     var arr = [];
	     arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
	     arr.push("内容为：");
	     arr.push(UE.getEditor('editor').getPlainTxt());
	     alert(arr.join('\n'));
	 }
	 function setContent(isAppendTo) {
	     var arr = [];
	     arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
	     UE.getEditor('editor').setContent('欢迎使用ueditor', isAppendTo);
	     alert(arr.join("\n"));
	 }
	 function setDisabled() {
	     UE.getEditor('editor').setDisabled('fullscreen');
	     disableBtn("enable");
	 }

	 function setEnabled() {
	     UE.getEditor('editor').setEnabled();
	     enableBtn();
	 }

	 function getText() {
	     //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
	     var range = UE.getEditor('editor').selection.getRange();
	     range.select();
	     var txt = UE.getEditor('editor').selection.getText();
	     alert(txt);
	 }

	 function getContentTxt() {
	     var arr = [];
	     arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
	     arr.push("编辑器的纯文本内容为：");
	     arr.push(UE.getEditor('editor').getContentTxt());
	     alert(arr.join("\n"));
	 }
	 function hasContent() {
	     var arr = [];
	     arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
	     arr.push("判断结果为：");
	     arr.push(UE.getEditor('editor').hasContents());
	     alert(arr.join("\n"));
	 }
	 function setFocus() {
	     UE.getEditor('editor').focus();
	 }
	 function deleteEditor() {
	     disableBtn();
	     UE.getEditor('editor').destroy();
	 }
	 function disableBtn(str) {
	     var div = document.getElementById('btns');
	     var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
	     for (var i = 0, btn; btn = btns[i++];) {
	         if (btn.id == str) {
	             UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
	         } else {
	             btn.setAttribute("disabled", "true");
	         }
	     }
	 }
	 function enableBtn() {
	     var div = document.getElementById('btns');
	     var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
	     for (var i = 0, btn; btn = btns[i++];) {
	         UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
	     }
	 }

	 function getLocalData () {
	     alert(UE.getEditor('editor').execCommand( "getlocaldata" ));
	 }

	 function clearLocalData () {
	     UE.getEditor('editor').execCommand( "clearlocaldata" );
	     alert("已清空草稿箱");
	 }*/
});
