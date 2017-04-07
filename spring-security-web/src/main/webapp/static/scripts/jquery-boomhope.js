jQuery.boomhope = {
	// operators
	ajax : function(opts) {
		// opts
		var defaultsOpts = {
			async : false,
			cache : false,
			type : "POST",
			dataType : "JSON",
			showExMsg : true,
			showFailMsg : true
		}

		var option = $.extend({}, defaultsOpts, opts);

		jQuery.ajax({
			async : option.async,
			cache : option.cache,
			type : option.type,
			url : option.url,
			data : option.data,
			dataType : option.dataType,
			success : function(data, status, XHR) {
				if (data != 'undefined' && data) {
					if (data.exCode != null) {
						// 是否显示异常信息
						if (option.showExMsg) {
							$.messager.alert("提示", data.exMsg, "warning", null,
									15000);
						}
						// 异常处理
						if (option.onException) {
							option.onException.call(this, data, status, XHR);
						}
					} else {
						// 成功处理
						if (option.success) {
							option.success.call(this, data, status, XHR);
						}
					}
				} else {
					if (option.showFailMsg) {
						$.messager.alert("提示", "操作失败", "warning", null, 15000);
					}
					if (option.fail) {
						opts.fail.call(this, XHR, status, errorThrow);
					}
				}
			},
			error : function(XHR, status, errorThrow) {
				if (option.error) {
					option.error.call(this, XHR, status, errorThrow);
				}
			},
			complete : function(XHR, status) {
				if (option.complete) {
					option.complete.call(this, XHR, status);
				}
			}
		});
	},
	
	createSelectOrgDialog: function(options){
    	var defaultOptions = {
    			iconCls: "", 
				title: "选择机构", 
				valueId: "orgCode",
				nameId: "orgCodeName",
				singleSelect: true
    	};
    	var opts = $.extend({}, defaultOptions, options);
    	opts.src = opts.src+"?valueId="+opts.valueId+"&nameId="+opts.nameId+"&select="+$("#"+opts.valueId).val()+"&singleSelect="+opts.singleSelect;
    	$(parent).domain("openDialog", opts);
   },
   
   /*创建一个选择营业厅的对话框*/
//   createSelectBishallDialog
   selectBishallDialog: function(options){
   	var defaultOptions = {
   				src: '/bishall/bishall/selectHall',
   				iconCls: "", 
				title: "选择营业厅", 
				valueId: "hallCode",
				nameId: "hallName",
				singleSelect: true,
				width: 600, 
	            height: 400, 
   	};
   	var opts = $.extend({}, defaultOptions, options);
   	opts.src = opts.domain+opts.src+"?valueId="+opts.valueId+"&nameId="+opts.nameId+"&select="+$("#"+opts.valueId).val()+"&singleSelect="+opts.singleSelect;
   	$(parent).domain("openDialog", opts);
  },
   
	download : function(url, data) {
		// 创建一个隐藏的form
		var form = $("<form>");
		form.attr({
			style : 'display:none',
			target : '',
			method : 'post',
			action : url,
		});
		if (data) {
			for (var i = 0; i < data.length; i++) {
				var input = $("<input type='hidden' name='" + data[i].name
						+ "'/>");
				input.attr('value', data[i].value);
				form.append(input);
			}
		}
		$("body").append(form);//
		form.submit();
	},
	/**
	 * 上传文件 <script type="text/javascript"
	 * src="${requestContext.contextPath}/resources/scripts/jquery.form.min.js"></script>
	 * 
	 * @param opts
	 *            {formId: form的id号,url: 提交的url,
	 */
	upload : function(opts) {
		// opts
		var defaultsOpts = {
			method : "POST",
			showExMsg : true,
			showFailMsg : true
		}

		var option = $.extend({}, defaultsOpts, opts);

		var form = $("#" + option.formId);
		form.attr("action", option.action);
		form.attr("method", option.method);
		form.ajaxSubmit(function(data) {
			if (data != 'undefined' && data) {
				if (data.exCode != null) {
					// 是否显示异常信息
					if (option.showExMsg) {
						$.messager.alert("提示", data.exMsg, "warning", null, 15000);
					}
				} else {
					// 成功处理
					if (option.success) {
						option.success.call(this, data);
					}
				}
			} else {
				if (showFailMsg) {
					$.messager.alert("提示", "操作失败", "warning", null, 15000);
				}
				if (option.fail) {
					option.fail.call(this, XHR);
				}
			}
		});
	}
};
