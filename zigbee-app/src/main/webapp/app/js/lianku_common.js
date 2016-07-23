

	
	  
	  
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


