/*
 * tiles 0.0.1 plugin
 * jQuery Tiles control Plugin
 * by 郑铭生
 */

(function ($) {
	/**
	 * 设置地砖
	 */
	function initTable(target){
		var options = $.data(target, 'table').options;
		var t = $(target);
		t.hide();
		initTileGrid(target);
		t.show();
		
		var params = {};
		params.page = options.page;
		_loadData(target,params);
	}
	
	function initTileGrid(target){
		var options = $.data(target, 'table').options;
		var t = $(target);
		
		//处理t的css
		t.addClass("tiletable");
		
		for(var r=0;r<options.tileRows;r++)
		{
			var tr = $("<tr></tr>").appendTo(t);
			for(var c=0;c<options.tileCols;c++)
			{
				var tdId = "tile"+r+""+c;
				var td = $("<td></td>").attr("id",tdId).appendTo(tr);
				td.addClass("tileNormal");
				td.css("width",options.tileWidth);
				td.css("height",options.tileHeight);
				td.bind("click",function(event){
					var srcEle = event.srcElement ? event.srcElement : event.target;
					var id = srcEle.attributes.id.value;
					var rIdx = id.substring(id.length-2,id.length-1);
					var cIdx = id.substring(id.length-1,id.length);
					var index = rIdx*options.tileCols+cIdx*1;
					var record = null;
					if(options.cache||options.cache[index])
					{
						record = options.cache[index];
					}
					if(options.selectedId)
					{
						//干掉原来的css
						$('#'+options.selectedId).removeClass('tileSelected');
						$('#'+options.selectedId).addClass('tileNormal');
					}
					options.selectedId = "tile"+rIdx+""+cIdx;
					$('#'+options.selectedId).addClass('tileSelected');
					options.onClickTile.call(this,record);
				});
			}
		}
		
		initPager(target);
	}
	
	function initPager(target)
	{
		var options = $.data(target, 'table').options;
		var t = $(target);
		//初始化分页栏
		var pageTr = $("<tr></tr>").css("height","25px").appendTo(t);
		var pageTd = $("<td></td>").attr("colspan",options.tileCols).appendTo(pageTr);
		//
		var pageDiv = $("<div></div>").attr("id","tilesPager").appendTo(pageTd);
		pageDiv.addClass("datagrid-pager pagination");
		$('#tilesPager').pagination({  
		    total:0,  
		    pageSize:0,
		    pageList: [options.tileRows*options.tileCols],
			showPageList:false,
			onSelectPage:options.onSelectPage
		});
	}
	
	function _loadData(target,params)
	{
		var options = $.data(target, 'table').options;
		var t = $(target);
		
		params.rows = options.tileCols*options.tileRows;
		
		for(var r=0;r<options.tileRows;r++)
		{
			for(var c=0;c<options.tileCols;c++)
			{
				var selectStr = $.format("tr:eq({0}) td:eq({1})", r, c);
				var tdEle = t.find(selectStr);
				tdEle.text('');
			}
		}
		
		$('#tilesPager').pagination('loading');
		
		
		$.gzcard.ajax({
			url : options.url,
			data : params,
			success : function(data, status, XHR) {
				var total = 0;
				var pageNumber = 1;
				var pageRecordSize = options.tileRows*options.tileCols;
				//
				if(data)
				{
					total = data.total;
					if(data.rows&&data.rows.length>0)
					{
						//缓存数据
						options.cache = data.rows;
						for(var i=0;i<data.rows.length;i++)
						{
							var trIndex = Math.floor(i/options.tileCols);
							var tdIndex = i%options.tileCols;
							
							var selectStr = $.format("tr:eq({0}) td:eq({1})", trIndex, tdIndex);
							var tdEle = t.find(selectStr);
							
							//内容
							var spanId = 'tileSpan'+trIndex+''+tdIndex;
							var spanText = $("<span></span>").attr("id",spanId);
							spanText.text(data.rows[i][options.showField]);
							spanText.css("cursor","hand");
							spanText.css("cursor","pointer");
							spanText.css("width",options.tileWidth+"px");
							spanText.css("height",options.tileHeight+"px");
							spanText.appendTo(tdEle);
						}
						pageNumber = params.page;
					}
				}
				else
				{
					options.cache = null;
				}
			
				$('#tilesPager').pagination('refresh',{	// change options and refresh pager bar information
					total: total,
					pageNumber: pageNumber,
					pageSize: pageRecordSize
				});
				$('#tilesPager').pagination('loaded');
			}
		});
	}
	
    $.fn.tiles = function (options,params) {
    	if (typeof options == "string") {
            return $.fn.tiles.methods[options](this,params);
        }
    	var opts = $.extend({}, $.fn.tiles.defaults, options);
    	return this.each(function () {
    		if (!$.data(this, 'table')){
				$.data(this, 'table', {
					options: $.extend({}, $.fn.tiles.defaults, options)
				});
			}
    		initTable(this);
        });
    };
    function _loading(_elem){
    	$('#tilesPager').pagination("loading");
    };
    function _loaded(_elem) {
    	$('#tilesPager').pagination("loaded");
    };
    // 方法注册
    $.fn.tiles.methods = {
    		loading: function (jq) {
    			return jq.each(function () {
    				_loading(this);
                });
            },
            loaded: function (jq) {
                return jq.each(function () {
                	_loaded(this);
                });
            },
            loadData: function (jq, params) {
                return jq.each(function () {
                	_loadData(this,params);
                });
            },
    };
    // 默认参数
    $.fn.tiles.defaults = {
    	cache:null,
        url:'',
        params:{},
        tileCols: 10,
        tileRows: 8,
        tileWidth: 16,
        tileHeight: 16,
        page:1,
        showField:'',
        onSelectPage: null,
        onClickTile:null
    };

})
(jQuery);
