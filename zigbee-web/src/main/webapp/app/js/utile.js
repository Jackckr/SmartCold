	var util = {
		fromQueryString: function (o, e) {
            var n, r, i, a, s, l, d, c, u, f, m, p, h, g, v = o.replace(/^\?/, "").split("&"), b = {};
            for (s = 0, l = v.length; l > s; s++)if (d = v[s], d.length > 0)if (r = d.split("="), i = decodeURIComponent(r[0]), a = void 0 !== r[1] ? decodeURIComponent(r[1]) : "", e) {
                if (f = i.match(/(\[):?([^\]]*)\]/g), m = i.match(/^([^\[]+)/), !m)throw new Error('[jQuery.util.fromQueryString] Malformed query string given, failed parsing name from "' + d + '"');
                if (i = m[0], p = [], null === f) {
                    b[i] = a;
                    continue;
                }
                for (c = 0, u = f.length; u > c; c++)h = f[c], h = 2 === h.length ? "" : h.substring(1, h.length - 1), p.push(h);
                for (p.unshift(i), n = b, c = 0, u = p.length; u > c; c++)h = p[c], c === u - 1 ? t.isArray(n) && "" === h ? n.push(a) : n[h] = a : ((void 0 === n[h] || "string" == typeof n[h]) && (g = p[c + 1], n[h] = t.isNumeric(g) || "" === g ? [] : {}), n = n[h])
            } else b.hasOwnProperty(i) ? (t.isArray(b[i]) || (b[i] = [b[i]]), b[i].push(a)) : b[i] = a;
            return b;
        },
		getParameter : function(t) {
			var o = this.fromQueryString(decodeURI(window.location.search))[t];
			return o ? o : null;
		}
		,mask : function(msg,el) {
			var _el = el || $('body');
            _el.block({
                message : '<div class="mask-inner">'+
                            '<div style="height:25px;background:url('+RP+'/assets/img/fm_common/loading.gif) no-repeat bottom;"></div>'+
                            '<div style="line-height:30px;font-size:12px;">'+(msg?msg:'玩命加载中，请稍候...')+'</div>'+
                        '</div>',
                css : {
                    border : '2px solid #333',
                    height : '65px',
                    width : '200px'
                }
            });
		}
		,unmask : function(el) {
			var _el = el || $('body');
			_el.unblock();
		}
		,openModule4SinglePage:function(moduleUrl,theme){
			window.open(RP + '/single_page/singlePage'+(theme?'_'+theme:'')+'.jsp?loadUrl=' + encodeURIComponent(moduleUrl),new Date().getTime());
		}
        /**
         * 提示框
         */
		,info: function info(title, msg, callback){
            callback = callback || function(){};
            var __infoEl = $(
            ['<div class="modal fade" role="dialog">'
              ,'<div class="modal-dialog" role="document">'
                ,'<div class="modal-content">'
                  ,'<div class="modal-header">'
                    ,'<button type="button" class="close hide" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    ,'<h4 class="modal-title">温馨提示</h4>'
                  ,'</div>'
                  ,'<div class="modal-body">'
                    ,'<div class="container-fluid">'
                    ,'</div>'
                  ,'</div>'
                  ,'<div class="modal-footer">'
                    ,'<button type="button" class="btn btn-default" data-dismiss="modal">确定</button>'
                    ,'<button type="button" class="btn btn-primary hide">Save changes</button>'
                  ,'</div>'
                ,'</div>'
              ,'</div>'
            ,'</div>'].join(''));
            if(/.+/.test(title) && title){
                __infoEl.find('.modal-title').text(title);
            };
            if(/.+/.test(msg) && msg){
                __infoEl.find('.container-fluid').html(msg);
            };
            __infoEl.on('hidden.bs.modal',function(e){
                callback.call(this,e);
                __infoEl.remove();
            });
            $('body').append(__infoEl.addClass('js-modal-info'));
            __infoEl.modal(true);
        }
        /**
         * 确认框
         */
		,quest: function info(title, msg, callback){
            callback = callback || function(){};
            var __infoEl = $(
            ['<div class="modal fade" role="dialog">'
              ,'<div class="modal-dialog" role="document">'
                ,'<div class="modal-content">'
                  ,'<div class="modal-header">'
                    ,'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                    ,'<h4 class="modal-title">温馨提示</h4>'
                  ,'</div>'
                  ,'<div class="modal-body">'
                    ,'<div class="container-fluid">'
                    ,'</div>'
                  ,'</div>'
                  ,'<div class="modal-footer">'
                    ,'<button type="button" class="btn btn-cancel" data-dismiss="modal">取消</button>'
                    ,'<button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>'
                  ,'</div>'
                ,'</div>'
              ,'</div>'
            ,'</div>'].join(''));
            if(/.+/.test(title) && title){
                __infoEl.find('.modal-title').text(title);
            };
            if(/.+/.test(msg) && msg){
                __infoEl.find('.container-fluid').html(msg);
            };
            __infoEl.on({'click':function(e){
                callback.call(this,$(e.currentTarget).is('.btn-primary')?'yes':'no',e);
                __infoEl.remove();
            }},'.btn-cancel,.btn-primary');
            $('body').append(__infoEl.addClass('js-modal-info'));
            __infoEl.modal(true);
        }
        ,loadModule :function(_url,params,noHistory){
//        	debugger;
        	if(_AJAX_LOAD != null && _AJAX_LOAD.readyState !=4){
        		_AJAX_LOAD.abort();
        	}
        	var me = this;
        	params = params || {};
            me.mask();
            _AJAX_LOAD = $.ajax({
            	url:_url
            	,type:'POST'
            	,cache:false
            	,dataType:'html'
            	,data:params
            	,success:function(evt, request, settings){
            		loadEl.html(evt);
            	}
            	,error:function(e){
            		loadEl.html('加载失败');
//            		console.log(e);
            	}
            	,complete:function(){
            		me.unmask();
            	}
            });
            if(noHistory !== true)_history.push(_url,params);
        }
        /**
         */
        ,applyData : function(el, dataObj){
        	dataObj = dataObj || {};
        	el = $(el);
        	for(var i in dataObj){
        		var _el = el.find('[data-mp-key='+ i +']');
        		if(_el.is('input,textarea,select')){
        			_el.val(dataObj[i]);
        		}else if(_el.is('img')){
        			_el.attr('src',dataObj[i]);
        		}else{
        			_el.html(dataObj[i]);
        		}
        	}
        	return el;
        }
        ,wrapSuccessFn :function(fN){
        	return function(data, textStatus, jqXHR){
        		if(data && data.extra && data.extra == 'SESSION_OUT'){
        			CommonLogin.gotoLoginPage();
        		}
        		if($.isFunction(fN))fN.call(this,data, textStatus, jqXHR);
        	};
        }
	};
	window.alert = $.proxy(function(msg){
		util.info(null,msg);
		});