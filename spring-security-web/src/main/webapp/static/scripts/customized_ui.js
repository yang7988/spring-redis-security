function customizedPanel() {
    var panels = $.data($("body")[0], 'layout').panels;
    var westContainer = panels.west;
    var orgLeft = westContainer.panel('options').left;;
	var expandWest = $('<div></div>').insertAfter(westContainer.parent()).panel({
		cls: 'layout-expand',
		title: '&nbsp;',
		closed: true,
		doSize: false,
		tools: [{
			iconCls: 'layout-button-right',
			handler:function(){
				expandWest.panel('close');
				westContainer.panel('open').panel('resize', {left: -westContainer.panel('options').width});
				westContainer.panel('panel').animate({
					left: orgLeft
				}, function(){
				});
				
				var cWidth = panels.center.panel('options').width;
				var wWidth = westContainer.panel('options').width;
				
				panels.center.panel('panel').animate({left: wWidth + orgLeft +8}, function() {
					panels.center.panel('resize', {
						width: cWidth - wWidth +20
					});
				});
			}
		}]
	});
	expandWest.panel('panel').hover(
			function(){$(this).addClass('layout-expand-over');},
			function(){$(this).removeClass('layout-expand-over');}
		);
	
    var btnLeft = $.data(panels.west[0], 'layout').panels.center.panel("header").find(".panel-tool").append('<a href="javascript:void(0)" class="layout-button-left"></a>').children();

    btnLeft.click(function(e) {
		
		westContainer.panel('panel').animate({left:-westContainer.panel('options').width}, function(){
			westContainer.panel('close');
			expandWest.panel('open').panel('resize', {
				top: westContainer.panel('options').top,
				left: 0,
				width: 28,
				height: westContainer.panel('options').height
			});
		});
		
		var cWidth = panels.center.panel('options').width;
		var wWidth = westContainer.panel('options').width;
		panels.center.panel('panel').animate({left: 35});
		panels.center.panel('resize', {
			width: cWidth + wWidth - 20
		});
    });
}

function buildSearchArea() {
	var DEFAULT_VALUE = "用拼音首字母搜索菜单";
	var DEFAULT_COLOR = "#CDCDCD";
	
	$(".search_area > input").val(DEFAULT_VALUE);
	
	$(".search_area > input").focus(function() {
		if($(this).val() == DEFAULT_VALUE) {
			$(this).val("");
			$(this).css("color", "black");
		}
	});
	
	$(".search_area > input").blur(function() {
		if($(this).val() == null || $(this).val().trim() == "") {
			$(".search_area > input").val(DEFAULT_VALUE);
			$(this).css("color", DEFAULT_COLOR);
		}
	});
	
	var searchBtn = $(".search_area > div");
	searchBtn.click(function() {
    	  top.$.messager.alert("warn", "Implement it later");
	});
}
