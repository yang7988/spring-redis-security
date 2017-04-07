/**
 * validatebox方法扩展
 * coder by 小雪转中雪
 */
jQuery.extend(jQuery.fn.validatebox.methods, {
    removeTip: function(jq) {
        return jq.each(function() {
            var tip = $.data(this, "validatebox").tip;
            if(tip) {
                tip.remove();
                $.data(this, "validatebox").tip = null;
            }
        });
    },
    createTipToShow: function(jq) {
        return jq.each(function() {
            var message = $.data(this, "validatebox").message;
            var tip = $.data(this, "validatebox").tip;
            if(!tip) {
                tip = $("<div class=\"validatebox-tip\">" + "<span class=\"validatebox-tip-content\">" + "</span>" + "<span class=\"validatebox-tip-pointer\">" + "</span>" + "</div>").appendTo("body");
                $.data(this, "validatebox").tip = tip;
            }
            tip.find(".validatebox-tip-content").html(message);
            $(this).validatebox('showTip');
        });
    },
    showTip: function(jq) {
        return jq.each(function() {
            var data = $.data(this, "validatebox");
            if(!data) {
                return;
            }
            var tip = data.tip;
            if(tip) {
                var box = $(this);
                var pointer = tip.find(".validatebox-tip-pointer");
                var content = tip.find(".validatebox-tip-content");
                tip.show();
                tip.css("top", box.offset().top - (content._outerHeight() - box._outerHeight()) / 2);
                if(data.options.tipPosition == "left") {
                    tip.css("left", box.offset().left - tip._outerWidth());
                    tip.addClass("validatebox-tip-left");
                } else {
                    //alert($.data(this,'combo'));
                    if(box.hasClass('combo-text')) {
                        tip.css("left", box.offset().left + box._outerWidth() + 20);
                    } else {
                        tip.css("left", box.offset().left + box._outerWidth());
                    }
                    tip.removeClass("validatebox-tip-left");
                }
                pointer.css("top", (content._outerHeight() - pointer._outerHeight()) / 2);
            }
        });
    },
    /**
     * 设置验证的触发方式
     * @param {jQuery object} jq    jq对象
     * @param {number} param 触发方式 0为默认方式；1为失去焦点触发
     */
    setValidateTrigger: function(jq, param) {
        return jq.each(function() {
            var box = $(this);
            var validatebox = $.data(this, "validatebox");
            var that = this;
            switch(param) {
            case 0:
                //默认方式
                box.unbind(".validatebox").bind("focus.validatebox", function() {
                    validatebox.validating = true;
                    validatebox.value = undefined;
                    (function() {
                        if(validatebox.validating) {
                            if(validatebox.value != box.val()) {
                                validatebox.value = box.val();
                                if(validatebox.timer) {
                                    clearTimeout(validatebox.timer);
                                }
                                validatebox.timer = setTimeout(function() {
                                    $(that).validatebox("validate");
                                }, validatebox.options.delay);
                            } else {
                                $(that).validatebox('showTip');
                            }
                            setTimeout(arguments.callee, 200);
                        }
                    })();
                }).bind("blur.validatebox", function() {
                    if(validatebox.timer) {
                        clearTimeout(validatebox.timer);
                        validatebox.timer = undefined;
                    }
                    validatebox.validating = false;
                    $(that).validatebox('removeTip');
                }).bind("mouseenter.validatebox", function() {
                    if(box.hasClass("validatebox-invalid")) {
                        $(that).validatebox('createTipToShow');
                    }
                }).bind("mouseleave.validatebox", function() {
                    if(!validatebox.validating) {
                        $(that).validatebox('removeTip');
                    }
                });
                break;
            case 1:
                //blur时触发
                box.unbind(".validatebox").bind("focus.validatebox", function() {
                    validatebox.validating = false;
                    $(that).removeClass("validatebox-invalid");
                    $(that).validatebox('removeTip');
                }).bind("blur.validatebox", function() {
                    validatebox.validating = true;
                    if(validatebox.timer) {
                        clearTimeout(validatebox.timer);
                        validatebox.timer = undefined;
                    }
                    validatebox.timer = setTimeout(function() {
                        $(that).validatebox("validate");
                    }, validatebox.options.delay);
                }).bind("mouseenter.validatebox", function() {
                    if(box.hasClass("validatebox-invalid") && box.val()!="") { //
                        $(that).validatebox('createTipToShow');
                    }
                }).bind("mouseleave.validatebox", function() {
                    $(that).validatebox('removeTip');
                });
                break;
            default:
                break;
            }
        });
    }
});