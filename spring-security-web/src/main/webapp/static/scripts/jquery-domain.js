(function($) {
    /*抽取datagrid toobar功能*/
    function openCreateDialog(target,callback) {
        var t = $(target);
        var opts = t.datagrid("options");
        var url = opts.urlCreate || (opts.url.match(new RegExp("page", "i")) ? opts.url.replace(new RegExp("page", "i"), "create") : undefined);
        if (!url) {
            return;
        }
        $(parent).domain("openDialog", { 
            iconCls: "", 
            title: "新建" + opts.title, 
            src: url, 
            width: opts.openWidth, 
            height: opts.openHeight, 
            onClose: function() {
                t.datagrid("reload");
                if(typeof callback =="function"){
                    callback.call(this);
                }
            }
        });
    }
    
    function openEditDialog(target,callback){
        var t = $(target);
        var opts = t.datagrid("options");
        var node = t.datagrid("getSelected");
        if (!node) {
            $.messager.alert("信息", "很抱歉，尚未选择 " + opts.title + " 。", "info", null, 2000);
            return;
        }
        var pks = opts.idField.split(',');
        var pkParam = '';
        if(pks.length>=1)
        {
        	for(var i=0;i<pks.length;i++)
        	{
        		pkParam +='&';
        		pkParam += pks[i] + "=" + node[pks[i]];
        	}
        }
        //var url = (opts.urlEdit ? $.format(opts.urlEdit, id) : undefined) || (opts.url.match(new RegExp("page", "i")) ? opts.url.replace(new RegExp("page", "i"), "edit") + "/" + id : undefined);
        var url = opts.urlEdit;
        if (!url) {
            return;
        }
        url+=pkParam;
        $(parent).domain("openDialog", { 
            iconCls: "", 
            title: "编辑" + opts.title, 
            src: url, 
            width: opts.openWidth, 
            height: opts.openHeight, 
            onClose: function() {
                t.datagrid("reload");
                if(typeof callback =="function"){
                    callback.call(this);
                }
            }
        });
    }
    
    function openRemoveDialog(target){
        var t = $(target);
        var opts = t.datagrid("options");
        var url = opts.urlDelete || (opts.url.match(new RegExp("page", "i")) ? opts.url.replace(new RegExp("page", "i"), "deletes") : undefined);
        t.domain("deletes", { 
            url: url,
            title: opts.title
        });
    }

    /**
 * 表单初始化
 */
    function initForm(target, fn) {
        var t = $(target);
        t.find(":input[name]:visible, :input[numberboxname]:visible, :input[comboname]:hidden").each(function(ndx, dom) {
            var box = $(dom);
            if(box.attr("name")) {
                if (box.is(":text")) {//type为text的input
                    box.unbind("keyup").bind("keyup", {}, function(event) {
                        if (event.keyCode == 13) {
                            if (fn) {
                                window.setTimeout(function() {
                                    fn();
                                }, 0);
                            }
                        }
                    });
                }
                else if (box.is("select")) {
                    if (box.hasClass("easyui-combobox-disable") || box.hasClass("easyui-combotree-disable")) {
                        var c = box.hasClass("easyui-combobox-disable") ? "combobox" : "combotree";
                        var opts = $.fn[c].parseOptions(dom);
                        var ignore = box.attr("ignore") == "true";
                        var reg = new RegExp("\\{[^\\d]*\\}");
                        var url = opts.url || "";
                        if (url) {
                            url = ignore ? url.replace(reg, "") : (reg.test(url) ? null : url);
                        }
                        box[c]({
                            url: url,
                            onChange: function(nv, ov) {
                                handleChange(dom);
                                if (fn) {
                                    window.setTimeout(function() {
                                        fn();
                                    }, 0);
                                }
                            }
                        });
                    }
                    else {
                        box.unbind("change").bind("change", {}, function(event) {
                            if (fn) {
                                window.setTimeout(function() {
                                    fn();
                                }, 0);
                            }
                        });
                    }
                }
            }
            else if(box.attr("numberboxname")) {
				
            }
            else if(box.attr("comboname")) {
                if (box.hasClass("datebox-f") || box.hasClass("datetimebox-f")) {
                    box.datebox({
                        onSelect: function(date) {
                            if (fn) {
                                window.setTimeout(function() {
                                    fn();
                                }, 0);
                            }
                        }
                    });
                }
                else {
                    var c = box.hasClass("easyui-combobox") ? "combobox" : "combotree";
                    var opts = $.fn[c].parseOptions(dom);
                    if(!$.trim(opts.url)) {
                        box[c]({
                            onChange: function(nv, ov) {
                                handleChange(dom);
                                if (fn) {
                                    window.setTimeout(function() {
                                        fn();
                                    }, 0);
                                }
                            }
                        });
                    }
                }
            }
        });
        function handleChange(target) {
            var origin = $(target);
            var val = $.trim(origin.combo("getValue"));
            var linkages = origin.attr("linkages");
            if (linkages) {
                linkages = linkages.split(",");
                for (var i = 0; i < linkages.length; i++) {
                    var linkage = linkages[i];
                    var box = t.find(":input[comboname='" + linkage + "']:hidden");
                    box.combobox("clear");
                    if (val || box.attr("ignore") == "true") {
                        box.combobox("reload", box.attr("url").replace(new RegExp("\\{" + origin.attr("comboname") + "\\}", "i"), val));
                    }
                    else {
                        box.combobox("loadData", []);
                    }
                }
            }
        }
    }
    /**
 * 收集参数
 */
    function collect(target) {
        var t = $(target);
        if (t.form("validate") == false) {
            return false;
        }
        var collection = {};
        t.find(":input[type='radio']:checked").each(function(ndx, ele){
        	var box = $(this);
            var key = box.attr("name");
            var val = box.val();
            collection[key] = encodeURIComponent(val);
        });
        t.find(":input[name][type != 'radio']").each(function(ndx, ele) {
            var box = $(this);
            var key = box.attr("name");
            var val = box.val();
            if($.trim(val) == "") {
                if(box.is(":hidden") && box.hasClass("combo-value")) {
                    box = t.find(":input[comboname='" + key + "']");
                }
                val = box.attr("defaultValue") || (box.hasClass("number") ? -1 : "");
            }
            if(collection[key]==null)
            {
            	collection[key] = encodeURIComponent(val);
            }
        });
        t.find("textarea[name]").each(function(){
            var box =$(this),
                key = box.attr("name"),
                val = box.val();
            collection[key] = encodeURIComponent(val);
        });
        //2014-04-29 checkbox处理
        var cache = {};
        t.find(":input[name][type='checkbox']").each(function(){
            var box = $(this);
            var key = box.attr("name");
            if(box.attr('checked'))
            {
            	if(cache[key] != null && cache[key] != '')
                {
                	cache[key] += ',';
                }
                else
                {
                	cache[key] = '';
                }
            	cache[key] += box.val();
            }
            collection[key] = encodeURIComponent(cache[key]);
        });
        //alert(JSON.stringify(collection));
        return collection;
    }

    /**
     * 关闭窗口
     */
    function closeDialog(target, options) {
    	var id = window.location.pathname + window.location.search;
    	id = id.replace(new RegExp("[\/\?&=:,-\.]", "g"), "_");
    	target.$("#" + id).dialog("close");
    }

    /**
     * 打开窗口
     */
    function openDialog(target, options) {
        var opts = $.extend({}, $.fn.domain.defaults.openDialog, options);
        var did = opts.src.replace(new RegExp("[\/\?&=:,-\.]", "g"), "_");
        var dlg;
        if (opts.iframe){
            dlg = target.$("<div style='overflow:hidden'><iframe scrolling='no' frameborder='0' style='width:100%;height:100%;'></iframe></div>").appendTo(target.document.body);
        }else{
            dlg = target.$("<div id='abced' class='easyui-layout' data-options='fit:true'></div>").appendTo(target.document.body);
        }
        //width,height后加
        //var width = opts.baseWidth ? Math.round((opts.baseWindow ? $(window).width() : window.screen.width) * opts.width / opts.baseWidth)+1 : opts.width;
    	//var height = opts.baseHeight ? Math.round((opts.baseWindow ? $(window).height() : window.screen.height) * opts.height / opts.baseHeight)+1 : opts.height;
        dlg.dialog($.extend({}, opts, {
            id: did,
            //width: width,
        	//height: height,
            onOpen: function() {
                if(opts.iframe){
                    dlg.dialog("body").find("iframe").attr("src", opts.src);
                }else{
                    $.ajax({
                        async:false,
                        url : opts.src,
                        type : "get",
                        success:function(html){
                            $.parser.parse(dlg);
                            dlg.html(html);
                            if (opts.close){
                                dlg.find(opts.close).click(function(){
                                    dlg.dialog("close");
                                });
                            }
                        }
                    });
                }
                
                opts.onOpen.call(target);
            },
            onClose: function() {
                dlg.dialog("destroy");
                opts.onClose.call(target);
            }
        })).dialog("open");
        if (opts.maximize){
            dlg.dialog("maximize");
        }
    }
    /**
 * 装载
 */
    function load(target, options) {
        var state = $.data(target, "domain.load");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.load", {
                options: $.extend({}, $.fn.domain.defaults.load, {}, options)
            });
        }
        var opts = state.options;
        if (!opts.url) {
            return;
        }
        var t = $(target);
        t.before("<div class='panel-loading'>请稍后……</div>");
        $.ajax({
            async: true,
            cache: false,
            type: "POST",
            url: opts.url,
            data: opts.data,
            dataType: "json",
            beforeSend: function(XHR) {
                return opts.onBeforeLoad.call(target, XHR); 
            },
            success: function(data, status, XHR) {
                if(t.attr("autoTypeset") != "false") {
                    var cols = t.attr("cols") ? parseInt(t.attr("cols")) : 2;
                    var span = t.find("span.property:first");
                    var minu = span.outerWidth(true) - span.width();
                    var wdth = Math.floor((t.width() - 24) / cols) - minu;
                    t.find(":input[name]:visible, :input[numberboxname]:visible, :input[comboname]:hidden").each(function(ndx, ele) {
                        var box = $(this);
                        if (box.is(":checkbox") || box.is(":radio")) {
                            return true;
                        }
                        minu = 0;
                        if(box.attr("name")) {
                            if(box.is("input, textarea, select")) {
                                if(!$.browser.msie) {
                                    minu = box.outerWidth() - box.width();
                                }
                                else {
                                    box.height(box.height() + (box.outerHeight() - box.height()));
                                }
                        		
                            }
                            box.width(wdth - minu);
                        }
                        else {
                            if(box.attr("numberboxname")) {
                                box.css({
                                    "borderWidth": 1
                                });
                                //box.spinner("resize", wdth);
                            }
                            else if(box.attr("comboname")) {
                                if (box.hasClass("datebox-f") || box.hasClass("datetimebox-f")) {
                        			
                                }
                                box.combo("resize", wdth);
                            }
                        }
                    });
                }
                //
                t.prev().remove();
                t.css({
                    visibility: "visible"
                });
                if(data) {
                    for (var key in data) {
                        if (typeof(data[key]) != "string" && typeof(data[key]) != "number") {
                            continue;
                        }
                        var box = t.find(":input[name='" + key + "'], :input[numberboxname='" + key + "'], :input[comboname='" + key + "']");
                        var formatter = eval(box.attr("formatter"));
                        var precision = box.attr("precision");
                        if (formatter) {
                            data[key] = formatter(data[key], precision);
                        }
                    }
                    t.form("load", data);
                }
                //
                if(opts.names && opts.names.length > 0) {
                    for(var i = 0; i < opts.names.length; i++) {
                        var item = opts.names[i];
                        var fKeyField = item.fKeyField;
                        if(!fKeyField) {
                            continue;
                        }
                        var b = t.find(':input[comboname="' + fKeyField + '"]');
                        if(b.length == 0) {
                            continue;
                        }
                        b.domain('nameCombo', item);
                    }
                }
                //
                window.setTimeout(function() { 
                    t.find(":input[focused='true']:enabled:first").focus(); 
                    opts.onLoadSuccess.call(target, data, status, XHR);
                }, 0);
            },
            error: function(XHR, status, errorThrow) {
                t.prev().remove();
                t.css({
                    visibility: "visible"
                });
                $.messager.alert("信息", XHR.responseText, "500");
                opts.onLoadError.call(target, XHR, status, errorThrow);
            },
            complete: function(XHR, status) {
                opts.onLoadComplete.call(target);
            }
        });
    }
    /**
 * 判断记录是否存在
 */
    function exist(target, options) {
        var state = $.data(target, "domain.exist");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.exist", {
                options: $.extend({}, $.fn.domain.defaults.exist, {}, options)
            });
        }
        var opts = state.options;
        if (!opts.url) {
            return false;
        }
        var exist = false;
        var t = $(target);
        var boxes = t.find(":input[unique='true']");
        if (boxes.length == 0) {
            return false;
        }
        var queryParams = {};
        boxes.each(function(ndx, ele) {
            var box = $(this);
            var key = box.attr("comboname") || box.attr("numberboxname");
            if (key) {
                box = t.find(":input[name='" + key + "']");
            }
            queryParams[box.attr("name")] = encodeURIComponent(box.val());
        });
        exist = $.ajax({
            url : opts.url,
            dataType : opts.dataType,
            data : queryParams,
            async : opts.async,
            cache : opts.cache,
            type : opts.type,
            beforeSend: function(XHR) {
                return opts.onBeforeLoad.call(target, XHR);
            },
            success: function(data, status, XHR) {
                if(data > 0) {
                    var m = $.format("很抱歉，<i>{0}</i> {1} 已存在。", $.serialize(queryParams), opts.title);
                    $.messager.show({
                        title: "错误", 
                        msg: m, 
                        timeout: 4000, 
                        showType: "slide"
                    });
                    t.find(":input[unique='true']:first").focus();
                    t.find(":input[unique='true']:first").select();
                }
            }, 
            error: function(XHR, status, errorThrow) {
                $.messager.alert("信息", XHR.responseText, "500");
                opts.onLoadError.call(target, XHR, statusText, errorThrow);
            },
            complete: function(XHR, status) {
                opts.onLoadComplete.call(target);
            }
        }).responseText;
        
        return exist > 0;
    }
    /**
 * 创建
 */
    function create(target, options) {
        var state = $.data(target, "domain.create");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.create", {
                options: $.extend({}, $.fn.domain.defaults.create, {}, options)
            });
        }
        var opts = state.options;
        if (!opts.url) {
            return;
        }
        $.ajax({
            async: opts.async,
            cache: opts.cache,
            type: opts.type,
            url: opts.url,
            data: opts.data,
            dataType: opts.dataType,
            beforeSend: function(XHR) {
                return opts.onBeforeLoad.call(target, XHR);
            },
            success: function(data, statusText, XHR) {
            	var m = $.format("添加成功。");
            	if(!data)
            	{
            		m = $.format("添加失败。");
            		if(data.exception)
            		{
            			m += data.le.message;
            			$.messager.alert("失败", data.le.message, "error");
            		}
            		else
            		{
            			$.messager.alert("失败", m, "error");
            		}
            		$('#btnSave,#btnAppend,#btnClose').linkbutton('enable');
            		return;
            	}
            	else
            	{
                    $.messager.alert("提示", m, "ok",null,3000);
//            		$.messager.show({
//                        title: "信息",
//                        msg: m,
//                        timeout: 4000,
//                        showType: "slide"
//                    });
            	}
                if (window.parent != window.self) {
                    var win = window.parent;
                    if (win.$("#tabs").length == 1) {
                        win = win.$("#tabs").tabs("getSelected").panel("body").find("iframe")[0].contentWindow;
                    }
                    if (win) {
                        win.$.data(win.document.body, "domain.create.refresh", true);
                    }
                }
                //
                window.setTimeout(function() {
                    opts.onLoadSuccess.call(target, $.extend($.decodeURIComponent(opts.data), {
                        id: data
                    }), status, XHR);
                }, 800);
            },
            error: function(XHR, statusText, errorThrow) {
                $.messager.alert("信息", XHR.responseText, "500");
                opts.onLoadError.call(target, XHR, statusText, errorThrow);
            },
            complete: function(XHR, status) {
                opts.onLoadComplete.call(target);
            }
        });
        
    }
    /**
 * 编辑
 */
    function edit(target, options) {
        var state = $.data(target, "domain.create");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.create", {
                options: $.extend({}, $.fn.domain.defaults.create, {}, options)
            });
        }
        var opts = state.options;
        if (!opts.url) {
            return;
        }
        $.ajax({
            async: opts.async,
            cache: opts.cache,
            type: opts.type,
            url: opts.url,
            data: opts.data,
            dataType: opts.dataType,
            beforeSend: function(XHR) {
                return opts.onBeforeLoad.call(target, XHR);
            },
            success: function(data, statusText, XHR) {
                var m = $.format("编辑成功。");
                if(data!=1)
            	{
                	m = $.format("编辑失败。");
            		if(data.exception)
            		{
            			m += data.le.message;
            			$.messager.alert("失败", data.le.message, "error");
            		}
            		else
            		{
            			$.messager.alert("失败", m, "error");
            		}
            		$('#btnSave').linkbutton('enable');
            		return;
            	}
            	else
            	{
                    $.messager.alert("提示", m, "ok",null,3000);
//            		$.messager.show({
//                        title: "信息",
//                        msg: m,
//                        timeout: 4000,
//                        showType: "slide"
//                    });
            	}
                
                window.setTimeout(function() {
                    opts.onLoadSuccess.call(target, $.decodeURIComponent(opts.data), statusText, XHR);
                }, 800);
            },
            error: function(XHR, statusText, errorThrow) {
                $.messager.alert("信息", XHR.responseText, "500");
                opts.onLoadError.call(target, XHR, statusText, errorThrow);
            },
            complete: function(XHR, status) {
                opts.onLoadComplete.call(target);
            }
        });
    }
    /**
 * 删除一条，treegrid和tree使用
 */
    function remove(target, options) {
        var opts = $.extend({}, $.fn.domain.defaults.remove, {}, options);
        if(!opts.url) {
            return;
        }
        var t = $(target);
        var c = $.data(target, "tree") ? "tree" : ($.data(target, "treegrid") ? "treegrid" : undefined);
        if(!c) {
            return;
        }
        var title = opts.title;
        var node = t[c]("getSelected");
        if (!node) {
            $.messager.alert("信息", "很抱歉，尚未选择 " + title + " 。", "info", null, 2000);
            return;
        }
        var idField = "id", textField = "text";
        if(c == "treegrid") {
            idField = t.treegrid("options").idField;
            textField = t.treegrid("options").treeField;
        }
        var id = node[idField], text = node[textField];
        var m = $.format("即将删除 <i>{0}</i> {1}，且不能恢复，确定吗？", text, title);
        $.messager.confirm("确认", m, function(result) {
            if (result) {
                $.ajax({
                    async: opts.async,
                    cache: opts.cache,
                    type: opts.type,
                    url: opts.url + "/" + id,
                    data: {
                        id: id
                    },
                    dataType: opts.dataType,
                    beforeSend: function(XHR) {
                        return opts.onBeforeLoad.call(target, XHR);
                    },
                    success: function(data, status, XHR) {
                        m = $.format("删除 <i>{0}</i> {1}成功。", text, title);
                        if(data!=1)
                    	{
                        	m = $.format("删除失败。");
                    		if(data.exception)
                    		{
                    			m += data.le.message;
                    			$.messager.alert("失败", data.le.message, "error");
                    		}
                    		else
                    		{
                    			$.messager.alert("失败", m, "error");
                    		}
                    		return;
                    	}
                    	else
                    	{
                    		$.messager.show({
                                title: "信息", 
                                msg: m, 
                                timeout: 4000, 
                                showType: "slide"
                            });
                    	}
                        
                        
                        window.setTimeout(function() {
                            if(c == "tree") {
                                t.tree("remove", t.tree('find', id).target);
                            }
                            else if(c == "treegrid") {
                                t.treegrid("remove", id);
                            }
                            opts.onLoadSuccess.call(target, data, status, XHR); 
                        }, 800);
                    },
                    error: function(XHR, status, errorThrow) {
                        opts.onLoadError.call(target, XHR, status, errorThrow);
                        $.messager.alert("信息", XHR.responseText, "500");
                    }
                });
            }
        });
    }
    /**
 * 删除多条，datagrid使用
 */
    function deletes(target, options) {
        var opts = $.extend({}, $.fn.domain.defaults.deletes, {}, options);
        if(!opts.url) {
            return;
        }
        var t = $(target);
        var title = opts.title;
        var nodes = t.datagrid("getSelections");
        if (!nodes || nodes.length == 0) {
            $.messager.alert("信息", "很抱歉，尚未选择 " + title + " 。", "info", null, 2000);
            return;
        }
        var idFieldStr = t.datagrid("options").idField;
        var idFields = idFieldStr.split(',');
        var pkdata = {};
        for(var i = 0; i < idFields.length; i++)
        {
        	if(idFields[i]!=null&&idFields[i]!='')
        	{
            	pkdata[idFields[i]] = nodes[0][idFields[i]];
        	}
        }
        var m = $.format("即将删除选中的 <i>{0}</i> 条{1}，且不能恢复，确定吗？", 1, title);
        $.messager.confirm("确认", m, function(result) {
            if (result) {
                $.gzcard.ajax({
                    async: opts.async,
                    cache: opts.cache,
                    type: opts.type,
                    url: opts.url,
                    data: pkdata,
                    dataType: opts.dataType,
                    success: function(data, status, XHR) {
                        m = $.format("恭喜您，删除 <i>{0}</i> 条{1}成功。", 1, title);
                        $.messager.show({
                            title: "信息", 
                            msg: m, 
                            timeout: 4000, 
                            showType: "slide"
                        });
                        window.setTimeout(function() {
                            var queryParams = $.data(target, "domain.datagrid").options.queryParams || {};
                            queryParams.total = count(target);
                            datagrid(target, {
                                queryParams: queryParams
                            });
                            
                            opts.onLoadSuccess.call(target, data, status, XHR);
                        }, 800);
                    },
                    error: function(XHR, status, errorThrow) {
                        opts.onLoadError.call(target, XHR, status, errorThrow);
                        $.messager.alert("信息", XHR.responseText, "500");
                    }
                });
            }
        });
    }
    /**
 * 统计符合查询条件的记录总数
 */
    function count(target, options) {
        var state = $.data(target, "domain.count");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.count", {
                options: $.extend({}, $.fn.domain.defaults.count, {}, options)
            });
        }
        var opts = state.options;
        if (!opts.url) {
            return;
        }
        var total = $.ajax({
            url : opts.url,
            dataType : opts.dataType,
            data : opts.queryParams,
            async : opts.async,
            cache : opts.cache,
            type : opts.type,
            success: function(data, status, XHR) {
                window.setTimeout(function() {
                    opts.onLoadSuccess.call(target, data, status, XHR);
                }, 0);
            }, 
            error: function(XHR, status, errorThrow) {
                window.setTimeout(function() {
                    opts.onLoadError.call(target, XHR, status, errorThrow);
                }, 0);
                $.messager.alert("信息", XHR.responseText, "500");
            }
        }).responseText;
        return total;
    }
    /**
 * 列举符合查询条件的记录
 */
    function datagrid(target, options) {
        var state = $.data(target, "domain.datagrid");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.datagrid", {
                options: $.extend({}, $.fn.domain.defaults.datagrid, $.fn.domain.parseOptions.datagrid(target), options)
            });
        }
        var opts = state.options;
        if(!opts.url) {
            return;
        }
        $(target).datagrid($.extend({}, opts, {
            onBeforeLoad: function(XHR) {
                return opts.onBeforeLoad.call(target, XHR);
            },
            onLoadSuccess: function(data, status, XHR) {
                var t = $(target);
                if (data&&data.exCode) {
					$.messager.alert("提示", data.exMsg?data.exMsg:"加载数据失败", "warning", null);
					data.rows = {};
					data.rows.length=0;
					data.total = 0;
				}
                if (data && data.rows && data.rows.length > 0) {
                    t.datagrid("clearSelections");
                    if(opts.names && opts.names.length > 0) {
                        for(var i = 0; i < opts.names.length; i++) {
                            t.domain('nameGrid', $.extend({}, opts.names[i], {
                                rows: data.rows
                            }));
                        }
                    }
                }
                else {
                //                    $.messager.show({ title: "信息", msg: "很抱歉，没有 " + (opts.title || "") + " 记录。", timeout: 4000, showType: "slide" });
                }
                var panel = t.datagrid("getPanel");
                panel.find(">div.datagrid-view").unbind("click").bind("click", function(e) {
                    t.datagrid("clearSelections");
                });
                //移除顶端遮罩
                try{if (top.hideMask) top.hideMask();}catch(e){}
                t.datagrid("options").loadMsg = "正在处理，请稍候。。。";
                opts.onLoadSuccess.call(target, data, status, XHR);
            },
            onLoadError: function(XHR, status, errorThrow) {
                $.messager.alert("信息", XHR.responseText, "500");
                opts.onLoadError.call(target, XHR, status, errorThrow);
            },
            onSortColumn: function(sort, order) {
                //                $(this).datagrid("options").sortName = sort.replace(new RegExp("[A-Z]", "g"), function($1, i) { return (i == 0 ? $1 : "_" + $1); });
                opts.onSortColumn.call(target, sort, order);
            },
            onSelect: function(rowIndex, rowData, event) {
                changeButtonState(target);
                opts.onSelect.call(target, rowIndex, rowData, event);
                var actionDiv = $(this).parents(".datagrid").next(".actionDiv");
                //for compatibility
                if (actionDiv.length == 0){
                    actionDiv = $("#actionDiv");
                }
                if (opts.action == true && actionDiv.length > 0){
                    if (window.showTips){
                        var show = showTips(rowData, $(target));
                        if (!show){
                            return;
                        }
                    } else if (window.changeButtonsStatus){
                        //for compatibility
                        var show = changeButtonsStatus();
                        if (!show){
                            return;
                        }
                    }
                    $(this).parents(".datagrid").find(".datagrid-view2 .datagrid-row-selected").qtip({
                        content : {
                            text : actionDiv.clone()
                        },
                        position : {
                            my : "top center", 
                            at : "bottom center"
                        },
                        style : {
                        },
                        events : {
                            show : function(e, api){
                                $(".qtip-tip").remove();
                                $(".qtip").css("visibility", "hidden");
                                $(".qtip").css("margin-top", "-8px");
                                var maxWidth = $("body").width() - 20; //Body width - Scrollbar width
                                setTimeout(function(){
                                    var target = $(".qtip[aria-hidden='false']");
                                    var width = target.width();
                                    target.css("left", 0);
                                    target.css("margin-left", mouseX + width < maxWidth ? mouseX : maxWidth - width);
                                    target.css("visibility", "visible");
                                    if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/7./i)=="7.")
                                    {
                                        $("body").height($("body").height()).width($("body").width());
                                    }
                                }, 0);
                                $(".qtip").corner("bevel bottom");
                            }
                        },
                        show : {
                            event : false,
                            effect : function (offset){
                                $(this).slideDown(200);
                            }
                        },
                        hide : {
                            event : false
                        }
                    }).qtip("show");
                }
            },
            onUnselect: function(rowIndex, rowData) {
                changeButtonState(target);
                opts.onUnselect.call(target, rowIndex, rowData);
                $(".qtip").remove();
            },
            onSelectAll: function(rows) {
                changeButtonState(target);
                opts.onSelectAll.call(target, rows);
            },
            onUnselectAll: function(rows) {
                changeButtonState(target);
                opts.onUnselectAll.call(target, rows);
                $(".qtip").remove();
            }
        }));
    }
    /**
 * 
 */
    function changeButtonState(target) {
        var t = $(target);
        var panel = t.datagrid("getPanel");
        var selections = t.datagrid("getSelections").length;
        panel.find(">div.datagrid-toolbar>a").each(function() {
            var btn = $(this);
            var bid = btn.attr("id");
            if (bid != "btnCreate" && bid != "btnDelete") {
                btn.linkbutton(selections == 0 || selections > 1 ? "enable" : "enable");
            }
            else if (bid == "btnDelete") {
                btn.linkbutton(selections == 0 ? "enable" : "enable");
            }
        });
    }
    /**
 * 
 */
    function treegrid(target, options) {
        var state = $.data(target, "domain.treegrid");
        if (state) {
            $.extend(state.options, options);
        }
        else {
            state = $.data(target, "domain.treegrid", {
                options: $.extend({}, $.fn.domain.defaults.treegrid, $.fn.domain.parseOptions.treegrid(target), options)
            });
        }
        var opts = state.options;
        if(!opts.url) {
            return;
        }
        $(target).treegrid($.extend({}, opts, {
            onBeforeLoad: function(XHR) {
                return opts.onBeforeLoad.call(target, XHR);
            },
            onLoadSuccess: function(node, data, status, XHR) {
                var t = $(target);
                if(data && data.length > 0) {
                    if(opts.names && opts.names.length > 0) {
                        for(var i = 0; i < opts.names.length; i++) {
                            t.domain('nameGrid', $.extend({}, opts.names[i], {
                                rows: data
                            }));
                        }
                    }
                }
                else {
                    $.messager.show({
                        title: "信息", 
                        msg: "很抱歉，没有 " + (opts.title || "") + " 记录。", 
                        timeout: 4000, 
                        showType: "slide"
                    });
                }
                var panel = t.datagrid("getPanel");
                panel.find(">div.datagrid-view").unbind("click").bind("click", function(e) {
                    t.datagrid("clearSelections");
                });
                opts.onLoadSuccess.call(target, data, status, XHR);
            },
            onLoadError: function(XHR, status, errorThrow) {
                $.messager.alert("信息", XHR.responseText, "500");
                opts.onLoadError.call(target, XHR, status, errorThrow);
            },
            onSelect: function(rowIndex, rowData) {
                changeButtonState(target);
                opts.onSelect.call(target, rowIndex, rowData);
            },
            onUnselect: function(rowIndex, rowData) {
                changeButtonState(target);
                opts.onUnselect.call(target, rowIndex, rowData);
            },
            onSelectAll: function(rows) {
                changeButtonState(target);
                opts.onSelectAll.call(target, rows);
            },
            onUnselectAll: function(rows) {
                changeButtonState(target);
                opts.onUnselectAll.call(target, rows);
            }
        }));
    }
    /**
 * combobox,combotree使用
 */
    function nameCombo(target, options) {
        var opts = $.extend({}, $.fn.domain.defaults.nameCombo, {}, options);
        if(!opts.url || !opts.idField || !opts.nameField) {
            return;
        }
        var t = $(target);
        var values = t.combo("getValues");
        if(!values || values.length == 0) {
            return;
        }
        var queryParams = $.extend({}, opts.queryParams, {
            idField: opts.idField, 
            nameField: opts.nameField
        });
        queryParams[opts.idField] = values.join(",");
        $.ajax({
            async: opts.async,
            cache: opts.cache,
            type: opts.type,
            url: opts.url,
            data: queryParams,
            dataType: opts.dataType,
            success: function(data, status, XHR) {
                if(data && data.length > 0) {
                    var texts = [];
                    var separator = t.combo("options").separator;
                    for(var i = 0; i < data.length; i++) {
                        texts.push(data[i][opts.nameField]);
                    }
                    t.combo("setText", texts.join(separator));
                }
                window.setTimeout(function() {
                    opts.onLoadSuccess.call(target, data, status, XHR);
                }, 800);
            },
            error: function(XHR, status, errorThrow) {
                opts.onLoadError.call(target, XHR, status, errorThrow);
                $.messager.alert("信息", XHR.responseText, "500");
            }
        });
    }
    /**
 * datagrid, treegrid使用。
 */
    function nameGrid(target, options) {
        var opts = $.extend({}, $.fn.domain.defaults.nameGrid, {}, options);
        if(!opts.url || !opts.fKeyField || !opts.idField || !opts.nameField || !opts.rows) {
            return;
        }
        var t = $(target);
        var rows = opts.rows;
        var values = [];
        for (var i = 0; i < rows.length; i++) {
            var fKeyValue = rows[i][opts.fKeyField];
            if ($.inArray(fKeyValue, values) == -1) {
                values.push(fKeyValue);
            }
        }
        if(values.length == 0) {
            return;
        }
        var queryParams = $.extend({}, opts.queryParams, {
            idField: opts.idField, 
            nameField: opts.nameField
        });
        queryParams[opts.idField] = values.join(',');
        $.ajax({
            async: opts.async,
            cache: opts.cache,
            type: opts.type,
            url: opts.url,
            data: queryParams,
            dataType: opts.dataType,
            success: function(data, status, XHR) {
                if (data && data.length > 0) {
                    var divs = t.datagrid("getPanel").find("div.datagrid-body").find("td[field='" + opts.fKeyField + "']>div");
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        for(var j = 0; j < divs.length; j++) {
                            var div = $(divs[j]);
                            if (div.text() == item[opts.idField]) {
                                div.text(item[opts.nameField]);
                            }
                        }
                        for(var j = 0; j < rows.length; j++) {
                            if (rows[j][opts.fKeyField] == item[opts.idField]) {
                                rows[j][opts.fKeyField] = item[opts.nameField];
                            }
                        }
                    }
                }
                window.setTimeout(function() {
                    opts.onLoadSuccess.call(target, data, status, XHR);
                }, 800);
            },
            error: function(XHR, status, errorThrow) {
                opts.onLoadError.call(target, XHR, status, errorThrow);
                $.messager.alert("信息", XHR.responseText, "500");
            }
        });
    }
    //
    $.fn.domain = function(options, param) {
        if (typeof options == "string") {
            var fn = $.fn.domain.methods[options];
            if (fn) {
                return fn(this, param);
            }
        }
    };
    //
    $.fn.domain.methods = {
        initForm: function(jq, fn) {
            return jq.each(function() {
                initForm(this, fn);
            });
        },
        collect: function(jq) {
            return collect(jq[0]);
        },
        openCreateDialog: function(jq,fn) {
            return jq.each(function() {
                openCreateDialog(this,fn);
            });
        },
        openEditDialog: function(jq,fn) {
            return jq.each(function() {
                openEditDialog(this,fn);
            });
        },
        openRemoveDialog: function(jq) {
            return jq.each(function() {
                openRemoveDialog(this);
            });
        },
        openDialog: function(jq, param) {
            return jq.each(function() {
                openDialog(this, param);
            });
        },
        closeDialog: function(jq, param) {
            return jq.each(function() {
                closeDialog(this, param);
            });
        },
        load: function(jq, param) {
            return jq.each(function() {
                load(this, param);
            });
        },
        exist: function(jq, param) {
            return exist(jq[0], param);
        },
        create: function(jq, param) {
            return jq.each(function() {
                create(this, param);
            });
        },
        edit: function(jq, param) {
            return jq.each(function() {
                edit(this, param);
            });
        },
        remove: function(jq, param) {
            return jq.each(function() {
                remove(this, param);
            });
        },
        deletes: function(jq, param) {
            return jq.each(function() {
                deletes(this, param);
            });
        },
        count: function(jq, param) {
            return count(jq[0], param);
        },
        datagrid: function(jq, param) {
            return jq.each(function() {
                datagrid(this, param);
            });
        },
        treegrid: function(jq, param) {
            return jq.each(function() {
                treegrid(this, param);
            });
        },
        nameCombo: function(jq, param) {
            return jq.each(function() {
                nameCombo(this, param);
            });
        },
        nameGrid: function(jq, param) {
            return jq.each(function() {
                nameGrid(this, param);
            });
        }
    };
    $.fn.domain.parseOptions = {
        datagrid: function(target) {
            return $.extend({}, 
                $.fn.datagrid.parseOptions(target), 
                $.parser.parseOptions(target, ["urlCreate", "urlEdit", "urlDelete", "urlAttatch", {
                    openWidth: "number", 
                    openHeight: "number"
                }])
                );
        },
        treegrid: function(target) {
            return $.extend({}, 
                $.fn.treegrid.parseOptions(target), 
                $.parser.parseOptions(target, ["urlCreate", "urlEdit", "urlDelete", "urlAttatch", {
                    openWidth: "number", 
                    openHeight: "number"
                }])
                );
        }
    };
    //
    $.fn.domain.defaultsOfCommon = {
        async: true,
        cache: false,
        type: "GET",
        url: null,
        data: null,
        dataType: "json",
        onBeforeLoad: function(XHR) {
            return true;
        },
        onLoadSuccess: function(data, status, XHR) {},
        onLoadError: function(XHR, status, errorThrow) {},
        onLoadComplete: function(XHR, status) {}	
    };
    //
    $.fn.domain.defaults = {
        openDialog: $.extend({}, $.fn.dialog.defaults, {
            modal: true,
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closed: true,
            src: null,
            iframe : true/*start added by杨土华*/,
            baseWidth: 1024,//基准宽度,px
            baseHeight: 768,//基准高度,px
            baseWindow: false//基于window(浏览器)?默认基于screen(屏幕)
            /*end*/
        }),
        load: $.extend({}, $.fn.domain.defaultsOfCommon, {
            names: null
        }),
        exist: $.extend({}, $.fn.domain.defaultsOfCommon, {
            async: false,
            title: "记录"
        }),
        create: $.extend({}, $.fn.domain.defaultsOfCommon, {
            type: "POST",
            title: "记录"
        }),
        edit: $.extend({}, $.fn.domain.defaultsOfCommon, {
            type: "POST",
            title: "记录"
        }),
        remove: $.extend({}, $.fn.domain.defaultsOfCommon, {
            type: "POST",
            title: "记录"
        }),
        deletes: $.extend({}, $.fn.domain.defaultsOfCommon, {
            type: "POST",
            title: "记录"
        }),
        count: $.extend({}, $.fn.domain.defaultsOfCommon, {
            async: false,
            queryParams: null
        }),
        datagrid: $.extend({}, $.fn.datagrid.defaults, {
            action : true,
            //iconCls: "icon-grid",
            //2013-11-02 by zms
            noheader:true,
            nowrap: true,
            striped: true,
            fit: true,
            border: false,
            pagination: true,
            rownumbers: true,
            autoRowHeight: false,
            collapsible: false,
            remoteSort: true,
            singleSelect: false,
            cache:false,
            method: "get",
            sortName: "id",
            sortOrder: "asc",
            pageNumber: 1,
            pageSize: 10,
            loadMsg : null,
            idField: "id",
            frozenColumns: [[{
                field: "ck", 
                checkbox: true 
            }]],
            toolbar: [{
                id: "btnCreate",
                text: "新建",
                iconCls: "icon-add",
                handler: function() {
                    var t = $(this).parent().next().find(">table:hidden");
                    var opts = t.datagrid("options");
                    var url = opts.urlCreate || (opts.url.match(new RegExp("page", "i")) ? opts.url.replace(new RegExp("page", "i"), "create") : undefined);
                    if (!url) {
                        return;
                    }
                    $(parent).domain("openDialog", { 
                        iconCls: "icon-add", 
                        title: "新建 " + opts.title, 
                        src: url, 
                        width: opts.openWidth, 
                        height: opts.openHeight, 
                        onClose: function() {
                            if ($.data(document.body, "domain.create.refresh")) {
                                $.removeData(document.body, "domain.create.refresh");
                                var queryParams = $.data(t[0], "domain.datagrid").options.queryParams || {};
                                queryParams.total = count(t[0]);
                                datagrid(t[0], {
                                    queryParams: queryParams
                                });
                            //t.datagrid("reload", queryParams);
                            }
                        }
                    });
                }
            },{
                id: "btnEdit",
                text: "编辑",
                iconCls: "icon-edit",
                disabled: true,
                handler: function() {
                    var t = $(this).parent().next().find(">table:hidden");
                    var opts = t.datagrid("options");
                    var node = t.datagrid("getSelected");
                    if (!node) {
                        $.messager.alert("信息", "很抱歉，尚未选择 " + opts.title + " 。", "info", null, 2000);
                        return;
                    }
                    var id = node[opts.idField];
                    var url = (opts.urlEdit ? $.format(opts.urlEdit, id) : undefined) || (opts.url.match(new RegExp("page", "i")) ? opts.url.replace(new RegExp("page", "i"), "edit") + "/" + id : undefined);
                    if (!url) {
                        return;
                    }
                    $(parent).domain("openDialog", { 
                        iconCls: "icon-edit", 
                        title: "编辑" + opts.title, 
                        src: url, 
                        width: opts.openWidth, 
                        height: opts.openHeight, 
                        onClose: function() {}
                    });
                }
            },
            "-",
            {
                id: "btnDelete",
                text: "删除",
                iconCls: "icon-remove",
                disabled: true,
                handler: function() {
                    var t = $(this).parent().next().find(">table:hidden");
                    var opts = t.datagrid("options");
                    var url = opts.urlDelete || (opts.url.match(new RegExp("page", "i")) ? opts.url.replace(new RegExp("page", "i"), "deletes") : undefined);
                    t.domain("deletes", { 
                        url: url,
                        title: opts.title
                    });
                }
            }],
            names: null,
            urlCreate: null,
            urlEdit: null,
            urlDelete: null,
            urlAttatch: null,
            openWidth: 600,
            openHeight: 360,
            auto: true
        }),
        treegrid: $.extend({}, $.fn.treegrid.defaults, {
            iconCls: "icon-grid",
            nowrap: true,
            striped: true,
            fit: true,
            border: false,
            rownumbers: true,
            autoRowHeight: false,
            collapsible:false,
            singleSelect: true,
            animate: true,
            cache:false,
            method: "get",
            sortName: "id",
            sortOrder: "asc",
            idField: "id",
            treeField: "name",
            frozenColumns: [[{
                field: "name", 
                title: "名称", 
                width: 150
            }]],
            toolbar: [{
                id: "btnCreate",
                text: "新建",
                iconCls: "icon-add",
                handler: function() {
                    var t = $(this).parent().next().find(">table:hidden");
                    var opts = t.treegrid("options");
                    var url = opts.urlCreate || (opts.url.match(new RegExp("treegrid", "i")) ? opts.url.replace(new RegExp("treegrid", "i"), "create") : undefined);
                    if (!url) {
                        return;
                    }
                    url += (url.indexOf("?") == -1 ? "?" : "") + "parent={0}&ancestor={1}&depth={2}";
                    var node = t.treegrid('getSelected');
                    url = $.format(url, (node ? node[opts.idField] : 0), (node ? (node.ancestor ? node.ancestor + "," : "") + "_" + node[opts.idField] + "_" : ""), (node ? parseInt(node.depth, 10) + 1 : 1));
                    $(parent).domain("openDialog", { 
                        iconCls: "icon-add", 
                        title: "新建 " + opts.title, 
                        src: url, 
                        width: opts.openWidth, 
                        height: opts.openHeight, 
                        onClose: function() {
                    		
                        }
                    });
                }
            },"-",{
                id: "btnEdit",
                text: "编辑",
                iconCls: "icon-edit",
                disabled: true,
                handler: function() {
                    var t = $(this).parent().next().find(">table:hidden");
                    var opts = t.treegrid("options");
                    var node = t.treegrid("getSelected");
                    if (!node) {
                        $.messager.alert("信息", "很抱歉，尚未选择 " + opts.title + " 。", "info", null, 2000);
                        return;
                    }
                    var id = node[opts.idField];
                    var url = (opts.urlEdit ? $.format(opts.urlEdit, id) : undefined) || (opts.url.match(new RegExp("treegrid", "i")) ? opts.url.replace(new RegExp("treegrid", "i"), "edit") + "/" + id : undefined);
                    if (!url) {
                        return;
                    }
                    $(parent).domain("openDialog", { 
                        iconCls: "icon-edit", 
                        title: "编辑" + opts.title, 
                        src: url, 
                        width: opts.openWidth, 
                        height: opts.openHeight, 
                        onClose: function() {
                    		
                        }
                    });
                }
            },
            "-",
            {
                id: "btnDelete",
                text: "删除",
                iconCls: "icon-remove",
                disabled: true,
                handler: function() {
                    var t = $(this).parent().next().find(">table:hidden");
                    var opts = t.treegrid("options");
                    var url = opts.urlDelete || (opts.url.match(new RegExp("treegrid", "i")) ? opts.url.replace(new RegExp("treegrid", "i"), "delete") : undefined);
                    t.domain("remove", { 
                        url: url,
                        title: opts.title
                    });
                }
            }],
            names: null,
            urlCreate: null,
            urlEdit: null,
            urlDelete: null,
            urlAttatch: null,
            openWidth: 600,
            openHeight: 360,
            auto: true
        }),
        nameCombo: $.extend({}, $.fn.domain.defaultsOfCommon, {
            queryParams: null,
            fKeyField: null,
            idField: "id",
            nameField: 'name'
        }),
        nameGrid: $.extend({}, $.fn.domain.defaultsOfCommon, {
            queryParams: null,
            fKeyField: null,
            idField: "id",
            nameField: "name"
        })
    };
})(jQuery);

$(document).keydown(function(e ) {
    	if(e.keyCode == 8 && e.target.type == 'text' && !e.target.readOnly){
     
        } else if( e.keyCode == 8 && e .target.type =='textarea' && !e.target.readOnly){  
         
        } else if( e.keyCode == 8 && e .target.type =='password' && !e.target.readOnly){  
         
        } 
        else if( e.keyCode == 8){
            e.preventDefault();
        }
})
