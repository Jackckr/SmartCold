var smartCold = "http://cold360.cn/";                                                                                                                                           
var user = JSON.parse(localStorage.user);
mui.init();
//初始化单页view
var viewApi = mui('#app').view({
    defaultPage: '#setting'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
defaultInfo();
function defaultInfo(){
	document.getElementById("head-img").src = user.avatar;
    document.getElementById("userName").innerHTML = user.username;
    if(user.nickName){document.getElementById("nickName").innerHTML = user.nickName;}
    if(user.telephone){document.getElementById("telephone").innerHTML = user.telephone;}    
}

var view = viewApi.view;
(function ($) {
    //处理view的后退与webview后退
    var oldBack = $.back;
    $.back = function () {
        if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
            viewApi.back();
        } else { //执行webview后退
            oldBack();
        }
    };
})(mui);
document.getElementById('loginOut').addEventListener('tap', function() {
	var btnArray = ['是', '否'];
    mui.confirm('您确定退出?', '', btnArray, function(e) {
        if (e.index == 0) {
            if (mui.os.ios || mui.os.ipad || mui.os.iphone) {
                // 获取所有Webview窗口
                var curr = plus.webview.currentWebview();
                var wvs = plus.webview.all();
                for (var i = 0, len = wvs.length; i < len; i++) {
                    //关闭除setting页面外的其他页面
                    if (wvs[i].getURL() == curr.getURL())
                        continue;
                    plus.webview.close(wvs[i]);
                }
                //打开login页面后再关闭setting页面
                plus.webview.open('login.html');
                curr.close();
            } else{
            	plus.runtime.quit();
            }
            mui.get(smartCold+'/i/user/logout',function(data){
				clearCookie();
			},'json');
        }
    })
	
})
//更换头像
mui(".mui-table-view-cell").on("tap", "#head", function (e) {
    if (mui.os.plus) {
        var a = [{
            title: "拍照"
        }, {
            title: "从手机相册选择"
        }];
        plus.nativeUI.actionSheet({
            title: "修改头像",
            cancel: "取消",
            buttons: a
        }, function (b) {
            switch (b.index) {
                case 0:
                    break;
                case 1:
                    getImage();
                    break;
                case 2:
                    galleryImg();
                    break;
                default:
                    break
            }
        })
    }

});

function getImage() {
    var c = plus.camera.getCamera();
    c.captureImage(function (e) {
        plus.io.resolveLocalFileSystemURL(e, function (entry) {
            var s = entry.toLocalURL() + "?version=" + new Date().getTime();
            console.log(s);
            document.getElementById("head-img").src = s;
            //变更大图预览的src
            //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
            document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();
        }, function (e) {
            console.log("读取拍照文件错误：" + e.message);
        });
    }, function (s) {
        console.log("error" + s);
    }, {
        filename: "_doc/head.jpg"
    })
}

function galleryImg() {
    plus.gallery.pick(function (a) {
        plus.io.resolveLocalFileSystemURL(a, function (entry) {
            plus.io.resolveLocalFileSystemURL("_doc/", function (root) {
                root.getFile("head.jpg", {}, function (file) {
                    //文件已存在
                    file.remove(function () {
                        console.log("file remove success");
                        entry.copyTo(root, 'head.jpg', function (e) {
                                var e = e.fullPath + "?version=" + new Date().getTime();
                                document.getElementById("head-img").src = e;
                                //document.getElementById("head-img1").src = e;
                                //变更大图预览的src
                                //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
                                document.querySelector("#__mui-imageview__group .mui-slider-item img").src = e + "?version=" + new Date().getTime();
                                ;
                            },
                            function (e) {
                                console.log('copy image fail:' + e.message);
                            });
                    }, function () {
                        console.log("delete image fail:" + e.message);
                    });
                }, function () {
                    //文件不存在
                    entry.copyTo(root, 'head.jpg', function (e) {
                            var path = e.fullPath + "?version=" + new Date().getTime();
                            document.getElementById("head-img").src = path;
                            //document.getElementById("head-img1").src = path;
                            //变更大图预览的src
                            //目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
                            document.querySelector("#__mui-imageview__group .mui-slider-item img").src = path;
                        },
                        function (e) {
                            console.log('copy image fail:' + e.message);
                        });
                });
            }, function (e) {
                console.log("get _www folder fail");
            })
        }, function (e) {
            console.log("读取拍照文件错误：" + e.message);
        });
    }, function (a) {
    }, {
        filter: "image"
    })
};
function clearCookie(){//清除cookie和localstorage
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    localStorage.clear();
    if (keys) {
        for (var i =  keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }    
}