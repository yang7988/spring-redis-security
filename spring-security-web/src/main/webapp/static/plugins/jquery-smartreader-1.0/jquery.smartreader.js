/**
 * author: liyue
 * Date: 13-9-10
 * Time: 下午4:10
 * dependency easyui messager
 */
(function ($) {
    function _init(_elem) {
        var _opts = $.data(_elem, "smartreader").options;
        var _container;
        if (_opts.identityCard) {
            _container = $("<div class='reader-container'><a title='' class='reader-main'></a></div>")
                .insertAfter($(_elem).find("input[type=text]"));
        }
        else if (_opts.citizenCard) {
            _container = $("<div class='reader-container'><a title='' class='reader-main'></a></div>")
                .insertAfter($(_elem).find("input[type=text]"));   //.css("margin-left","35px")
        }
        if (_container) {
            var _a = _container.children(".reader-main");
            if (_opts.readerTitle) {
                _a.attr("title", _opts.readerTitle);
            }
            if (_opts.readerCls) {
                _a.addClass(_opts.readerCls);
            }
        }
        return{
            reader: $(_elem).find(".reader-container"),
            readerInput: $(_elem).children(".item-value").children("input[type=text]")
        }
    };
    function _bindEvent(_elem) {
        var _cachedData = $.data(_elem, "smartreader");
        var jActiveX = _cachedData.options.activeXObj;
        $(_elem).find(".reader-container").bind("click", function () {
            var _input = _cachedData.dc.readerInput;
            if (navigator.userAgent.indexOf("IE") < 0) {
                $.messager.alert("提示", "请使用IE内核的浏览器！", "warning");
                return false;
            }
            if (_cachedData.options.citizenCard) {
                try {
                    if (jActiveX) {
                        //检查是是否插入读卡器
                        if (!jActiveX.IsReaderCard()) {
                            $.messager.alert("提示，", "请先连接社保卡读卡器！", "warning");
                            _input.val("");
                            return;
                        }

                        var cardNum=undefined,cardSerial=undefined;
                        function execRead(cardNumStr,cardSerialStr){
                            var cardNumJson = cardNumStr;//;
                            var cardSerialJson = cardSerialStr;//;
                            cardNum = _getJson(cardNumJson);
                            cardSerial = _getJson(cardSerialJson);
                            if (!cardNum) {
                                return false;
                            }
                            if (!cardSerial) {
                                return false;
                            }
                            if (cardNum.flag != 1 || !cardNum.result || cardNum.result == "") {
                                return false;
                            }
                            if (cardSerial.flag != 1 || !cardSerial.result || cardSerial.result == "") {
                               return false;
                            }
                            return true;
                        }

                        //读接触卡失败后，尝试读非接触M1卡
                        if(!execRead(jActiveX.GetCardNum(),jActiveX.GetCardSerialNum()) &&
                            !execRead(jActiveX.GetM1SBCardNum(), jActiveX.GetM1CardSN())){
                            $.messager.alert("提示", "读取社保（市民）卡号失败。", "warning");
                            return;
                        }

                        //设置卡号和序列号
                        _input.val(cardNum.result);
                        if (_input.siblings("input[type=hidden]")[0]) {
                            $(_input.siblings("input[type=hidden]")[0]).val(cardSerial.result);
                        }
                    }
                    else {
                        $.messager.alert("提示", "暂不提供此功能！", "error");
                        return;
                    }
                }
                catch (e) {
                    _input.val("");
                    $.messager.alert("提示", "加载读卡控件不成功，请正确下载安装读卡控件。如果已经正确安装，请确保是否已经刷新页面！", "error");
                    return;
                }
            }
            else if (_cachedData.options.identityCard) {
                //检查是否已经安装读卡控件
                var persionIdJson = "";
                try {
                    //检查是是否插入读卡器
                    if (!jActiveX.isReaderCard()) {
                        //alert("请先连接读卡器！");
                        $.messager.alert("提示", "请先连接身份证读卡器！", "warning");
                        _input.val("");
                        return;
                    }

                    //检查是是否插入卡
                    if (!jActiveX.isHasCard()) {
                        $.messager.alert("提示", "请放置身份证！", "warning");
                        _input.val("");
                        return;
                    }
                    //已插入读卡器和卡
                    persionIdJson = jActiveX.getPersonIdNum();
                    if(typeof persionIdJson=='undefined'|| $.trim(persionIdJson)==""){
                        $.messager.alert("提示", "读取身份证号码信息失败！", "warning");
                        return;
                    }
                    var persionId = _getJson(persionIdJson);
                    if (!persionId) {
                        $.messager.alert("提示", "读取身份证号码信息失败！", "warning");
                        return;
                    }
                    if (persionId.flag != 1 || !persionId.result || persionId.result == "") {
                        $.messager.alert("提示", "读取身份证号码信息失败：" + persionId.message || "", "warning");
                        return;
                    }
                    _input.val(persionId.result);
                    _cachedData.options.onAfterReadCard.call(_elem,jActiveX,_input);
                }
                catch (e) {
                    _input.val("");
                    $.messager.alert("提示", "加载读卡控件不成功，请正确下载安装读卡控件。如果已经正确安装，请确保是否已经刷新页面！", "warning");
                    return;
                }
            }
        });
    };
    function _getJson(_jsonStr) {
        return JSON.parse(_jsonStr);
    }

    function _onComplete(_elem) {
        var _cachedData = $.data(_elem, "smartreader");
        if (_cachedData.options.autoRead) {
            _cachedData.dc.reader.click();
        }
        _cachedData.options.onComplete.call(_elem, _cachedData.dc.reader, _cachedData.dc.readerInput);
    };
    $.fn.smartreader = function (method, options) {
        if (typeof method == "string") {
            return $.fn.smartreader.methods[method](this, options);
        }
        var opts = $.extend({}, $.fn.smartreader.defaults, method);
        return this.each(function () {
            var $this = $(this);
            var _lextendOpts = $.metadata ? $.extend({}, opts, $this.data()) : opts;

            $.data(this, "smartreader", {
                options: _lextendOpts
            });
            var _dc = _init(this);
            $.extend(true, $.data(this, "smartreader"), {dc: _dc});

            _bindEvent(this);
            _onComplete(this);
        });
    };
    $.fn.smartreader.methods = {

    };
    $.fn.smartreader.defaults = {
        identityCard: false,//身份证标志位
        citizenCard: false, //市民卡标志位
        activeXObj: undefined, //控件ID
        readerTitle: undefined, //控件标题
        readerCls: undefined,    //控件样式
        autoRead: false,              //auto read card on page load complete
        onComplete: function (reader, _input) {
        },
        onAfterReadCard:function(reader, _input){

        }
    }
})(jQuery);
