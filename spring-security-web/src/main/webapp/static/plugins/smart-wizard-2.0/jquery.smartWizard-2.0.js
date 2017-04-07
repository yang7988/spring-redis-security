/*
 * SmartWizard 2.0 plugin
 * jQuery Wizard control Plugin
 * by Dipu 
 * 
 * http://www.techlaboratory.net 
 * http://tech-laboratory.blogspot.com
 */

(function ($) {
    $.fn.smartWizard = function (method, action) {
        if (typeof method == "string") {
            return $.fn.smartWizard.methods[method](this, action);
        }
        var options = $.extend({}, $.fn.smartWizard.defaults, method);
        var args = arguments;

        return this.each(function () {
                var obj = $(this);
                var curStepIdx = options.selected;
                var steps = $("ul > li > a[href^='#step-']", obj); // Get all anchors in this array
                var contentWidth = 0;
                var loader, msgBox, elmAnchor, elmActionBar, elmSeparator, elmStepContainer, btFakeNext, btRealNext, btPrevious, btFinish;

                elmActionBar = $('.actionBar', obj);
                if (elmActionBar.length == 0) {
                    elmActionBar = $('<div></div>').addClass("actionBar");
                }

                elmSeparator = $('.horizontal-separator', obj);
                if (elmSeparator.length == 0 && options.showAnchor) {
                    elmSeparator = $('<div></div>').addClass("horizontal-separator");
                }

                msgBox = $('.msgBox', obj);
                if (msgBox.length == 0) {
                    msgBox = $('<div class="msgBox"><div class="content"></div><a href="#" class="close">X</a></div>');
                    elmActionBar.append(msgBox);
                }

                $('.close', msgBox).click(function () {
                    msgBox.fadeOut("normal");
                    return false;
                });


                // Method calling logic
                if (!method || method === 'init' || typeof method === 'object') {
                    _init();
                } else if (method === 'showMessage') {
                    //showMessage(Array.prototype.slice.call( args, 1 ));
                    var ar = Array.prototype.slice.call(args, 1);
                    showMessage(ar[0]);
                    return true;
                } else if (method === 'setError') {
                    var ar = Array.prototype.slice.call(args, 1);
                    setError(ar[0].stepnum, ar[0].iserror);
                    return true;
                } else {
                    $.error('Method ' + method + ' does not exist');
                }

                function _init() {
                    var allDivs = obj.children('div'); //$("div", obj);
                    elmAnchor = obj.children('ul').addClass("anchor");
                    allDivs.addClass("content").addClass("autoheight");
                    // Create Elements
                    loader = $('<div>Loading</div>').addClass("loader");
                    elmActionBar = $('<div></div>').addClass("actionBar");
                    elmStepContainer = $('<div></div>').addClass("stepContainer");
                    btFakeNext = _getButton(options.labelNext, options.btNextCssClass, "button-next");
                    btRealNext = _getButton(options.labelNext, options.btNextCssClass, "", true);
                    btPrevious = _getButton(options.labelPrevious, options.btPreviousCssClass, "button-previous");
                    btFinish = _getButton(options.labelFinish, options.btFinishCssClass, "button-finish");

                    // highlight steps with errors
                    if (options.errorSteps && options.errorSteps.length > 0) {
                        $.each(options.errorSteps, function (i, n) {
                            setError(n, true);
                        });
                    }


                    elmStepContainer.append(allDivs);
                    elmActionBar.append(loader);
                    if (options.showAnchor) {
                        elmSeparator = $('<div></div>').addClass("horizontal-separator");
                        obj.append(elmSeparator);
                    }
                    obj.append(elmStepContainer);
                    elmStepContainer.append(elmActionBar);
                    if (options.includeFinishButton) {
                        elmActionBar.append(btFinish);
                    }
                    elmActionBar.append(btPrevious).append(btFakeNext).append(btRealNext);
                    contentWidth = elmStepContainer.width();
                    _adjustContentHeight();
                    $(btFakeNext).click(function () {
                        if ($(this).hasClass('buttonDisabled')) {
                            return false;
                        }
                        if ($.isFunction(options.onBeforeNext)) {
                            var curStep = steps.eq(curStepIdx);
                            if (!options.onBeforeNext.call(this, curStep)) {
                                return false;
                            }
                        }
                        return false;
                    });
                    $(btRealNext).click(function () {
                        if ($(this).hasClass('buttonDisabled')) {
                            return false;
                        }
                        _doForwardProgress();
                        return false;
                    });
                    $(btPrevious).click(function () {
                        if ($(this).hasClass('buttonDisabled')) {
                            return false;
                        }
                        _doBackwardProgress();
                        return false;
                    });
                    $(btFinish).click(function () {
                        if (!$(this).hasClass('buttonDisabled')) {
                            if ($.isFunction(options.onFinish)) {
                                if (!options.onFinish.call(this, $(steps))) {
                                    return false;
                                }
                            } else {
                                var frm = obj.parents('form');
                                if (frm && frm.length) {
                                    frm.submit();
                                }
                            }
                        }

                        return false;
                    });

                    $(steps).bind("click", function (e) {
//                        if (steps.index(this) == curStepIdx) {
//                            return false;
//                        }
//                        var nextStepIdx = steps.index(this);
//                        var isDone = steps.eq(nextStepIdx).attr("isDone") - 0;
//                        if (isDone == 1) {
//                            _LoadContent(nextStepIdx);
//                        }
                        return false;
                    });
                    $(window).bind("resize", function () {
                        _adjustContentHeight();
                    });
                    // Enable keyboard navigation
                    if (options.keyNavigation) {
                        $(document).keyup(function (e) {
                            if (e.which == 39) { // Right Arrow
                                _doForwardProgress();
                            } else if (e.which == 37) { // Left Arrow
                                _doBackwardProgress();
                            }
                        });
                    }
                    if (!options.showNavigation) {
                        elmAnchor.hide();
                    }


                    $.data(obj[0], "smartWizard", {
                        anchor: elmAnchor,
                        actionBar: elmActionBar,
                        stepContainer: elmStepContainer,
                        fakeNext: btFakeNext,
                        realNext: btRealNext,
                        previous: btPrevious
                    });
                    //  Prepare the steps
                    _prepareSteps();
                    // Show the first slected step
                    _LoadContent(curStepIdx);
                    _rebuildStepButtons(curStepIdx);
                    options.onLoadComplete.call();
                }

                function _getButton(innerText, innerCssClass, outerCssClass, hidden, customizeBtn, id) {
                    var _btWrapper, btTemp;
                    if (!customizeBtn) {
                        btTemp = $('<a class="easyui-linkbutton l-btn"><span class="l-btn-left"></span></a>').attr("href", "#").addClass(outerCssClass);
                        var btWrapperInner = $(".l-btn-left", btTemp);
                        var btInner = $('<span class="l-btn-text" style="padding-left: 20px;">' + innerText + '</span>').addClass(innerCssClass);
                        btWrapperInner.append(btInner);
                    }
                    else {
                        btTemp = $('<a class="c-l-btn"></a>').html(innerText).addClass(outerCssClass);
                    }

                    //20140528按钮居右
                    if ("button-next" == outerCssClass) {
                        btTemp.addClass("right_icon");
                    }

                    _btWrapper = $("<div></div>").append(btTemp).addClass("buttonWrapper");
                    if (id) {
                        _btWrapper.attr("id", id);
                    }
                    if (hidden) {
                        _btWrapper.css("display", "none");
                    }

                    return _btWrapper;
                }

                function _prepareSteps() {
                    if (!options.enableAllSteps) {
                        if (options.showAnchor) {
                            $(steps, obj).removeClass("selected").removeClass("done").addClass("disabled");
                        }
                        $(steps, obj).attr("isDone", 0);
                    } else {
                        if (options.showAnchor) {
                            $(steps, obj).removeClass("selected").removeClass("disabled").addClass("done");
                        }
                        $(steps, obj).attr("isDone", 1);
                    }

                    $(steps, obj).each(function (i) {
                        if (options.showAnchor) {
                            if (i === 0) {
                                _initFirstStep($(this));
                            } else if (i === steps.length - 1) {
                                _initLastStep($(this));
                            }
                        }
                        $($(this).attr("href"), obj).hide();
                        $(this).attr("rel", i + 1);
                    });
                }

                function _rebuildStepButtons(_stepIndex) {

                    var _data = $.data(obj[0], "smartWizard");
                    if (options.stepsButton && options.stepsButton[_stepIndex]) {
                        elmActionBar.empty();
                        if (options.stepsButton[_stepIndex].previous) {
                            btPrevious = _getButton(
                                    options.stepsButton[_stepIndex].previous.labelText || "上一步",
                                    options.stepsButton[_stepIndex].previous.btCssClass || "icon-pre",
                                    options.stepsButton[_stepIndex].previous.btOuterCssClass || "button-previous",
                                false,
                                options.stepsButton[_stepIndex].previous.customizeBtn,
                                options.stepsButton[_stepIndex].previous.id
                            );
                            elmActionBar.append(btPrevious);

                            $(btPrevious).click(function () {
                                if ($(this).hasClass('buttonDisabled')) {
                                    return false;
                                }
                                _doBackwardProgress();
                                return false;
                            });
                            _data.previous = btPrevious;
                        }
                        if (options.stepsButton[_stepIndex].next) {
                            btFakeNext = _getButton(
                                    options.stepsButton[_stepIndex].next.labelText || "下一步",
                                    options.stepsButton[_stepIndex].next.btCssClass || "icon-next",
                                    options.stepsButton[_stepIndex].next.btOuterCssClass || "button-next", false,
                                options.stepsButton[_stepIndex].next.customizeBtn);
                            btRealNext = _getButton(
                                options.stepsButton[_stepIndex].next.labelText,
                                options.stepsButton[_stepIndex].next.btCssClass,
                                "",
                                true,
                                options.stepsButton[_stepIndex].next.id);
                            elmActionBar.append(btFakeNext).append(btRealNext);
                            $(btFakeNext).click(function () {
                                if ($(this).hasClass('buttonDisabled')) {
                                    return false;
                                }
                                if ($.isFunction(options.onBeforeNext)) {
                                    var curStep = steps.eq(curStepIdx);
                                    if (!options.onBeforeNext.call(this, curStep)) {
                                        return false;
                                    }
                                }
                                return false;
                            });
                            $(btRealNext).click(function () {
                                if ($(this).hasClass('buttonDisabled')) {
                                    return false;
                                }
                                _doForwardProgress();
                                return false;
                            });


                            _data.realNext = btRealNext;
                            _data.fakeNext = btFakeNext;
                        }

                        if (options.includeFinishButton && options.stepsButton[_stepIndex].finish) {
                            btFinish = _getButton(
                                    options.stepsButton[_stepIndex].finish.labelText || "提交",
                                    options.stepsButton[_stepIndex].finish.btCssClass || "icon-ok",
                                    options.stepsButton[_stepIndex].finish.btOuterCssClass || "button-finish");
                            elmActionBar.append(btFinish);
                            $(btFinish).click(function () {
                                if (!$(this).hasClass('buttonDisabled')) {
                                    if ($.isFunction(options.onFinish)) {
                                        if (!options.onFinish.call(this, $(steps))) {
                                            return false;
                                        }
                                    } else {
                                        var frm = obj.parents('form');
                                        if (frm && frm.length) {
                                            frm.submit();
                                        }
                                    }
                                }

                                return false;
                            });
                        }
                    }

                }

                function _initFirstStep(obj) {
                    if (options.firstStepHoverCssClass) {
                        obj.addClass(options.firstStepHoverCssClass);
                    }
                }

                function _initLastStep(obj) {
                    if (options.lastStepCssClass) {
                        obj.addClass(options.lastStepDisabledCssClass);
                    }
                }

                function _LoadContent(stepIdx) {
                    var selStep = steps.eq(stepIdx);
                    var ajaxurl = options.contentURL;
                    var hasContent = selStep.data('hasContent');
                    elmActionBar.hide();
                    stepNum = stepIdx + 1;
                    if (ajaxurl && ajaxurl.length > 0) {
                        if (options.contentCache && hasContent) {
                            _showStep(stepIdx);
                        } else {
                            $.ajax({
                                url: ajaxurl,
                                type: "POST",
                                data: ({step_number: stepNum}),
                                dataType: "text",
                                beforeSend: function () {
                                    loader.show();
                                },
                                error: function () {
                                    loader.hide();
                                },
                                success: function (res) {
                                    loader.hide();
                                    if (res && res.length > 0) {
                                        selStep.data('hasContent', true);
                                        $($(selStep, obj).attr("href"), obj).html(res);
                                        _showStep(stepIdx);
                                    }
                                }
                            });
                        }
                    } else {
                        _showStep(stepIdx);
                    }
                }

                function _showStep(stepIdx) {
                    var selStep = steps.eq(stepIdx);
                    var curStep = steps.eq(curStepIdx);
                    curStep.attr('sel', stepIdx);
                    if (stepIdx != curStepIdx) {
                        if ($.isFunction(options.onLeaveStep)) {
                            if (!options.onLeaveStep.call(this, $(curStep))) {
                                elmActionBar.show();
                                return false;
                            }
                        }
                    }
                    if (options.updateHeight)
                        _adjustContentHeight();
                    //elmStepContainer.height($($(selStep, obj).attr("href"), obj).outerHeight() + elmActionBar.outerHeight());
                    if (options.transitionEffect == 'slide') {
                        $($(curStep, obj).attr("href"), obj).slideUp("fast", function (e) {
                            $($(selStep, obj).attr("href"), obj).slideDown("fast");
                            curStepIdx = stepIdx;
                            _SetupStep(curStep, selStep);
                        });
                    } else if (options.transitionEffect == 'fade') {
                        $($(curStep, obj).attr("href"), obj).fadeOut("fast", function (e) {
                            $($(selStep, obj).attr("href"), obj).fadeIn("fast");
                            curStepIdx = stepIdx;
                            _SetupStep(curStep, selStep);
                        });
                    } else if (options.transitionEffect == 'slideleft') {
                        var nextElmLeft = 0;
                        var curElementLeft = 0;
                        if (stepIdx > curStepIdx) {
                            nextElmLeft1 = contentWidth + 10;
                            nextElmLeft2 = 0;
                            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                        } else {
                            nextElmLeft1 = 0 - $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                            nextElmLeft2 = 0;
                            curElementLeft = 10 + $($(curStep, obj).attr("href"), obj).outerWidth();
                        }
                        if (stepIdx == curStepIdx) {
                            nextElmLeft1 = $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                            nextElmLeft2 = 0;
                            curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                        } else {
                            $($(curStep, obj).attr("href"), obj).animate({left: curElementLeft}, "fast", function (e) {
                                $($(curStep, obj).attr("href"), obj).hide();
                            });
                        }

                        $($(selStep, obj).attr("href"), obj).css("left", nextElmLeft1);
                        $($(selStep, obj).attr("href"), obj).show();
                        $($(selStep, obj).attr("href"), obj).animate({left: nextElmLeft2}, "fast", function (e) {
                            curStepIdx = stepIdx;
                            _SetupStep(curStep, selStep);
                        });
                    } else {
                        $($(curStep, obj).attr("href"), obj).hide();
                        $($(selStep, obj).attr("href"), obj).show();
                        curStepIdx = stepIdx;
                        _SetupStep(curStep, selStep);
                    }
                    if ($(selStep, obj).attr("showPrev") == "true") {
                        $(btPrevious, elmActionBar).show();
                    }
                    else {
                        $(btPrevious, elmActionBar).hide();
                    }
                    return true;
                }

                /**
                 *  modified by liyue
                 *  增加了第一步和最后一步的控制
                 * @param curStep
                 * @param selStep
                 * @returns {boolean}
                 * @private
                 */
                function _SetupStep(curStep, selStep) {
                    $(curStep, obj).removeClass("selected");
                    $(curStep, obj).addClass("done");

                    $(selStep, obj).removeClass("disabled");
                    $(selStep, obj).removeClass("done");
                    $(selStep, obj).addClass("selected");
                    $(selStep, obj).attr("isDone", 1);
                    _adjustButton();
                    adjustActionBarStyle($(selStep).attr("actionbar-style"), $(selStep).attr("actionbar-width"));
                    _adjustContentBodyHeight(selStep, $(selStep).attr("contentAutoHeight"));
                    //如果当前步骤大于1，则处理当前步骤
                    if (parseInt($(selStep).attr("rel")) > 1) {
                        _adjustCurStepCSS($(curStep), $(selStep));
                    }
                    if ($.isFunction(options.onShowStep)) {
                        if (!options.onShowStep.call(this, $(selStep))) {
                            return false;
                        }
                    }
                }

                function _doForwardProgress() {
                    var nextStepIdx = curStepIdx + 1;
                    if (steps.length <= nextStepIdx) {
                        if (!options.cycleSteps) {
                            return false;
                        }
                        nextStepIdx = 0;
                    }
                    _LoadContent(nextStepIdx);
                    _rebuildStepButtons(nextStepIdx);
                }

                function _doBackwardProgress() {
                    var nextStepIdx = curStepIdx - 1;
                    if (0 > nextStepIdx) {
                        if (!options.cycleSteps) {
                            return false;
                        }
                        nextStepIdx = steps.length - 1;
                    }
                    _LoadContent(nextStepIdx);
                    _rebuildStepButtons(nextStepIdx);
                }

                function _adjustButton() {
                    if (!options.cycleSteps) {
                        if (0 >= curStepIdx) {
                            $(btPrevious).addClass("buttonDisabled");
                        } else {
                            $(btPrevious).removeClass("buttonDisabled");
                        }
                        if ((steps.length - 1) <= curStepIdx) {
                            //$(btNext).addClass("buttonDisabled");
                            //最后一步时，把下一步按钮干掉
                            $(btFakeNext).hide();
                        } else {
                            $(btFakeNext).removeClass("buttonDisabled");
                        }
                    }
                    // Finish Button
                    if (!steps.hasClass('disabled') || options.enableFinishButton) {
                        $(btFinish).removeClass("buttonDisabled");
                    } else {
                        $(btFinish).addClass("buttonDisabled");
                    }

                    //在最后一步开始前，干掉确定按钮
                    if ((steps.length - 1) > curStepIdx) {
                        $(btFinish).hide();
                    }
                    else {
                        $(btFinish).show();
                    }
                }

                function showMessage(msg) {
                    $('.content', msgBox).html(msg);
                    msgBox.show();
                }

                function setError(stepnum, iserror) {
                    if (iserror) {
                        $(steps.eq(stepnum - 1), obj).addClass('error')
                    } else {
                        $(steps.eq(stepnum - 1), obj).removeClass("error");
                    }
                }

                /**
                 *  @author liyue
                 * 调整步骤内容的高度
                 * @private
                 */
                function _adjustContentHeight() {
                    var updatedHeight, elmBodyHeight, elmAnchorHeight, elmActionBarHeight = 0;
                    var elmContentPadding = 0;
                    //如果定义了高度差，则减去差值
                    if (options.heightDifference) {
                        elmContentPadding = options.heightDifference;
                    }
                    elmBodyHeight = $("body").outerHeight();

                    if (elmAnchor.length == 0) {
                        elmAnchorHeight = 0;
                    }
                    else {
                        elmAnchorHeight = elmAnchor.outerHeight();
                    }
                    if (elmActionBar.length == 0) {
                        elmActionBarHeight = 0;
                    }
                    else {
                        elmActionBarHeight = elmActionBar.outerHeight();
                    }
                    updatedHeight = elmBodyHeight - elmAnchorHeight - elmContentPadding;
                    updatedHeight = updatedHeight <= 0 ? 300 : updatedHeight;
                    $('.autoheight', elmStepContainer).each(function () {
                        //$(this).height(updatedHeight);
                        $(this).css({"height": "auto"});
                    });
                    if (options.stepContainerHeight) {
                        elmStepContainer.css("height", options.stepContainerHeight);
                    }
                    else {
                        elmStepContainer.height(updatedHeight);
                    }
                }

                function adjustActionBarStyle(extraStyle, extraWidth) {
                    if (extraStyle != '') {
//                        var cssAttrArray = extraStyle.split(";");
//                        for (var i = 0; i < cssAttrArray.length; i++) {
//                            var oneCss = cssAttrArray[i].split(":");
//                            var attrKey = oneCss[0];
//                            var attrValue = oneCss[1];
//                            elmActionBar.css({attrKey: attrValue});
//                        }
                        elmActionBar.attr("style", extraStyle);
                    }

                    if (extraWidth && extraWidth === "auto") {
                        elmActionBar.width(elmStepContainer.width());
                    }
                    //最后一步如果不显示结束按钮则不显示

                    if (curStepIdx < steps.length - 1 || (curStepIdx === steps.length - 1 && options.includeFinishButton)) {
                        elmActionBar.show();
                    }
                }

                function _adjustContentBodyHeight(_selStep, _autoHeight) {
                    if (_autoHeight == "false") {
                        $($(_selStep, obj).attr("href"), obj).removeClass("autoheight");
                        $($(_selStep, obj).attr("href"), obj).height("100%");
                    }
                }

                /**
                 * 点击下一步时，设置第一步的样式
                 * @param step
                 */
                function _adjustCurStepCSS(step, selStep) {
                    //如果上一步是第一步，则特殊处理第一步的样式(背景图)
                    if (step.attr("rel") === "1" && options.firstStepCssClass) {
                        step.removeClass("firststep-selected");
                        step.addClass(options.firstStepCssClass);
                    }
                    //如果当前步骤是最后一步，则特殊处理最后一步的样式(背景图)
                    if (selStep.attr("rel") == steps.length && options.lastStepHoverCssClass) {
                        selStep.removeClass("laststep-disabled");
                        selStep.addClass(options.lastStepHoverCssClass);
                    }
                    //如果当前选择的是第一步
                    if (selStep.attr("rel") == 1 && options.firstStepHoverCssClass) {
                        selStep.removeClass(options.firstStepCssClass);
                        selStep.addClass(options.firstStepHoverCssClass);
                    }
                }
            }
        );

    };
    function _onNextStep(_elem, _stepIndex) {
        var _actionBar = $.data(_elem, "smartWizard").actionBar;
        var _fakeNextButton = $.data(_elem, "smartWizard").fakeNext;
        _fakeNextButton.click();
    };
    function _doForward(_elem) {
        var _actionBar = $.data(_elem, "smartWizard").actionBar;
        var _realNextButton = $.data(_elem, "smartWizard").realNext;
        _realNextButton.click();
    };
    $.fn.smartWizard.methods = {
        nextStep: function (jq, _stepIndex) {
            return jq.each(function () {
                _onNextStep(this, _stepIndex);
            });
        },
        doForward: function (jq, _stepIndex) {
            return jq.each(function () {
                _doForward(this);
            });
        }
    };
// Default Properties and Events
    $.fn.smartWizard.defaults = {
        showNavigation: true,
        contentAutoHeight: true,
        selected: 0,  // Selected Step, 0 = first step,
        keyNavigation: false, // Enable/Disable key navigation(left and right keys are used if enabled)
        enableAllSteps: false,
        updateHeight: true,
        transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
        contentURL: null, // content url, Enables Ajax content loading
        contentCache: true, // cache step contents, if false content is fetched always from ajax url
        cycleSteps: false, // cycle step navigation
        includeFinishButton: true, // whether to show a Finish button
        enableFinishButton: false, // make finish button enabled always
        errorSteps: [],    // Array Steps with errors
        labelNext: 'Next',
        labelPrevious: 'Previous',
        labelFinish: 'Finish',
        onBeforeNext: null,//triggers when before click real next
        onLeaveStep: null, // triggers when leaving a step
        onShowStep: null,  // triggers when showing a step
        onFinish: null,  // triggers when Finish button is clicked
        btNextCssClass: "icon-next",
        btPreviousCssClass: "icon-previous",
        btFinishCssClass: "icon-ok",

        // Extends Properties
        heightDifference: 1,  //height difference for calculate content height

        firstStepCssClass: "firststep-done",
        firstStepHoverCssClass: "firststep-selected",
        lastStepCssClass: "laststep-done",
        lastStepHoverCssClass: "laststep-selected",
        lastStepDisabledCssClass: "laststep-disabled",
        stepsButton: undefined,
        showAnchor: true,
        onLoadComplete: function () {

        }
    };

})
(jQuery);
