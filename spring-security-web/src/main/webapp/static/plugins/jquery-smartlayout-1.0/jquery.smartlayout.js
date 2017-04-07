/**
 * author: liyue
 * Date: 13-9-25
 * Time: 下午3:43
 * for quickly generate layout
 */
(function ($) {
    function _init(_elem) {
        var _opts = $.data(_elem, "smartlayout").options;
        $(_elem).children(".lee-layout-panel").each(function () {
            var _float, _position, _height, _width,_overflow;
            switch ($(this).attr("position")) {
                case "east":
                    _float = "left";
                    _height = "100%";
                    _overflow="auto";
                    if ($(this).attr("fit") == "true") {
                        _width = $("body").outerWidth() - 40;
                        $(this).siblings(".lee-layout-panel").each(function () {
                            _width -= $(this).outerWidth();
                        })
                    }
                    break;
                case "west":
                    _float = "left";
                    _height = "100%";
                    break;
                case "north":
                    break;
                case "south":
                    break;
                case "center":
                    break;
                default :
                    _float = "none";
                    break;
            }
            $(this).css({
                float: _float
            });
            if (_height) {
                $(this).css({
                    height: _height
                });
                $(this).children(".lee-layout-panel-content").css({
                    height: _height
                });
            }
            if (_width) {
                $(this).css({
                    width: _width
                });
            }
            if(_overflow){
                $(this).css({
                    overflow: _overflow
                });
            }
//            if ($(this).children(".clearfloat").length == 0) {
//                $(this).append("<div class='clearfloat'></div>");
//            }
        });
        $(_elem).css({
            "float": "left",
            height: "100%",
            overflow: "hidden"
        });
    };
    function _bindEvent(_elem) {
        var cachedData = $.data(_elem, "smartlayout");
    }

    $.fn.smartlayout = function (method, options) {
        if (typeof method == "string") {
            return $.fn.smartlayout.methods[method](this, options);
        }
        var opts = $.extend({}, $.fn.smartlayout.defaults, method);
        return this.each(function () {
            var $this = $(this);
            var extendOpts = $.metadata ? $.extend({}, opts, $this.data()) : opts;

            $.data(this, "smartlayout", {
                options: extendOpts
            });
            _init(this);
            _bindEvent(this);
        });
    };
    $.fn.smartlayout.methods = {

    };
    $.fn.smartlayout.defaults = {
    }
})(jQuery);
