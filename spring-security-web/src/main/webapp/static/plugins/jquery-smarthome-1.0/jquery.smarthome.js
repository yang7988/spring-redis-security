/**
 * author: liyue
 * Date: 13-8-22
 * Time: 下午2:58
 */
(function ($) {

    function _randomColor() {
        var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        for (; rand.length < 6;) {
            rand = '0' + rand;
        }
        return '#' + rand;
    }

    /**
     * 初始化框架
     * @param _elem
     * @param opts
     * @returns {{menusBody: (*|HTMLElement), panelsContainer: *, paginationContainer: (*|undefined)}}
     * @private
     */
    function _init(_elem, _opts) {
        var _menusHeader = $("<div class='menu-header'></div>").html("——" + _opts.systemName + "——");//.wrapInner("<header></header>")
        var _menusBody = $("<div class='menus-body'><div class='leepanels-wrapper'><div class='leepanels-body leepanels content'></div></div></div>");

        if (_opts.logoCls) {
            _menusHeader.wrapInner("<p></p>");
            _menusHeader.addClass(_opts.logoCls).css("text-intend", "20em");
        }
        _menusHeader.insertBefore($(_elem));
        _menusBody.insertBefore($(_elem));
        $(_elem).hide();

        var _pagination;
        //处理分页
        if (_opts.pagination) {
            _pagination = $("<div class=\"leepanels-pager\"></div>");
            if (_opts.pagePosition == "bottom") {
                _pagination.appendTo(_menusBody);
            } else {
                if (_opts.pagePosition == "top") {
                    _pagination.addClass("leepanels-pager-top").prependTo(_menusBody);
                } else {
                    var ptop = $("<div class=\"leepanels-pager leepanels-pager-top\"></div>").prependTo(_menusBody);
                    _pagination.appendTo(_menusBody);
                    _pagination = _pagination.add(ptop);
                }
            }
            _pagination.pagination({
                total: 0,
                pageNumber: _opts.pageNumber,
                pageSize: _opts.pageSize,
                pageList: _opts.pageList,
                onSelectPage: function (_pageNumber, _pageSize) {
                    _opts.pageNumber = _pageNumber;
                    _opts.pageSize = _pageSize;
                    _pagination.pagination("refresh", {
                        pageNumber: _pageNumber,
                        pageSize: _pageSize
                    });
                    _loadPageData(_elem);
                }
            });
            _opts.pageSize = _pagination.pagination("options").pageSize;
        }
        if (_opts.footer) {
            $(_opts.footer).footer({
                footerButtons: _opts.footerButtons,
                footerToDoList: _opts.footerToDoList,
                systemName: _opts.systemName
            });
        }
        var _panelsContainer = _menusBody.children("div.leepanels-wrapper").children("div.leepanels-body");
        return {
            leftRegion: $(".left-region"),
            rightRegion: $(".right-region"),
            pageWrapper: $(".page-wrapper"),
            menusHeader: _menusHeader,
            menusBody: _menusBody,
            panelsContainer: _panelsContainer,
            paginationContainer: _pagination || undefined,
            footerContainer: $(_opts.footer)
        };
    };
    /**
     * 渲染首页
     * @param _elem
     * @param data
     * @private
     */
    function _renderHome(_elem, data) {
        var _cachedData = $.data(_elem, "smarthome");
        var opts = _cachedData.options;

        if (opts.home.onBeforeRender) {
            opts.home.onBeforeRender.call(opts.home, _elem, data);
        }

        opts.home.render.call(opts.home, _elem, data);

        if (opts.home.onAfterRender) {
            opts.home.onAfterRender.call(opts.home, _elem);
        }

        opts.onLoadSuccess.call(_elem, data);
    };
    /**
     * 点击翻页时加载分页数据
     * @param _elem
     * @private
     */
    function _loadPageData(_elem, _queryParams) {
        var opts = $.data(_elem, "smarthome").options;
        if (_queryParams) {
            opts.queryParams = _queryParams;
        }
        var _extendQueryParams = $.extend({}, opts.queryParams);
        if (opts.pagination) {
            $.extend(_extendQueryParams, {
                page: opts.pageNumber,
                leepanels: opts.pageSize
            });
        }
        if (opts.sortName) {
            $.extend(_extendQueryParams, {
                sort: opts.sortName,
                order: opts.sortOrder
            });
        }
        if (opts.onBeforeLoad.call(_elem, _extendQueryParams) == false) {
            return;
        }
        $(_elem).smarthome("loading");
        setTimeout(function () {
            _callLoader();
        }, 0);
        function _callLoader() {
            var _loadSuccess = opts.loader.call(_elem, _extendQueryParams, function (data) {
                setTimeout(function () {
                    $(_elem).smarthome("loaded");
                }, 0);
                _renderHome(_elem, data);
                setTimeout(function () {
                    _saveOriginalRows(_elem);
                }, 0);
            }, function () {
                setTimeout(function () {
                    $(_elem).smarthome("loaded");
                }, 0);
                opts.onLoadError.apply(_elem, arguments);
            });
            if (_loadSuccess == false) {
                $(_elem).smarthome("loaded");
            }
        };
    };
    /**
     * 保存原始数据
     * @param _elem
     * @private
     */
    function _saveOriginalRows(_elem) {
        var data = $.data(_elem, "smarthome").data;
        var leepanels = data.leepanels;
        var _originalRows = [];
        for (var i = 0; i < leepanels.length; i++) {
            _originalRows.push($.extend({}, leepanels[i]));
        }
        $.data(_elem, "smarthome").originalRows = _originalRows;
        $.data(_elem, "smarthome").updatedRows = [];
        $.data(_elem, "smarthome").insertedRows = [];
        $.data(_elem, "smarthome").deletedRows = [];
    }

    /**
     * 准备数据
     * @param data
     * @returns {*}
     * @private
     */
    function _preparePanels(data) {
        return data;
    };
    function _getSlideDirection(_elem) {
        var pager = $(_elem).smarthome("getPager");
        var pagerOpts = $.data(pager[0], "pagination").options;
        var opts = $.data(_elem, "smarthome").options;
        if (pagerOpts.oriPageNumber >= pagerOpts.pageNumber) {
            opts.slideDirection = "left-right";
        }
        else {
            opts.slideDirection = "right-left";
        }
    };
    /**
     * 重置panel
     * @param _elem
     * @private
     */
    function _resetPanelsContainer(_elem) {
        var opts = $.data(_elem, "smarthome").options;
        if (opts.slideDirection == "left-right") {
            $.data(_elem, "smarthome").dc.panelsContainer.css({
                left: "-" + opts.width + "px"})
        }
        if (opts.slideDirection == "right-left") {
            $.data(_elem, "smarthome").dc.panelsContainer.css({
                left: opts.width + "px"});
        }
        if ($.data(_elem, "smarthome").dc.panelsContainer.find("div.leepanel").length > 0) {
        }
        $.data(_elem, "smarthome").dc.panelsContainer.html("");
        //$.data(_elem, "smarthome").dc.panelsContainer.animate({width:"0"});
    };
    /**
     * 填充数据
     * @param _elem
     * @param data
     * @private
     */
    function _fillPanelsData(_elem, data) {
        var smarthome = $.data(_elem, "smarthome");
        var opts = smarthome.options;
        _getSlideDirection(_elem);

        if (data.leepanels && data.leepanels.length > 0) {
            _resetPanelsContainer(_elem);
            for (var i = 0; i < data.leepanels.length; i++) {
                var item = data.leepanels[i];
                //TODO
                // 重写item的背景图
                if (opts.panelsClsArray) {
                    var _panelsClsIndex = i % 10;
                    item.bgCls = opts.panelsClsArray[_panelsClsIndex];
                }
                this.insertPanel.call(this, _elem, item, -1);
            }
            if (data.leepanels.length < opts.pageSize) {
                var _emptyPanel = {};
                for (var _emptyPanelIndex = data.leepanels.length; _emptyPanelIndex < opts.pageSize; _emptyPanelIndex++) {
                    _emptyPanel.bgCls = opts.panelsClsArray[opts.panelsClsArray.length - 1];
                    this.insertPanel.call(this, _elem, _emptyPanel, -1);
                }
            }
        }
        smarthome.dc.panelsContainer.append("<span class='clear'></span>");

        $(_elem).smarthome("getPager").pagination("refresh", {
            total: data.total,
            pageSize: opts.pageSize  //update page size
        });
        var _panelsLeft = $.data(_elem, "smarthome").dc.panelsContainer.css("left");
        //如果正在执行动画，则不重新定义动画
        if (!$.data(_elem, "smarthome").dc.panelsContainer.is(":animated")) {
            if (opts.slideDirection == "left-right") {
                if (Math.abs(_panelsLeft) > opts.width) {
                    $.data(_elem, "smarthome").dc.panelsContainer.css({
                        left: "-" + opts.width + "px"}).width("0");
                }
                $.data(_elem, "smarthome").dc.panelsContainer.animate({
                        'opacity': 1,
                        left: "+=" + opts.width + "px"
                    },
                    {
                        duration: 300,
                        easing: "easeOutExpo",
                        queue: true,
                        always: function () {
                            //$.data(_elem, "smarthome").dc.panelsContainer.css({left: "0"})
                        }
                    }
                ).width(opts.width);
            }
            else if (opts.slideDirection == "right-left") {
                if (Math.abs(_panelsLeft) > opts.width) {
                    $.data(_elem, "smarthome").dc.panelsContainer.css({
                        left: opts.width + "px"}).width("0");
                }
                $.data(_elem, "smarthome").dc.panelsContainer.animate({
                        'opacity': 1,
                        left: "-=" + opts.width + "px"
                    },
                    {
                        duration: 300,
                        easing: "easeOutExpo",
                        queue: true,
                        step: function (now, tween) {
                        },
                        complete: function () {

                        },
                        //A function to be called when the animation completes or stops without completing
                        always: function () {
                            //$.data(_elem, "smarthome").dc.panelsContainer.css({left: "0"})
                        }
                    }
                ).width(opts.width);
            }
        }
        //$.data(_elem, "smarthome").dc.panelsContainer.animate({width:"1003px"});
    };

    function _insertPanel(smarthome, item, posIndex) {
        var container = smarthome.dc.panelsContainer;
        var opts = smarthome.options;
        if (posIndex == -1) {
            var bgColor, icon, aColor, leepanel, panelBorder, url = new Array();
            aColor = item.color || "";
            if (opts.urlPrefix) {
                url.push(opts.urlPrefix);
            }
            if (item.url) {
                url.push(item.url);
                //根据url-命令号设置背景图片样式
                item.bgCls= "busi"+item.url;
            }
            if (item.background) {
                bgColor = item.background.color || _randomColor();
            }
            else {
                bgColor = _randomColor();
            }
            panelBorder = $("<div><div class='leepanel business-leepanel'><div class='leepanel-text'></div></div></div>")
            //配置中定义的样式优先级高于背景色
            if (item.bgCls) {
                leepanel = panelBorder.children("div.leepanel").addClass(item.bgCls);
            } else {
                leepanel = panelBorder.children("div.leepanel").css({"background-color": bgColor});
            }
            if (opts.showPanelBorder) {
                panelBorder.addClass("leepanel-border")
            }
            //定义该业务显示在业务tab中，默认是business
            if (!item.tabName) {
                item.tabName = "business";
            }
            if (item.url) {
                if (item.iconCls) {
                    leepanel.children("div.leepanel-text").addClass(item.iconCls);
                }
                leepanel.children("div.leepanel-text").append($("<a></a>").attr("classname", item.bgCls)
                        .attr("href", "javascript:void(0)").css("color", aColor).bind("click", function () {
                        //.attr("title", "新建" + item.title + "业务页面")
                            if (opts.businessFrame) {
//                                $(opts.businessFrame).contents().find("body").empty().append(opts.businessFrameDelayLoadContent).css("background","#fff");
                                $(opts.businessFrame).attr("delayload", "true");
                                $(opts.businessFrame).contents().find("body").empty();
                                setTimeout(function(){
                                    $(opts.businessFrame).attr("src", url.join(""));
                                },300);

//                                $(opts.businessFrame).attr("src", url.join(""));
                                //toClick优先级高于displayContainerID
                                if (item.toClick) {
                                    $(item.toClick).click();
                                }
                                else {
                                    $("li[actionFor='" + item.tabName + "']").click();
                                    //重置业务界面
                                    var _businessIndex = $("<a href='javascript:void(0)' title='重新加载业务页面'></a>").attr("goto",url.join("")).html(item.title).bind("click",
                                    function(){
                                        $(opts.businessFrame).attr("src", "").attr("src", $(this).attr("goto"));
                                    });
                                    $("div[for='businessInfo']").children(".business-name").empty().append(_businessIndex);//.wrapInner("<span class='business-title'></span>");
                                    //处理用户自定义事件
                                    if (item.handler) {
                                        item.handler(this);
                                    }
                                }
                            }
                        }))
                    .hover(function () {
                        var $this = $(this);
                        $this.closest(".business-leepanel").addClass($this.children("a").attr("classname") + "-hover");
//                        $this.children("a").animate({"color": "#333"}, {
//                            duration: 300,
//                            easing: "linear",
//                            queue: true});
//                        if ($this.closest("div.hover-mask").length == 0) {
//                            $this.wrap("<div class='hover-mask'></div>");
//                        }
//                        $this.closest("div.hover-mask").animate(
//                            {backgroundColor: "#F2F2F2"},
//                            {
//                                duration: 300,
//                                easing: "linear",
//                                queue: true}
//                        );
                    }).mouseout(function () {
                        var $this = $(this);
                        $this.closest(".business-leepanel").removeClass($this.children("a").attr("classname") + "-hover");
//                        $this.children("a").animate({"color": "#fafafa"}, {
//                            duration: 300,
//                            easing: "linear",
//                            queue: true});
//                        if ($this.closest("div.hover-mask").length == 1) {
//                            $this.closest("div.hover-mask").animate(
//                                {backgroundColor: "transparent", opacity: 1, color: "#FFF"},
//                                {
//                                    duration: 300,
//                                    easing: "linear",
//                                    queue: true
//                                }
//                            );
//                        }
                    });
            }
            container.append(panelBorder);
        }
    };

    function _bindEvent(_elem, _opts) {
        $(window).resize(function () {
            if (_opts.autoPageSize) {
                _calcPageSize(_elem, _opts);
                //refresh home
                $(_elem).smarthome("getPager").pagination("options").pageNumber = 1;
                $(_elem).smarthome("reload");
            }
            _resetMenuPageCSS(_opts);
            _resetBusinessFrameCSS(_opts);
        });
    }

    function _resetMenuPageCSS(_opts) {
        $(".menu-page").height($(document.body).height()
            - $(_opts.footer).outerHeight());
    }

    function _resetBusinessFrameCSS(_opts) {
        $(_opts.businessFrame).width($(document.body).width()).height($(document.body).height()
            - $(_opts.footer).outerHeight() - $(_opts.businessHeader).outerHeight());
    };

    function _initBusinessHeader(_opts) {
        $(_opts.businessHeader).empty();

        var _businessHeader = $("<div class='system-name'></div>").appendTo(_opts.businessHeader);
        $("<div for='businessInfo' class='plain-text current-position'><span class='right-arrow'>您当前正在办理的业务：</span>" +
            "<span class='business-name-left'>&nbsp;</span><span class='business-name'></span><span class='business-name-right'>&nbsp;</span></div>").appendTo(_opts.businessHeader);

        if (_opts.showBusinessHeaderText) {
            _businessHeader.html(_opts.systemName);
        }


    }

    /**
     *  获取元素的完整高度
     *  if  elem is displayed as block ,but  parent is displayed asnone
     * @param elem
     * @param _parent
     * @returns {number}
     * @private
     */
    function _getFullHeight(elem, _parent) {
        if (_parent && elem) {
            var old = _resetCss(_parent, {display: "block", visibility: "hidden", position: "absolute"});
            var h = elem.offsetHeight;
            _restoreCss(_parent, old);
            return h;
        }
        else if (elem) {
            var old = _resetCss(elem, {display: "block", visibility: "hidden", position: "absolute"});
            var h = elem.offsetHeight;
            _restoreCss(elem, old);
            return h;
        }
        else {
            return 0
        }
    }

    function _getFullWidth(elem, _parent) {
        if (_parent && elem) {
            var old = _resetCss(_parent, {display: "block", visibility: "hidden", position: "absolute"});
            var w = elem.offsetWidth;
            _restoreCss(_parent, old);
            return w;
        }
        else if (elem) {
            var old = _resetCss(elem, {display: "block", visibility: "hidden", position: "absolute"});
            var w = elem.offsetWidth;
            _restoreCss(elem, old);
            return w;
        }
        else {
            return 0
        }
    }

    //重设样式。
    function _resetCss(elem, prop) {
        var old = {};
        for (var i in prop) {
            old[i] = elem.style[i];
            elem.style[i] = prop[i];
        }
        return old;
    }

    //回复样式。
    function _restoreCss(elem, prop) {
        for (var i in prop) {
            elem.style[i] = prop[i];
        }
    }

    /**
     *  calculate leepanel's number of  a page
     * @param _opts
     * @private
     */
    function _calcPageSize(_elem, _opts) {

        var _newHeight, _newWidth, _paginationInfoMargin = 10,
            _dc = $.data(_elem, "smarthome").dc,
             _menuBodyWidth = $(document.body).width() - _opts.panelCSS.width / 2,
            _columnCount = Math.floor(_menuBodyWidth / _opts.panelCSS.width),
            _menuBodyMargin = 10,
            _menuBodyMarginTop=0;



        //_dc.footerContainer.fadeOut(200)
        //relocate the footer
        if ($(document.body).width() < 1024) {
            _dc.footerContainer.footer("mobile");
            _dc.footerContainer.find("div[compatiable='mobile']").each(function () {
                $(this).addClass("mobile");
            })
        }
        else {
            _dc.footerContainer.footer("pc");
            _dc.footerContainer.find("div[compatiable='mobile']").each(function () {
                $(this).removeClass("mobile");
            })
        }
        // _dc.footerContainer.fadeIn(200)
        //resize footer width
        _dc.footerContainer.footer("resize");
        //calc row count
        var _menuBodyHeight = $(document.body).height() - _getFullHeight(_dc.menusHeader[0], _dc.menusHeader.parent()[0])
            - $(_opts.footer).outerHeight() - _getFullHeight($(_elem).smarthome("getPager").find(".pagination-info")[0], $(_elem).smarthome("getPager")[0]) -
                _paginationInfoMargin,
            _rowCount = Math.floor(_menuBodyHeight / _opts.panelCSS.height);

        if (_rowCount == 0) {
            _rowCount = 1;
        }
        if(_opts.maxRowNumber && _rowCount >3){
            _rowCount=_opts.maxRowNumber ;
        }
        //计算Menu Body 的外边距
        _menuBodyMarginTop =  (_menuBodyHeight-_rowCount * _opts.panelCSS.height + _opts.panelBodyPadding-30)/2;
        _dc.menusBody.css("margin-top",_menuBodyMarginTop);
        if (_columnCount == 0) {
            _columnCount = 1;
        }
        if(_opts.maxColumnNumber && _columnCount >4){
            _columnCount=_opts.maxColumnNumber ;
        }
        _opts.pageSize = _rowCount * _columnCount;
        _opts.pageNumber = 1;
        _newHeight = _rowCount * _opts.panelCSS.height + _opts.panelBodyPadding;
        _newWidth = _columnCount * _opts.panelCSS.width + _opts.panelBodyPadding;
        //设置容器宽度
        _dc.menusBody.width(_newWidth + 2 * _menuBodyMargin);
        _dc.panelsContainer.width(_newWidth);
        _dc.paginationContainer.width(_newWidth);
        _opts.width = _newWidth;
        //动画
        if (!_dc.menusBody.children(".leepanels-wrapper").is(":animated")) {
            _dc.menusBody.children(".leepanels-wrapper").animate({
                    'opacity': 1,
                    width: _newWidth,
                    height: _newHeight
                },
                {
                    duration: 300,
                    easing: "easeOutExpo",
                    queue: true,
                    fail: function () {
                    }
                });
        }
        //relocate the nav button position
        var _leftNav = _dc.paginationContainer.children(".left");
        var _rightNav = _dc.paginationContainer.children(".right");
        //动画
        if (!_leftNav.is(":animated")) {
            var _navTopOffset=_newHeight / 2 - _leftNav.find("a.lee-l-btn").outerHeight() / 2;
            _leftNav.animate({
                    'opacity': 1,
                    top: _navTopOffset
                },
                {
                    duration: 500,
                    easing: "easeOutExpo",
                    queue: true,
                    fail: function () {
                    }
                });
            _rightNav.animate({
                    'opacity': 1,
                    top: _navTopOffset
                },
                {
                    duration: 500,
                    easing: "easeOutExpo",
                    queue: true,
                    fail: function () {
                    }
                });
        }
//        //resize left,right region
//        var _mainHeight = $(document.body).height() - _dc.footerContainer.outerHeight();
//        _dc.leftRegion.height(_mainHeight);
//        _dc.rightRegion.height(_mainHeight);
//        //resize page wrapper
//        _dc.pageWrapper.width($(document.body).width() - ($(".left-region").width()*2));
    }

    var opearteHome = {
        render: function (_elem, data) {
            var _cachedData = $.data(_elem, "smarthome");
            _cachedData.data = data;
            _fillPanelsData.call(this, _elem, data);
        },
        insertPanel: function (_elem, leepanel, posIndex) {
            var _cachedData = $.data(_elem, "smarthome");
            _insertPanel.call(this, _cachedData, leepanel, posIndex);
        },
        onBeforeRender: function (_elem, leepanels) {
        },
        onAfterRender: function (_elem) {
        }
    };
    $.fn.smarthome = function (_options, _args) {
        if (typeof _options == "string") {
            return $.fn.smarthome.methods[_options](this, _args);
        }
        _options = _options || {};
        return this.each(function () {
            var _cachedSmarthome = $.data(this, "smarthome");
            var _opts;
            if (_cachedSmarthome) {
                _opts = $.extend(_cachedSmarthome.options, _options);
                _cachedSmarthome.options = _opts;
            }
            else {
                // var extendOpts = $.metadata ? $.extend({}, _opts, $this.data()) : _opts;
                _opts = $.extend(
                    {},
                    $.extend(
                        {},
                        $.fn.smarthome.defaults,
                        {queryParams: {}}
                    ),
                    $.fn.smarthome.parseOptions(this),
                    _options);
                var leepanels = _preparePanels(_opts.leepanels);
                var _dc = _init(this, _opts);
                _bindEvent(this, _opts);
                _resetBusinessFrameCSS(_opts);
                _resetMenuPageCSS(_opts);
                _initBusinessHeader(_opts);
                $.data(this, "smarthome", {
                    options: _opts,
                    dc: _dc,
                    data: {
                        total: 0,
                        leepanels: leepanels
                    }
                });
                if (_opts.autoPageSize) {
                    _calcPageSize(this, _opts);
                }
            }
        });
    };
    $.fn.smarthome.parseOptions = function (_elem) {
        var t = $(_elem);
        return $.extend({}, $.parser
            .parseOptions(_elem, [ "url", "toolbar", "idField", "sortName",
                "sortOrder", "pagePosition", {
                    cache: "boolean",//add
                    fitColumns: "boolean",
                    autoRowHeight: "boolean",
                    striped: "boolean",
                    nowrap: "boolean"
                }, {
                    rownumbers: "boolean",
                    singleSelect: "boolean",
                    checkOnSelect: "boolean",
                    selectOnCheck: "boolean"
                }, {
                    pagination: "boolean",
                    pageSize: "number",
                    pageNumber: "number"
                }, {
                    remoteSort: "boolean",
                    showHeader: "boolean",
                    showFooter: "boolean"
                }, {
                    scrollbarSize: "number"
                } ]), {
            pageList: (t.attr("pageList") ? eval(t.attr("pageList"))
                : undefined),
            loadMsg: (t.attr("loadMsg") != undefined ? t.attr("loadMsg")
                : undefined),
            rowStyler: (t.attr("rowStyler") ? eval(t.attr("rowStyler"))
                : undefined)
        });
    };
    $.fn.smarthome.methods = {
        options: function (jq) {
            return $.data(jq[0], "smarthome").options;
        },
        fillPanelsData: function (jq, leepanels) {
            return jq.each(function () {
                var opts = $(this).smarthome("options");
                _fillPanelsData(opts.home, leepanels);
            });
        },
        getPager: function (jq) {
            return $.data(jq[0], "smarthome").dc.paginationContainer;
        },
        getFooter: function (jq) {
            return $.data(jq[0], "smarthome").dc.footer;
        },
        getPanel: function (jq) {
            return $.data(jq[0], "smarthome").dc.panelsContainer;
        },
        load: function (jq, _queryParams) {
            return jq.each(function () {
                var opts = $(this).smarthome("options");
                opts.pageNumber = 1;
                var _pager = $(this).smarthome("getPager");
                _pager.pagination("options").pageNumber = 1;
                _loadPageData(this, _queryParams);
            });
        },
        reload: function (jq, _queryParams) {
            return jq.each(function () {
                _loadPageData(this, _queryParams);
            });
        },
        loading: function (jq) {
            return jq.each(function () {
                var opts = $.data(this, "smarthome").options;
                $(this).smarthome("getPager").pagination("loading");
                if (opts.loadMsg) {
                    var _panels = $(this).smarthome("getPanel");
                    $("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_panels);
                    var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block\"></div>")
                        .html(opts.loadMsg).appendTo(_panels);
                    msg.css("left", (_panels.width() - msg._outerWidth()) / 2);
                }
            });
        },
        loaded: function (jq) {
            return jq.each(function () {
                $(this).smarthome("getPager").pagination("loaded");
                var _panels = $(this).smarthome("getPanel");
                _panels.children("div.datagrid-mask-msg").remove();
                _panels.children("div.datagrid-mask").remove();
            });
        }
    };
    $.fn.smarthome.defaults = {
        width: 1001,
        height: 300,
        leepanels: undefined,
        panelsClsArray: undefined,
        pageNumber: 1,
        pageSize: 15,
        panelCSS: {
            height: 102,
            width: 202
        },
        panelBodyPadding: 4,
        pagination: false,
        autoPageSize: false,
        pagePosition: "bottom",
        queryParams: {},
        slideDirection: "right-left",
        showPanelBorder: true,
        urlPrefix: undefined,
        businessFrame: undefined,
        businessFrameDelayLoadContent: undefined,
        systemName: undefined,
        logoCls: undefined,
        businessHeader: undefined,
        footer: undefined,
        footerButtons: undefined,
        maxRowNumber:undefined,
        maxColumnNumber:undefined,
        home: opearteHome,
        loader: function (_params, _onSuccess, _onError) {
            var opts = $(this).smarthome("options");
            if (!opts.url) {
                return false;
            }
            $.ajax({
                cache: opts.cache, //add
                type: opts.method,
                url: opts.url,
                data: _params,
                dataType: "json",
                success: function (data) {
                    _onSuccess(data);
                },
                error: function () {
                    _onError.apply(this, arguments);
                }
            });
        },
        onBeforeLoad: function (_elem) {
        },
        onLoadSuccess: function (data) {
        },
        onLoadError: function () {
        }
    };
})(jQuery);
(function ($) {
    function _render(_elem) {
        var _paginationCache = $.data(_elem, "pagination");
        var _opts = _paginationCache.options;
        var bb = _paginationCache.bb = {};
        var _paginationOperation = {
            first: {
                iconCls: "pagination-first",
                handler: function () {
                    if (_opts.pageNumber > 1) {
                        _savePageNumber(_elem, _opts.pageNumber);
                        _selectPage(_elem, 1);
                    }
                }
            },
            prev: {
                iconCls: "pagination-prev",
                handler: function () {
                    if (_opts.pageNumber > 1) {
                        _savePageNumber(_elem, _opts.pageNumber);
                        _selectPage(_elem, _opts.pageNumber - 1);
                    }
                }
            },
            next: {
                iconCls: "pagination-next",
                handler: function () {
                    var _pageCount = Math.ceil(_opts.total / _opts.pageSize);
                    if (_opts.pageNumber < _pageCount) {
                        _savePageNumber(_elem, _opts.pageNumber);
                        _selectPage(_elem, _opts.pageNumber + 1);
                    }
                }
            },
            last: {
                iconCls: "pagination-last",
                handler: function () {
                    var _pageCount = Math.ceil(_opts.total / _opts.pageSize);
                    if (_opts.pageNumber < _pageCount) {
                        _savePageNumber(_elem, _opts.pageNumber);
                        _selectPage(_elem, _pageCount);
                    }
                }
            },
            refresh: {
                iconCls: "pagination-load",
                handler: function () {
                    if (_opts.onBeforeRefresh.call(_elem, _opts.pageNumber,
                        _opts.pageSize) != false) {
                        _savePageNumber(_elem, _opts.pageNumber);
                        _selectPage(_elem, _opts.pageNumber);
                        _opts.onRefresh.call(_elem, _opts.pageNumber, _opts.pageSize);
                    }
                }
            }
        };
        var _pagination = $(_elem).addClass("pagination").html(
            "<div class='top'></div><div class='left'></div><div class='right'></div><div class='bottom'></div>");
        var leftRegion = _pagination.find(".left");
        var rightRegion = _pagination.find(".right");
        var topRegion = _pagination.find(".top");
        var bottomRegion = _pagination.find(".bottom");

        function _renderButton(_method, region) {
            var a = $("<a href=\"javascript:void(0)\"></a>").appendTo(region);
            a.wrap("<span></span>");
            a.linkbutton({
                iconCls: _paginationOperation[_method].iconCls
            }).unbind(".pagination").bind("click.pagination", _paginationOperation[_method].handler);
            return a;
        };
        if (_opts.showPageList) {
            var ps = $("<select class=\"pagination-page-list\"></select>");
            ps.bind("change", function () {
                _opts.pageSize = parseInt($(this).val());
                _opts.onChangePageSize.call(_elem, _opts.pageSize);
                _selectPage(_elem, _opts.pageNumber);
            });
            for (var i = 0; i < _opts.pageList.length; i++) {
                $("<option></option>").text(_opts.pageList[i]).appendTo(ps);
            }
            $("<td></td>").append(ps).appendTo(tr);
            $("<td><div class=\"pagination-btn-separator\"></div></td>")
                .appendTo(tr);
        }
        if (_opts.showFirst) {
            bb.first = _renderButton("first", leftRegion);
        }

        bb.prev = _renderButton("prev", leftRegion);

        //若显示页码框，则执行下面的逻辑
        if (_opts.showPageNumber) {
            $("<span style=\"padding-left:6px;\"></span>").html(_opts.beforePageText)
                .appendTo(tr).wrap("<td></td>");
            bb.num = $(
                "<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">")
                .appendTo(tr).wrap("<td></td>");
            bb.num.unbind(".pagination").bind("keydown.pagination", function (e) {
                if (e.keyCode == 13) {
                    var _pageNumber = parseInt($(this).val()) || 1;
                    _selectPage(_elem, _pageNumber);
                    return false;
                }
            });
            bb.after = $("<span style=\"padding-right:6px;\"></span>").appendTo(tr)
                .wrap("<td></td>");
            $("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(
                tr);
        }

        bb.next = _renderButton("next", rightRegion);

        if (_opts.showLast) {
            bb.last = _renderButton("last", rightRegion);
        }

        if (_opts.showRefresh) {
            bb.refresh = _renderButton("refresh", topRegion);
        }
        //处理自定义按钮
        if (_opts.buttons) {
            $("<td><div class=\"pagination-btn-separator\"></div></td>")
                .appendTo(tr);
            for (var i = 0; i < _opts.buttons.length; i++) {
                var btn = _opts.buttons[i];
                if (btn == "-") {
                    $("<td><div class=\"pagination-btn-separator\"></div></td>")
                        .appendTo(tr);
                } else {
                    var td = $("<td></td>").appendTo(tr);
                    $("<a href=\"javascript:void(0)\"></a>").appendTo(td)
                        .linkbutton($.extend(btn, {
                            plain: true
                        })).bind("click", eval(btn.handler || function () {
                        }));
                }
            }
        }
        $("<div class=\"pagination-info\"></div>").appendTo(_pagination);
        $("<div style=\"clear:both;\"></div>").appendTo(_pagination);
    };
    function _savePageNumber(_elem, _pageNumber) {
        var _paginationCache = $.data(_elem, "pagination").options;
        _paginationCache.oriPageNumber = _pageNumber;
    };
    function _selectPage(_elem, _pageNumber) {
        var _paginationCache = $.data(_elem, "pagination").options;
        var _pageCount = Math.ceil(_paginationCache.total / _paginationCache.pageSize) || 1;
        _paginationCache.pageNumber = _pageNumber;
        if (_paginationCache.pageNumber < 1) {
            _paginationCache.pageNumber = 1;
        }
        if (_paginationCache.pageNumber > _pageCount) {
            _paginationCache.pageNumber = _pageCount;
        }
        _refreshPage(_elem, {pageNumber: _paginationCache.pageNumber });
        _paginationCache.onSelectPage.call(_elem, _paginationCache.pageNumber, _paginationCache.pageSize);
    };
    function _refreshPage(_elem, _options) {
        var _opts = $.data(_elem, "pagination").options;
        var bb = $.data(_elem, "pagination").bb;
        $.extend(_opts, _options || {});
        var ps = $(_elem).find("select.pagination-page-list");
        if (ps.length) {
            ps.val(_opts.pageSize + "");
            _opts.pageSize = parseInt(ps.val());
        }
        var _pageCount = Math.ceil(_opts.total / _opts.pageSize) || 1;
        if (_opts.showPageNumber) {
            bb.num.val(_opts.pageNumber);
            bb.after.html(_opts.afterPageText.replace(/{pages}/, _pageCount));
        }
        var _dispMsg = _opts.displayMsg;
        _dispMsg = _dispMsg.replace(/{from}/, _opts.total == 0 ? 0 : _opts.pageSize
            * (_opts.pageNumber - 1) + 1);
        _dispMsg = _dispMsg.replace(/{to}/, Math.min(_opts.pageSize * (_opts.pageNumber),
            _opts.total));
        _dispMsg = _dispMsg.replace(/{total}/, _opts.total);
        $(_elem).find("div.pagination-info").html(_dispMsg);
        if (_opts.showFirst) {
            bb.first.add(bb.prev).linkbutton({
                disabled: (_opts.pageNumber == 1)
            });
        }
        else {
            bb.prev.linkbutton({disabled: (_opts.pageNumber == 1)});
        }
        if (_opts.showLast) {
            bb.next.add(bb.last).linkbutton({
                disabled: (_opts.pageNumber == _pageCount)
            });
        }
        else {
            bb.next.linkbutton({disabled: (_opts.pageNumber == _pageCount)});
        }
        _toggleLoading(_elem, _opts.loading);
    };
    function _toggleLoading(_elem, _loading) {
        var _opts = $.data(_elem, "pagination").options;
        var bb = $.data(_elem, "pagination").bb;
        _opts.loading = _loading;
        if (_opts.showRefresh) {
            if (_opts.loading) {
                bb.refresh.linkbutton({
                    iconCls: "pagination-loading"
                });
            } else {
                bb.refresh.linkbutton({
                    iconCls: "pagination-load"
                });
            }
        }
    };
    $.fn.pagination = function (_options, _args) {
        if (typeof _options == "string") {
            return $.fn.pagination.methods[_options](this, _args);
        }
        _options = _options || {};
        return this.each(function () {
            var extendOpts;
            var paginationCache = $.data(this, "pagination");
            if (paginationCache) {
                extendOpts = $.extend(paginationCache.options, _options);
            } else {
                extendOpts = $.extend({}, $.fn.pagination.defaults, $.fn.pagination
                    .parseOptions(this), _options);
                $.data(this, "pagination", {
                    options: extendOpts
                });
            }
            _render(this);
            _refreshPage(this);
        });
    };
    $.fn.pagination.methods = {
        options: function (jq) {
            return $.data(jq[0], "pagination").options;
        },
        loading: function (jq) {
            return jq.each(function () {
                _toggleLoading(this, true);
            });
        },
        loaded: function (jq) {
            return jq.each(function () {
                _toggleLoading(this, false);
            });
        },
        refresh: function (jq, _options) {
            return jq.each(function () {
                _refreshPage(this, _options);
            });
        },
        select: function (jq, _pageNumber) {
            return jq.each(function () {
                _selectPage(this, _pageNumber);
            });
        }
    };
    $.fn.pagination.parseOptions = function (_8b) {
        var t = $(_8b);
        return $.extend({}, $.parser.parseOptions(_8b, [
            {
                total: "number",
                pageSize: "number",
                pageNumber: "number"
            },
            {
                loading: "boolean",
                showPageList: "boolean",
                showRefresh: "boolean"
            }
        ]), {
            pageList: (t.attr("pageList") ? eval(t.attr("pageList"))
                : undefined)
        });
    };
    $.fn.pagination.defaults = {
        total: 1,
        pageSize: 15,
        pageNumber: 1,
        oriPageNumber: 1,
        pageList: [ 10, 20, 30, 50 ],
        loading: false,
        buttons: null,
        showPageList: false,
        showRefresh: false,
        showFirst: false,
        showLast: false,
        showPageNumber: false,
        onSelectPage: function (_8c, _8d) {
        },
        onBeforeRefresh: function (_8e, _8f) {
        },
        onRefresh: function (_90, _91) {
        },
        onChangePageSize: function (_92) {
        },
        beforePageText: "Page",
        afterPageText: "of {pages}",
        displayMsg: "当前显示第{from} 到第 {to}项业务， 共{total}项业务"
    };
})(jQuery);
(function ($) {
    function _render(_elem) {
        var _opts = $.data(_elem, "linkbutton").options;
        $(_elem).empty();
        $(_elem).addClass("lee-l-btn");
        if (_opts.id) {
            $(_elem).attr("id", _opts.id);
        } else {
            $(_elem).attr("id", "");
        }
        if (_opts.plain) {
            $(_elem).addClass("lee-l-btn-plain");
        } else {
            $(_elem).removeClass("lee-l-btn-plain");
        }
        if (_opts.text) {
            $(_elem).html(_opts.text).wrapInner(
                "<span class=\"lee-l-btn-left\">"
                    + "<span class=\"lee-l-btn-text\">" + "</span>"
                    + "</span>");
            if (_opts.iconCls) {
                $(_elem).find(".lee-l-btn-text").addClass(_opts.iconCls).css(
                    "padding-left", "30px");
            }
        } else if (_opts.image) {
            $(_elem).html("&nbsp;").wrapInner("<a class='lee-l-btn lee-l-btn-image' href='javascript:void(0)'></a>");
            $(_elem).find(".lee-l-btn-image").addClass(_opts.iconCls);

        } else {
            $(_elem).html("&nbsp;").wrapInner(
                "<span class=\"lee-l-btn-left\">"
                    + "<span class=\"lee-l-btn-text\">"
                    + "<span class=\"lee-l-btn-empty\"></span>" + "</span>"
                    + "</span>");
            if (_opts.iconCls) {
                $(_elem).find(".lee-l-btn-empty").addClass(_opts.iconCls);
            }
        }
        $(_elem).unbind(".linkbutton").bind("focus.linkbutton",function () {
            if (!_opts.disabled) {
                $(this).find("span.lee-l-btn-text").addClass("lee-l-btn-focus");
            }
        }).bind("blur.linkbutton", function () {
                $(this).find("span.lee-l-btn-text").removeClass("lee-l-btn-focus");
            });
        _toggleLinkbutton(_elem, _opts.disabled);
    }
    ;
    function _toggleLinkbutton(_elem, _disabled) {
        var _cachedLinkbutton = $.data(_elem, "linkbutton");
        if (_disabled) {
            _cachedLinkbutton.options.disabled = true;
            var _href = $(_elem).attr("href");
            if (_href) {
                _cachedLinkbutton.href = _href;
                $(_elem).attr("href", "javascript:void(0)");
            }
            if (_elem.onclick) {
                _cachedLinkbutton.onclick = _elem.onclick;
                _elem.onclick = null;
            }
            $(_elem).addClass("lee-l-btn-disabled").hide();//禁用后隐藏
        } else {
            _cachedLinkbutton.options.disabled = false;
            if (_cachedLinkbutton.href) {
                $(_elem).attr("href", _cachedLinkbutton.href);
            }
            if (_cachedLinkbutton.onclick) {
                _elem.onclick = _cachedLinkbutton.onclick;
            }
            $(_elem).removeClass("lee-l-btn-disabled").show();//启用后显示
        }
    }
    ;
    $.fn.linkbutton = function (_options, _args) {
        if (typeof _options == "string") {
            return $.fn.linkbutton.methods[_options](this, _args);
        }
        _options = _options || {};
        return this.each(function () {
            var cachedData = $.data(this, "linkbutton");
            if (cachedData) {
                $.extend(cachedData.options, _options);
            } else {
                $.data(this, "linkbutton", {
                    options: $.extend({}, $.fn.linkbutton.defaults,
                        $.fn.linkbutton.parseOptions(this), _options)
                });
                $(this).removeAttr("disabled");
            }
            _render(this);
        });
    };
    $.fn.linkbutton.methods = {
        options: function (jq) {
            return $.data(jq[0], "linkbutton").options;
        },
        enable: function (jq) {
            return jq.each(function () {
                _toggleLinkbutton(this, false);
            });
        },
        disable: function (jq) {
            return jq.each(function () {
                _toggleLinkbutton(this, true);
            });
        },
        hide:function(jq){
            return jq.each(function(){
                $(this).hide();
            });
        },
        show:function(jq){
            return jq.each(function(){
                $(this).show();
            });
        }
    };
    $.fn.linkbutton.parseOptions = function (_6a) {
        var t = $(_6a);
        return $.extend({}, $.parser.parseOptions(_6a, [ "id", "iconCls", {
            plain: "boolean"
        } ]), {
            disabled: (t.attr("disabled") ? true : undefined),
            text: $.trim(t.html()),
            iconCls: (t.attr("icon") || t.attr("iconCls"))
        });
    };
    $.fn.linkbutton.defaults = {
        id: null,
        disabled: false,
        plain: false,
        text: undefined,
        image: true,
        iconCls: null
    };
})(jQuery);
(function ($) {
    function _init(_elem) {
        var _footerContent = $(_elem).children(".footer-content"),
            _footerLeft = $(_elem).children(".footer-left"),
            _footerRight = $(_elem).children(".footer-right");
        return {
            footerContent: _footerContent,
            footerLeft: _footerLeft,
            footerRight: _footerRight
        };
    }

    function _render(_elem) {
        var _opts = $.data(_elem, "footer").options;
        $(_elem).empty();
        $(_elem).addClass("footer-wrapper");
        var _contentHtml = [];
        _contentHtml.push("<div class='footer-left'></div><div class='footer-content'><table><tr><td align='center'><ul id='todo-list'></ul></td></tr></table></div>");
        _contentHtml.push("<div id='statusbar'  class='statusbar-normal' compatiable='mobile'><div class='userinfo-plain plain-text'></div>");
        _contentHtml.push("<div class='department-plain plain-text'></div></div>");
        _contentHtml.push("<div id='controlbar' class='controlbar-normal' compatiable='mobile'><div class='controlbar-buttons'></div></div>");
        _contentHtml.push("<div class='footer-right'></div>");
        $(_elem).wrapInner(_contentHtml.join(""));
        var _footerContent = $(_elem).children(".footer-content");

        function _renderButton(_button, _region) {
            var a = $("<a href=\"javascript:void(0)\"></a>").appendTo(_region);
            a.wrap("<span></span>"); // class='button-wrapper'
            a.linkbutton({
                iconCls: _button.iconCls,
                text: _button.text
            }).unbind(".controlbar").bind("click.controlbar", _button.handler);
            return a;
        };

        var _buttonWrapper =  $(_elem).children("#controlbar").children(".controlbar-buttons");
        if (_opts.footerButtons) {
            for (var _buttonIndex = 0; _buttonIndex < _opts.footerButtons.length; _buttonIndex++) {
                var o = _opts.footerButtons[_buttonIndex];
                _renderButton(o, _buttonWrapper);
            }
        }

        var pageWidth = $("body").width();
        var _currentSelectedID;

        function _renderToDo(_todo, _region) {
            var li = $("<li class='todo'></li>").appendTo(_region),
                doPageID = "#" + _todo.actionFor;
            if (_todo.title && _todo.showTitle) {
                li.html(_todo.title)
            }
            if (_todo.title && _todo.actionFor) {
                li.attr("title", _todo.title).attr("actionFor", _todo.actionFor).attr("id", _todo.id).
                    wrapInner("<div class='todo-text'></div>").append("<div class='selection-bar'></div><div class='todo-image'><a></a></div>");
            }
            if (_todo.selected && _todo.todoCls) {
                li.addClass("selected");
                li.addClass(_todo.todoCls);
                li.children(".todo-image").addClass("switch-selected");
                _currentSelectedID = _todo.id;
            }
            else//隐藏非选中状态的页面
            {
                if (_todo.todoCls) {
                    li.addClass(_todo.todoCls);
                }
                li.css("margin-left", "10px");
                $(doPageID).css("left", pageWidth);
            }
            li.unbind(".todo").bind("click.todo", function () {
                _todoClick(li, doPageID, _todo);
                _todo.handler.call(li);
            });
        }

        function _todoClick(_obj, _doPageID, _todo) {
            if (!_obj.hasClass("selected") &&
                (!_todo.renderInFrame || (_todo.renderInFrame && ($(_doPageID).find("iframe").attr("src") || $(_doPageID).find("iframe").attr("delayload"))))) {
                var thisLeft, siblingsLeft, animateLeft, _direction;
                //判断当前点击事件触发的滑动方向
                if (_currentSelectedID > _obj.attr("id")) {
                    _direction = "leftToRight"
                } else if (_currentSelectedID < _obj.attr("id")) {
                    _direction = "rightToLeft"
                }
                _currentSelectedID = _obj.attr("id");

                if (_direction == "leftToRight") {
                    thisLeft = -pageWidth;
                    siblingsLeft = pageWidth;
                    animateLeft = "+=" + pageWidth + "px";
                }
                else if (_direction == "rightToLeft") {
                    thisLeft = pageWidth;
                    siblingsLeft = -pageWidth;
                    animateLeft = "-=" + pageWidth + "px";
                }
                _obj.addClass("selected").siblings().removeClass('selected');
                _obj.children(".todo-image").addClass("switch-selected");
                _obj.addClass("selected").siblings().children(".todo-image").removeClass("switch-selected");
                //当多于两个切换标签时，此处需要做出相应调整
                $(_doPageID).siblings().hide().removeClass("show").css("left", siblingsLeft);
                //此处非请勿动
                $(_doPageID).show().addClass("show").css("left", thisLeft);

                $(_doPageID).animate({
                        'opacity': 1,
                        left: animateLeft
                    },
                    {
                        duration: 400,
                        easing: "easeOutExpo",
                        queue: true,
                        fail: function () {
                            $(_doPageID).css("left", 0);
                        }
                    }
                );
            }
        }

        var _todoList = _footerContent.find("ul#todo-list");
        if (_opts.footerToDoList) {
            for (var _todoIndex = 0; _todoIndex < _opts.footerToDoList.length; _todoIndex++) {
                var o = _opts.footerToDoList[_todoIndex];
                _renderToDo(o, _todoList);
            }
        }
        if (_opts.systemName) {
            //$("<em class='desc'></em>").html(_opts.systemName).appendTo(_footerContent.children("div#statusbar"));
        }
    };
    function _resizeFooter(_elem) {
        var _dc = $.data(_elem, "footer").dc;
        var hackwidth=1;
        //calc footer width
        var _isMobile = _dc.footerContent.hasClass("mobile");
        if(!_isMobile){
        _dc.footerContent.width($(document.body).width() - _dc.footerLeft.width() - _dc.footerRight.width()-hackwidth);
        }
        else{
            _dc.footerContent.css("width","100%");
        }
    };
    function _convertToMobileView(_elem) {
        var _dc = $.data(_elem, "footer").dc;
        _dc.footerContent.closest("div#footer").addClass("footer-wrapper-mobile");
        _dc.footerContent.addClass("footer-content-mobile").addClass("mobile");
        _dc.footerLeft.addClass("footer-left-mobile");
        _dc.footerRight.addClass("footer-right-mobile");
    };
    function _convertToPCView(_elem) {
        var _dc = $.data(_elem, "footer").dc;
        _dc.footerContent.closest("div#footer").removeClass("footer-wrapper-mobile");
        _dc.footerContent.removeClass("footer-content-mobile").removeClass("mobile");
        _dc.footerLeft.removeClass("footer-left-mobile");
        _dc.footerRight.removeClass("footer-right-mobile");
    };
    $.fn.footer = function (_options, _args) {
        if (typeof _options == "string") {
            return $.fn.footer.methods[_options](this, _args);
        }
        _options = _options || {};
        return this.each(function () {
            var cachedData = $.data(this, "footer");
            if (cachedData) {
                $.extend(cachedData.options, _options);
            } else {
                $.data(this, "footer", {
                    options: $.extend({}, $.fn.footer.defaults, _options)
                });
            }
            _render(this);
            var _dc = _init(this);
            $.data(this, "footer", {
                options: _options,
                dc: _dc
            });
            _resizeFooter(this);
        });
    };
    $.fn.footer.methods = {
        resize: function (jq) {
            return jq.each(function () {
                _resizeFooter(this);
            });
        },
        mobile: function (jq) {
            return jq.each(function () {
                _convertToMobileView(this);
            });
        },
        pc: function (jq) {
            return jq.each(function () {
                _convertToPCView(this);
            });
        }
    };
    $.fn.footer.defaults = {
        footerButtons: undefined
    };
})(jQuery);
(function ($) {
    $.parser = {
        //auto : true,
        auto: false,
        onComplete: function (_1) {
        },
        plugins: [ "draggable", "droppable", "resizable", "pagination",
            "linkbutton", "menu", "menubutton", "splitbutton",
            "progressbar", "tree", "combobox", "combotree", "combogrid",
            "numberbox", "validatebox", "searchbox", "numberspinner",
            "timespinner", "calendar", "datebox", "datetimebox", "slider",
            "layout", "panel", "datagrid", "propertygrid", "treegrid",
            "tabs", "accordion", "window", "dialog" ],
        parse: function (_2) {
            var aa = [];
            for (var i = 0; i < $.parser.plugins.length; i++) {
                var _3 = $.parser.plugins[i];
                var r = $(".easyui-" + _3, _2);
                if (r.length) {
                    if (r[_3]) {
                        r[_3]();
                    } else {
                        aa.push({
                            name: _3,
                            jq: r
                        });
                    }
                }
            }
            if (aa.length && window.easyloader) {
                var _4 = [];
                for (var i = 0; i < aa.length; i++) {
                    _4.push(aa[i].name);
                }
                easyloader.load(_4, function () {
                    for (var i = 0; i < aa.length; i++) {
                        var _5 = aa[i].name;
                        var jq = aa[i].jq;
                        jq[_5]();
                    }
                    $.parser.onComplete.call($.parser, _2);
                });
            } else {
                $.parser.onComplete.call($.parser, _2);
            }
        },
        parseOptions: function (_6, _7) {
            var t = $(_6);
            var _8 = {};
            var s = $.trim(t.attr("data-options"));
            if (s) {
                var _9 = s.substring(0, 1);
                var _a = s.substring(s.length - 1, 1);
                if (_9 != "{") {
                    s = "{" + s;
                }
                if (_a != "}") {
                    s = s + "}";
                }
                _8 = (new Function("return " + s))();
            }
            if (_7) {
                var _b = {};
                for (var i = 0; i < _7.length; i++) {
                    var pp = _7[i];
                    if (typeof pp == "string") {
                        if (pp == "width" || pp == "height" || pp == "left"
                            || pp == "top") {
                            _b[pp] = parseInt(_6.style[pp]) || undefined;
                        } else {
                            _b[pp] = t.attr(pp);
                        }
                    } else {
                        for (var _c in pp) {
                            var _d = pp[_c];
                            if (_d == "boolean") {
                                _b[_c] = t.attr(_c) ? (t.attr(_c) == "true")
                                    : undefined;
                            } else {
                                if (_d == "number") {
                                    _b[_c] = t.attr(_c) == "0" ? 0
                                        : parseFloat(t.attr(_c))
                                        || undefined;
                                }
                            }
                        }
                    }
                }
                $.extend(_8, _b);
            }
            return _8;
        }
    };
    $(function () {
        if (!window.easyloader && $.parser.auto) {
            $.parser.parse();
        }
    });
    $.fn._outerWidth = function (_e) {
        if (_e == undefined) {
            if (this[0] == window) {
                return this.width() || document.body.clientWidth;
            }
            return this.outerWidth() || 0;
        }
        return this.each(function () {
            if (!$.support.boxModel && $.browser.msie) {
                $(this).width(_e);
            } else {
                $(this).width(_e - ($(this).outerWidth() - $(this).width()));
            }
        });
    };
    $.fn._outerHeight = function (_f) {
        if (_f == undefined) {
            if (this[0] == window) {
                return this.height() || document.body.clientHeight;
            }
            return this.outerHeight() || 0;
        }
        return this
            .each(function () {
                if (!$.support.boxModel && $.browser.msie) {
                    $(this).height(_f);
                } else {
                    $(this)
                        .height(
                            _f
                                - ($(this).outerHeight() - $(
                                this).height()));
                }
            });
    };
    $.fn._propAttr = $.fn.prop || $.fn.attr;
})(jQuery);