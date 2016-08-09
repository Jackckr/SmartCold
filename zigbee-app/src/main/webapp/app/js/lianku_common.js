
	 function get2DCode(){
//		  window.addEventListener("DOMContentLoaded", function () {  
			  debugger;
			   $("#video").show();
		        var video = document.getElementById("video"), canvas, context;  
		        if(video==null){return;}
		        try {  
		            canvas = document.createElement("canvas");  
		            context = canvas.getContext("2d");  
		        } catch (e) { alert("not support canvas!"); return; }  
		        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;  
		  
		  
		        if (navigator.getUserMedia)  
		            navigator.getUserMedia(  
		                { "video": true },  
		                function (stream) {  
		                    if (video.mozSrcObject !== undefined)video.mozSrcObject = stream;  
		                    else video.src = ((window.URL || window.webkitURL || window.mozURL || window.msURL) && window.URL.createObjectURL(stream)) || stream;                 
		                    video.play();  
		                },  
		                function (error) {  
		                    //if(error.PERMISSION_DENIED)console.log("用户拒绝了浏览器请求媒体的权限",error.code);  
		                    //if(error.NOT_SUPPORTED_ERROR)console.log("当前浏览器不支持拍照功能",error.code);  
		                    //if(error.MANDATORY_UNSATISFIED_ERROR)console.log("指定的媒体类型未接收到媒体流",error.code);  
		                    alert("Video capture error: " + error.code);  
		                }  
		            );  
		        else alert("Native device media streaming (getUserMedia) not supported in this browser");  
		         
		  
		  
		        setInterval(function () {  
		            context.drawImage(video, 0, 0, canvas.width = video.videoWidth, canvas.height = video.videoHeight);  
		            $.post('/Home/QRcodeDecode', { "img": canvas.toDataURL().substr(22) }, function (data, status) {  
		                if (status == "success" && data != "no")location.href = "/Home/Result/" + data;                 
		            }, "text");  
		        }, 500);  
		  
		  
//		    }, false); 
		  
		 
		 
	 }

	
	  
	  
	  jQuery.fn.fmselectbox = function(options) {
		    var _$combox = this;
		    var _settings = {vl: 'typeCode', txt: 'displayNameCh',cs:'com.farmen.core.entities.CommMataData'};
		    jQuery.extend(_settings, options);
		    $.ajax({ url: 'action/platform_comm_content/uiutilcontroller/ui_getSeleectData.json',DataType: "json", type: 'POST',data: _settings,async: false,success: function(data) {
		    	if (data.success && data.data.length > 0) {
		                var selectdat = data.data;
		                var vl = _settings.vl,
		                txt = _settings.txt,
		                key = _settings.key,
		                value=_settings.value;
		                for (var i in selectdat) {
		                    if (selectdat[i][txt] != undefined) {
		                        _$combox.append('<option value="' + selectdat[i][vl] + '">' + selectdat[i][txt] + '</option>');
		                        if(key!= undefined&&key!=""&&key==selectdat[i][txt]||value!= undefined&&value!=""&&value==selectdat[i][vl]){
		                        	_$combox.prop('selectedIndex',i);
		                        }
		                    }
		                }
		               
		            }
		        }
		    })
		};


