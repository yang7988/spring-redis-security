//<!-- 修复按钮禁用仍然可以调整的问题  -->
	$.extend($.fn.linkbutton.methods, {
	    /**
	     * 激活选项（覆盖重写）
	     * @param {Object} jq
	     */
	    enable: function(jq){
	        return jq.each(function(){
	            var state = $.data(this, 'linkbutton');
	            if ($(this).hasClass('l-btn-disabled')) {
	                var itemData = state._eventsStore;
	                //恢复超链接
	                if (itemData.href) {
	                    $(this).attr("href", itemData.href);
	                }
	                //回复点击事件
	                if (itemData.onclicks) {
	                    for (var j = 0; j < itemData.onclicks.length; j++) {
	                        $(this).bind('click', itemData.onclicks[j]);
	                    }
	                }
	                //设置target为null，清空存储的事件处理程序
	                itemData.target = null;
	                itemData.onclicks = [];
	                $(this).removeClass('l-btn-disabled');
	            }
	        });
	    },
	    /**
	     * 禁用选项（覆盖重写）
	     * @param {Object} jq
	     */
	    disable: function(jq){
	        return jq.each(function(){
	            var state = $.data(this, 'linkbutton');
	            if (!state._eventsStore)
	                state._eventsStore = {};
	            if (!$(this).hasClass('l-btn-disabled')) {
	                var eventsStore = {};
	                eventsStore.target = this;
	                eventsStore.onclicks = [];
	                //处理超链接
	                var strHref = $(this).attr("href");
	                if (strHref) {
	                    eventsStore.href = strHref;
	                    $(this).attr("href", "javascript:void(0)");
	                }
	                //处理直接耦合绑定到onclick属性上的事件
	                var onclickStr = $(this).attr("onclick");
	                if (onclickStr && onclickStr != "") {
	                    eventsStore.onclicks[eventsStore.onclicks.length] = new Function(onclickStr);
	                    $(this).attr("onclick", "");
	                }
	                //处理使用jquery绑定的事件
	                var eventDatas = $(this).data("events") || $._data(this, 'events');
	                if (eventDatas["click"]) {
	                    var eventData = eventDatas["click"];
	                    for (var i = 0; i < eventData.length; i++) {
	                        if (eventData[i].namespace != "menu") {
	                            eventsStore.onclicks[eventsStore.onclicks.length] = eventData[i]["handler"];
	                            $(this).unbind('click', eventData[i]["handler"]);
	                            i--;
	                        }
	                    }
	                }
	                state._eventsStore = eventsStore;
	                $(this).addClass('l-btn-disabled');
	            }
	        });
	    }
	});
 //	<!-- 修复按钮禁用仍然可以调整的问题 -->
//返回卡片中的信息
//card 为空间的的object的id
// params["cardNum"] 获取相应的卡号,获取接触卡或者非接触卡
function getCardInfo( params ){
	var array =[];
	var result = {};
	array[0] =["VerifyPin", "GetCardValidDate","GetCardGetDate","GetCardOrgNum","GetCardId",        "GetPersionBirthland","GetCardVersion","GetPersionBirthday", "GetCardNum",     "GetCardSerialNum","GetPersionNation","GetSbNum",	  "GetPersionId","GetPersionSex",  "GetPersionName","GetYibaoNo"];
	array[1] =["",			"",				  "",				"",            "GetM1SBCardIDNum", "",		           "",				 "",				  "GetM1SBCardNum", "GetM1CardSN",		"GetM1NationCode","GetM1SBDNCode","GetM1IDNum",  "GetM1GenderCode","GetM1Name",		 ""];
	array[2] =["pin",		"validDate",	  "makeDate",		"orgNum",      "identitiy",		   "land",		       "version",		 "birthday",		  "cardNum",		  "cardSerial",		"nationCode",	  "sbNum",		  "idNum",       "gender",		   "name",			"medAccount"];
	var cardSerialObj= JSON.parse( card.GetCardNum() ); // 卡号
	var touch =   cardSerialObj.flag =="1" ? 0 : 1;  // 卡类型
	
	for( index in params){
		
		for(var i=0; i<array[2].length;i++){
			if( array[2][i]==params[index]	){

				var obj  = {};
				try{
					obj = JSON.parse( card[ array[touch][i] ]() );
				}catch( e ){
					obj.flag = 0;
				}
				result[ params[index] ]= (obj.flag=="1" ? obj.result : "" ) ;
			}
		}
	}
	return  result;
}

function submitForm(event) {
    event = event || window.event;
    if (event.keyCode === 13) {
        $('#btnVerify').click();
        $('#btnRead').click();
    }
}

//读卡数据前，验证读卡器等
function beforeReader( contextPath ){
	
	if( navigator.userAgent.indexOf('MSIE')<0 || navigator.userAgent.indexOf('Opera')>=0){
		top.$.messager.alert("提示","当前功能所需控件仅支持IE内核的浏览器!","warning");
		return ;
	}
	
	if( !card.IsReaderCard() ){
		top.$.messager.alert("提示","请插入读卡器","warning");
		return ;
	}			
	
	var obj =  getCardInfo( ["cardSerial"] );  // 读卡数据
	
	if( $.gzcard.isNull( obj.cardSerial)  ) {
		
		
		$.messager.alert("提示","请确认待检验卡片是否已正确放置，如果已正确放置则将进行问题卡登记!","warning");
		/*top.$.messager.confirm("提示", "读卡器读取不到卡片信息，" + 
					 "请确认待检验卡片是否已正确放置，如果已正确放置则将进行问题卡登记，否则，请正确放置卡片后再点击\"读卡\"按钮。",
			 function (ok) {
				if ( ok) {  // 确定,问题卡登记
	            	$(parent).domain("openDialog", {
	                	title : "芯片异常登记",
	                    src : "/model/page?cmd=419006",
	                    width : 375,
	                    height : 210,
	                    onClose : function(){
	                    	window.location.href = contextPath+"/model/page?cmd=418006";
	                    }
	            	});
	            }else{  //取消
	            	window.location.href = contextPath+"/model/page?cmd=418006";
	            }
	        });*/
	}
}

// 获取指定cmd在数据 的value, text:value的name
function cmdData(url, value,text){
	var result ="";
	if (typeof text =="undefined" ) text = "text";
	$.gzcard.ajax({
 	   url:url,
 	   success: function(data){
 			   
 		   for(var i = 0; i < data.length; i++){
 			   if( data[i].value == value ){
	 			   result =  data[i][text];
	 			   break;
 			   }
 		   }
 	   }
	});
	return result;
}



