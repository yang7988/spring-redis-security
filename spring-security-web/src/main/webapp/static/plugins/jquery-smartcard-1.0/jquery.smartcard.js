/**
 * @Author: liyue
 * @Date: 13-9-25
 * @Time: 下午3:43
 * for quickly generate cardInfo with template
 */
(function ($) {
    function _init(_elem, _opts) {
        var _cardsWrapper = $("<div class='lee-cards-wrapper'><div class='lee-cards-body'></div></div>");
        _cardsWrapper.insertBefore($(_elem));
        $(_elem).hide();
        return {
            cardsWrapper: _cardsWrapper,
            cardsBody: _cardsWrapper.children(".lee-cards-body")
        };
    };
    function _bindEvent(_elem) {
        var cachedData = $.data(_elem, "smartcard");
    }


    $.fn.smartcard = function (method, options) {
        if (typeof method == "string") {
            return $.fn.smartcard.methods[method](this, options);
        }
        var _opts = $.extend({}, $.fn.smartcard.defaults, method);
        return this.each(function () {
            var $this = $(this);
            _opts = $.metadata ? $.extend({}, opts, $this.data()) : _opts;

            var _dc = _init(this, _opts);
            _bindEvent(this);
            var _cards = undefined;
            $(this).data("smartcard", {
                options: _opts,
                dc: _dc,
                selectedCards: [],
                data: {
                    total: 0,
                    cards: _cards
                }
            });
        });
    };
    function _getSelected(_elem) {
        var _cachedData = $.data(_elem, "smartcard");
        if (!_cachedData) {
            return [];
        }
        return _cachedData.selectedCards || [];
    };
    function _generateCards(_elem, _data) {
        var _opts = $.data(_elem, "smartcard").options;
        //assign cards data
        $.data(_elem, "smartcard").data.cards = _data;
        $.data(_elem, "smartcard").data.total = _data.length;

        _opts.renderHelper.render(_elem, _data);
        _bindCardsBodyEvent(_elem);
        _opts.onAfterLoadData.call(_elem);
    };

    function _renderCards(_elem, _data) {
        var _opts = $.data(_elem, "smartcard").options;
        for (var _index = 0; _index < _data.length; _index++) {
            _opts.renderHelper.insert(_elem, _data[_index], _index, -1);
        }
    };
    function _renderToolbar(_elem, _card, _itemIndex, _item) {
        var _opts = $.data(_elem, "smartcard").options,
            _cardToolbarBody = $("<div class='lee-card-toolbar'></div>").insertBefore(_card),
            _checkboxBody = $("<div class='lee-card-checkbox-body'></div>").appendTo(_cardToolbarBody).prop("id", _opts.cardCheckboxBodyPrefix + "-" + _itemIndex).attr("cardindex", _itemIndex);
        if (_opts.showCheckbox) {
            var _checkboxId = _opts.cardCheckboxPrefix + "-" + _itemIndex;
            $("<label></label>").html("选择").appendTo(_checkboxBody);//.prop("for", _checkboxId)
            $("<input type='checkbox' value='1'/>").prop("id", _checkboxId).appendTo(_checkboxBody);
        }
        //render status text
        if (_item && typeof(_item.cardInfo) !== 'undefined'
            && typeof(_item.cardInfo.cardState) !== 'undefined'
            && !isNaN(_item.cardInfo.cardState)
            && !isNaN(parseInt(_item.cardInfo.cardState))) {
            var _cardStatusBody = $("<div class='lee-card-status-plain-body'></div>").appendTo(_cardToolbarBody),
                _cardStatusPlain = undefined;
            switch (parseInt(_item.cardInfo.cardState)) {
                case 0:
                    _cardStatusPlain = "正常";
                    break;
                case 1:
                    _cardStatusPlain = "书面挂失";
                    break;
                case 2:
                    _cardStatusPlain = "口头挂失";
                    break;
                case 3:
                    _cardStatusPlain = "注销";
                    break;
                case 4:
                    _cardStatusPlain = "换卡";
                    break;
                case 5:
                    _cardStatusPlain = "补卡";
                    break;
                case 6:
                    _cardStatusPlain = "待补换";
                    break;
                case -1:
                    _cardStatusPlain = "待领卡";
                    break;
                default :
                    _cardStatusPlain = "状态不明";
                    break;
            }
            if (_cardStatusPlain) {
                $("<div class='lee-card-status-plain-text'></div>").html("卡片状态：" + _cardStatusPlain).appendTo(_cardStatusBody);
            }
        }
    };
    function _renderCardStatus(_elem, _card, _itemIndex, _status) {
        var _opts = $.data(_elem, "smartcard").options;
        if (!isNaN(_status) && !isNaN(parseInt(_status))) {
            var _cardStatus = $("<div class='lee-card-status'></div>").appendTo(_card),
                _cardStatusBody = $("<div class='lee-card-status-body'></div>").appendTo(_cardStatus).prop("id", _opts.cardStatusBodyPrefix + "-" + _itemIndex).attr("cardindex", _itemIndex);

            var _statusIconCls = undefined;

            switch (parseInt(_status)) {
                case 0://正常使用
                    _statusIconCls = "lee-card-status-ok";
                    break;
                case 1://书面挂失
                    _statusIconCls = "lee-card-status-bl";
                    break;
                case 2://口头挂失
                    _statusIconCls = "lee-card-status-ml";
                    break;
                case 3://卡注销
                    _statusIconCls = "lee-card-status-cancel";
                    break;
                case 4://换卡
                    _statusIconCls = "lee-card-status-changecard";
                    break;
                case 5://补卡
                    _statusIconCls = "lee-card-status-replacementcard";
                    break;
                case 6://待补换
                    _statusIconCls = "lee-card-status-change-replace";
                    break;
                case -1://待领卡
                    _statusIconCls = "lee-card-status-get";
                    break;
                default :
                    _statusIconCls = "lee-card-status-warning";
                    break;
            }
            if (_statusIconCls) {
                $("<div class='lee-card-status-icon'></div>").addClass(_statusIconCls).appendTo(_cardStatusBody);
            }
        }


    };
    function _bindCardsBodyEvent(_elem) {
        var _cardsBody = $.data(_elem, "smartcard").dc.cardsBody;
        var _opts = $.data(_elem, "smartcard").options;

        //bind toolbar event
        _cardsBody.find(".lee-card-checkbox-body").each(function () {
            var $this = $(this),
                _cardIndex = $(this).attr("cardindex");
            $(this).bind("click", function (e) {
                if (!$(this).parent().parent().hasClass("lee-card-selected")) {

                    if (_opts.showCheckbox) {
                        $(this).find("input[type=checkbox]").prop("checked", true);
                    }
                    _onSelect(_elem, _cardIndex, false, e);
                }
                //cancel select
                else {
                    if (_opts.showCheckbox) {
                        $(this).find("input[type=checkbox]").prop("checked", false);
                    }
                    _onUnselect(_elem, _cardIndex, false, e);
                }
                e.stopPropagation();
            });
            if (_opts.showCheckbox) {
                //bind event
                $(this).find("input[type=checkbox]").bind("click", function (e) {
                    $this.click();
                    //select
                    // if (this.checked) {
                    // _onSelect(_elem, _cardIndex, false, e);
                    // }
                    // //cancel select
                    // else
                    // {
                    // _onUnselect(_elem, _cardIndex, false, e);
                    // }
                    e.stopPropagation();
                });
            }
        });
    };
    function _onSelect(_elem, _cardIndex, _flag, _event) {
        var _data = $.data(_elem, "smartcard").data,
            _opts = $.data(_elem, "smartcard").options,
            _selectedRows = $.data(_elem, "smartcard").selectedCards,
            _cardBody = _opts.finder.getCardBody(_elem, _cardIndex);

        if (!_cardBody.hasClass("lee-card-selected")) {
            _cardBody.addClass("lee-card-selected");
        }
        _selectedRows.push(_data.cards[_cardIndex]);
        _opts.onSelect.call(_elem, _cardIndex, _data.cards[_cardIndex], event);
    };

    function _onUnselect(_elem, _cardIndex, _flag, _event) {
        var _data = $.data(_elem, "smartcard").data,
            _opts = $.data(_elem, "smartcard").options,
            _cardBody = _opts.finder.getCardBody(_elem, _cardIndex);

        if (_cardBody.hasClass("lee-card-selected")) {
            _cardBody.removeClass("lee-card-selected");
        }
        _resetSelectedRows(_elem);
        _opts.onUnSelect.call(_elem, _cardIndex, _data.cards[_cardIndex], event);
    };

    function _resetSelectedRows(_elem) {
        var _data = $.data(_elem, "smartcard").data,
            _cardsBody = $.data(_elem, "smartcard").dc.cardsBody;
        $.data(_elem, "smartcard").selectedCards = [];
        _cardsBody.children(".lee-card-body").each(function () {
            var $this = $(this), _cardIndex = $this.attr("cardindex");
            if ($this.hasClass("lee-card-selected")) {
                $.data(_elem, "smartcard").selectedCards.push(_data.cards[_cardIndex]);
            }
        });
    };


    function _insert(_elem, _item, _itemIndex, _posIndex) {
        var _cachedData = $.data(_elem, "smartcard"),
            _cardsBody = _cachedData.dc.cardsBody,
            _opts = _cachedData.options;
        //select card's items position info
        var _cardPosition = undefined, _cardStyle = _opts.cardStyleDefine;
        if (_item.cardType && _opts.cardInfoPositionDefine) {
            _cardPosition = _opts.cardInfoPositionDefine[_item.cardCls];
        }//end select card's items position info
        function _addInfo(_info) {
            var _infoBody = $("<span class='leecard-info'></span>").html(_info.fieldValue || "");
            if(_info.fieldName=="head"){
                _infoBody.append("<img class='card-head'/>")
            }
            //handle position
            if (_cardPosition && _info.fieldName && _cardPosition[_info.fieldName]) {
                for (var _attr in _cardPosition[_info.fieldName]) {

                    _infoBody.css(_attr, _cardPosition[_info.fieldName][_attr]);
                }
            } else if (_info.posX && _info.posY) {
                _infoBody.css("left", _info.posX);
                _infoBody.css("top", _info.posY);
            } else if (_info.style) {
                //handle stylesheet
                for (var _attr in _info.style) {
                    _infoBody.css(_attr, _info.style[_attr]);
                }
            }
            //如果没有定义样式，直接返回
            else {
                return undefined;
            }
            //handle style class
            if (_info.cls) {
                _infoBody.addClass(_info.cls);
            }
            if (_cardStyle && _cardStyle[_info.fieldName]) {
                _infoBody.addClass(_cardStyle[_info.fieldName].cls || "");
            }
            if (_info.imageUrl) {
                var _background = [];
                _background.push("url(");
                _background.push(_info.imageUrl);
                _background.push(")");
                _infoBody.css("background-image", _background.join("")).html("");
            }
            return _infoBody;
        };
        if (_posIndex == -1) {
            var _cardBackground = [],
            // _card = $("<div class='lee-card-body'><div class='lee-card'></div></div>")
            // .appendTo(_cardsBody).children(".card");
                _card = $("<div class='lee-card'></div>").appendTo(_cardsBody).wrap($("<div class='lee-card-body'></div>").prop("id", _opts.cardBodyPrefix + "-" + _itemIndex)).prop("id", _opts.cardPrefix + "-" + _itemIndex);
            //处理背景图片
            if (_item.cardBackground) {
                _cardBackground.push("url(");
                _cardBackground.push(_item.cardBackground);
                _cardBackground.push(")");
                _card.css("background-image", _cardBackground.join(""))
            }
            //add card class
            if (_item.cardCls) {
                _card.addClass(_item.cardCls);
            }
            if (_cardStyle && _cardStyle[_item.cardCls]) {
                _card.addClass(_cardStyle[_item.cardCls].cls || "");
            }//end add card class

            //handle position info
            var _baseInfo = _item.baseInfo;
            if (_baseInfo) {
                for (var _index = 0; _index < _baseInfo.length; _index++) {
                    var _info = _baseInfo[_index];
                    var _infoBody = _addInfo(_info);
                    if (_infoBody) {
                        _infoBody.appendTo(_card);
                    }
                }
            }
            //handle card toolbar
            if (_opts.showCardStatus) {
                _renderToolbar(_elem, _card, _itemIndex, _item);
            }
            else {
                _renderToolbar(_elem, _card, _itemIndex);
            }
            //handle card status
            if (_opts.showCardStatusIcon && typeof(_item.cardInfo) !== 'undefined' && typeof(_item.cardInfo.cardState) !== 'undefined') {
                _renderCardStatus(_elem, _card, _itemIndex, _item.cardInfo.cardState)
            }
            //handle callback
            if(_opts.onAfterInsert){
                _opts.onAfterInsert.call(_elem,_card,_item.cardInfo);
            }
        }
    };
    var renderControl = {
        render: function (_elem, _data) {
            var _cachedData = $.data(_elem, "smartcard");
            _renderCards.call(this, _elem, _data);
        },
        insert: function (_elem, _item, _index, _posIndex) {
            _insert.call(this, _elem, _item, _index, _posIndex);
        },
        onBeforeRender: function (_elem, _data) {
        },
        onAfterRender: function (_elem) {
        }
    };

    $.fn.smartcard.methods = {
        options: function (jq) {
            return $.data(jq[0], "smartcard").options;
        },
        loadData: function (_jq, _data) {
            return _jq.each(function () {
                var _opts = $(this).smartcard("options");
                _generateCards(this, _data);
            });
        },
        getSelected: function (_jq) {
            var rows = _getSelected(_jq[0]);
            return rows.length > 0 ? rows : undefined;
        },
        count: function (jq) {
            return $.data(jq[0], "smartcard").data.total;
        },
        getCards: function (jq) {
            return $.data(jq[0], "smartcard").data.cards;
        }
    };
    $.fn.smartcard.defaults = {
        renderHelper: renderControl,
        cardPrefix: "lee-card",
        cardBodyPrefix: "lee-card-body",
        cardCheckboxPrefix: "lee-card-cbx",
        cardCheckboxBodyPrefix: "lee-card-cbx-body",
        cardStatusPrefix: "lee-card-status",
        cardStatusBodyPrefix: "lee-card-status-body",
        cardInfoPositionDefine: undefined,                           //卡片信息位置定义
        cardStyleDefine: undefined,                                      //卡片样式定义
        showCardStatus: true,//显示卡片状态
        showCardStatusIcon: false,//显示卡片状态
        showCheckbox: false, //  显示选择框
        finder: {
            getCardBody: function (_elem, _index) {
                var _opts = $.data(_elem, "smartcard").options;
                var _obj = $("#" + _opts.cardBodyPrefix + "-" + _index);
                if (_obj.length == 0) {
                    _obj = undefined;
                }
                return _obj;
            }
        },
        onSelect: function (_index, _card, e) {

        },
        onUnSelect: function (_index, _card, e) {

        } ,
        onAfterLoadData:function(){

        },
        onAfterInsert:function(){

        }
    }
})(jQuery);
