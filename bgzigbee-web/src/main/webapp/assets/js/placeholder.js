
    /**
     * @name placeHolder
     * @class 跨浏览器placeHolder,对于不支持原生placeHolder的浏览器，通过value或插入span元素两种方案模拟
     * @param {Object} obj 要应用placeHolder的表单元素对象
     * @param {Boolean} span 是否采用悬浮的span元素方式来模拟placeHolder，默认值false,默认使用value方式模拟
     */
    //执行
	jQuery(function(){
		jQuery(':input[placeholder]').each(function(index, element) {
			placeHolder(element,true);
	    });	
	});
	  

      function placeHolder(obj, span) {
        if (!obj.getAttribute('placeholder')) return;
        var imitateMode = span===true?true:false;
        var supportPlaceholder = 'placeholder' in document.createElement('input');
        if (!supportPlaceholder) {
            var defaultValue = obj.getAttribute('placeholder');
            var type = obj.getAttribute('type');
            if (!imitateMode) {
                obj.onfocus = function () {
                    (obj.value == defaultValue) && (obj.value = '');
                    obj.style.color = '';
                }
                obj.onblur = function () {
                    if (obj.value == defaultValue) {
                        obj.style.color = '';
                    } else if (obj.value == '') {
                        obj.value = defaultValue;
                        obj.style.color = '#ACA899';
                    }
                }
                obj.onblur();
            } else {
                var placeHolderCont = document.createTextNode(defaultValue);
                var oWrapper = document.createElement('span');
                oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
                oWrapper.className = 'wrap-placeholder';
                oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
                oWrapper.style.fontSize = getStyle(obj, 'fontSize');
                oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
                oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop'))!=0 ? getStyle(obj, 'marginTop'): 0 + 'px';
                oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
                oWrapper.style.width = (obj.offsetWidth - parseInt((getStyle(obj, 'marginLeft')=="auto"?0:(getStyle(obj, 'marginLeft')))))==0?100:(obj.offsetWidth - parseInt((getStyle(obj, 'marginLeft')=="auto"?0:(getStyle(obj, 'marginLeft'))))) + 'px';
                oWrapper.style.height = obj.offsetHeight==0?34:obj.offsetHeight + 'px';
                oWrapper.style.lineHeight = obj.nodeName.toLowerCase()=='textarea'? '':(obj.offsetHeight==0?34:obj.offsetHeight) + 'px';
                oWrapper.appendChild(placeHolderCont);
                obj.parentNode.insertBefore(oWrapper, obj);
                oWrapper.onclick = function () {
                    obj.focus();
                };
				//绑定input或onpropertychange事件,ie9中删除时无法触发此事件
                if (typeof(obj.oninput)=='object') {
                    obj.addEventListener("input", changeHandler, false);
                    obj.onpropertychange = changeHandler;
                    obj.onkeyup = delHandler;
                } else {
                    obj.onpropertychange = changeHandler;
                    obj.onkeyup = delHandler;
                }
                function changeHandler() {
                    oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                }
            	function delHandler(e){//监听del、backspace、ctrl+x
            		var e = e || window.event;
            		if(e.keyCode == 8 || e.keyCode == 46 || (event.ctrlKey&&e.keyCode == 88)){
            			oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
            		}
            	}
                /**
                 * @name getStyle
                 * @class 获取样式
                 * @param {Object} obj 要获取样式的对象
                 * @param {String} styleName 要获取的样式名
                 */
                function getStyle(obj, styleName) {
                    var oStyle = null;
                    if (obj.currentStyle)
                        oStyle = obj.currentStyle[styleName];
                    else if (window.getComputedStyle)
                        oStyle = window.getComputedStyle(obj, null)[styleName];
                    return oStyle;
                }
            }
        }
    }