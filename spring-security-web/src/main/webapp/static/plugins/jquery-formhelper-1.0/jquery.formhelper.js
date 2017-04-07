/**
 * author: liyue
 * Date: 13-9-12
 * Time: 上午9:46
 *  表单帮助类，可以通过配置生成业务单据
 *  通过数据分析生成一个form表单容器，表单的ID为"form-步骤id"
 *  example
 *  var rows=[ {
            columns: [
                {
                    colspan: 3,
                    showLabel: true,
                    labelText: "联系地址：",
                    labelCls: "textarea-label",
                    labelStyle:"",
                    controlType: "textarea",
                    controlID: "address_temp",
                    controlCls: "input easyui-validatebox",
                    controlStyle: "width:660px;height:50px;",
                    defaultValue: "",
                    dataOptions:"",
                    validType: "text[1,256]",  //for easy ui
                    required:true,                 //for easy ui and for add *
                    formatter:formatBank,    //for easy ui
                    editable:false,                 //for easy ui
                    panelWidth:147,             //for easy ui
                    panelHeight:100             //for easy ui
                }
            ]
        } ]
 */
(function ($) {
    function _init(_elem, _opts) {
        $(_elem).empty();
        if (_opts.extraStyle) {
            $(_elem).attr("style", _opts.extraStyle);
        }
        var _formbody = $("<form action='' onsubmit='return false'><table cellpadding='0' cellspacing='0'></table></form>").attr("id", "form-" + $(_elem).attr("id")).wrapInner("<div></div>")
            .appendTo(_elem);
        if (_opts.formContentTableOuterCls) {
            _formbody.children("div").addClass(_opts.formContentTableOuterCls);
        }
        if (_opts.formContentTableCls) {
            _formbody.children("div").children("table").addClass(_opts.formContentTableCls);
        }
        return {
            formBody: _formbody
        }
    };

    function _bindEvent(_elem) {
    };

    function _renderRows(_elem, _data) {
        var _dc = $.data(_elem, "formhelper").dc;
        var _opts = $.data(_elem, "formhelper").options;
        var _table = _dc.formBody.find("table");
        for (var _rowIndex = 0; _rowIndex < _data.length; _rowIndex++) {
            var _row = _data[_rowIndex];
            var _tr = $("<tr></tr>").appendTo(_table);
            for (var _columnIndex = 0; _columnIndex < _row.columns.length; _columnIndex++) {
                var _controlPrefix = $(_elem).attr("id") + _rowIndex + _columnIndex;
                var _column = _row.columns[_columnIndex];

                var _td = $("<td><div class='formitem'></div></td>").appendTo(_tr);
                if (_column.colspan) {
                    _td.attr("colspan", _column.colspan);
                }
                if (_column.rowspan) {
                    _td.attr("rowspan", _column.rowspan);
                }
                if (_column.colStyle) {
                    _td.attr("style",_column.colStyle);
                }
                if (_column.colCls) {
                    _td.addClass(_column.colCls);
                }
                if (_column.id) {
                    _td.prop("id",_column.id);
                }
                if (_column.itemCls) {
                    _td.children(".formitem").addClass(_column.itemCls);
                }
                if (_column.itemStyle) {
                    _td.children(".formitem").attr("style", _column.itemStyle);
                }
                if (_column.style) {
                    _td.attr("style", _column.style);
                }
                //innerHtml 优先级高
                if (_column.innerHtml) {
                    _td.html(_column.innerHtml);
                }
                else {
                    if (_column.showLabel) {
                        var _label = $("<label></label>").appendTo(_td.children(".formitem")).html(_column.labelText || "");
                        if (_column.labelWidth) {
                            _label.width(_column.labelWidth);
                        }
                        if (_column.labelCls) {
                            _label.addClass(_column.labelCls);
                        }
                        if (_column.labelStyle) {
                            _label.attr("style", _column.labelStyle);
                        }
                        if (_column.required) {
                            _label.prepend("<span>*</span>");
                        }
                        if (_column.controlID) {
                            _label.attr("for", _column.controlID);
                        }
                    }
                    //dataOptions 和子属性（validType，required）互斥
                    function _getDataOptions(_columnOpt) {
                        if (_columnOpt.dataOptions) {
                            return  _columnOpt.dataOptions;
                        }
                        else {
                            var _dataOptions = [];
                            if (_columnOpt.validType) {
                                _dataOptions.push("validType:'" + _columnOpt.validType + "'");
                            }
                            if (_columnOpt.required) {
                                _dataOptions.push("required:true");
                            }
                            if (_columnOpt.formatter) {
                                _dataOptions.push("formatter:" + _columnOpt.formatter);
                            }
                            if (_columnOpt.editable != null) {
                                _dataOptions.push("editable:" + _columnOpt.editable);
                            }
                            if (_columnOpt.panelWidth) {
                                _dataOptions.push("panelWidth:" + _columnOpt.panelWidth);
                            }
                            if (_columnOpt.panelHeight) {
                                _dataOptions.push("panelHeight:" + _columnOpt.panelHeight);
                            }
                            if (_columnOpt.onSelect) {
                                _dataOptions.push("onSelect:" + _columnOpt.onSelect);
                            }
                            if (_columnOpt.onChange) {
                                _dataOptions.push("onChange:" + _columnOpt.onChange);
                            }
                            if (_dataOptions.length == 0) {
                                return undefined;
                            }
                            return _dataOptions.join(",");
                        }
                    }


                    if (_column.controlType) {
                        var _controlOuter = $("<div class='item-value'></div>").appendTo(_td.children(".formitem"));
                        var _controlElem = undefined;

                        if (_column.itemValueStyle) {
                            _controlOuter.attr("style", _column.itemValueStyle);
                        }
                        switch (_column.controlType) {
                            case "text":
                                var _controlID = _column.controlID || _controlPrefix + "input";
                                //设置类型
                                if (_column.password) {
                                    _controlElem = $("<input type='password'/>")
                                } else {
                                    _controlElem = $("<input type='text'/>")
                                }
                                _controlElem.attr("id", _controlID).attr("name", _controlID).appendTo(_controlOuter);
                                if (_column.defaultValue) {
                                    _controlElem.val(_column.defaultValue);
                                }
                                if (_column.hiddenField) {
                                    for (var _hiddenFieldIndex = 0; _hiddenFieldIndex < _column.hiddenField.length; _hiddenFieldIndex++) {
                                        var _hiddenField = _column.hiddenField[_hiddenFieldIndex];

                                        $("<input type='hidden'/>").prop("id", _hiddenField.id).prop("name", _hiddenField.id).val(_hiddenField.value)
                                            .appendTo(_controlOuter);
                                    }
                                }
                                break;
                            case "select":
                                var _controlID = _column.controlID || _controlPrefix + "select";
                                _controlElem = $("<select></select>").attr("id", _controlID).attr("name", _controlID).appendTo(_controlOuter);
                                //装载数据
                                if (_column.defaultValue) {
                                    for (var _optionIndex = 0; _optionIndex < _column.defaultValue.length; _optionIndex++) {
                                        var _option = _column.defaultValue[_optionIndex];
                                        var _selOne = $("<option></option>").attr("value", _option.value).html(_option.text).appendTo(_controlElem);
                                        if (_option.selected) {
                                            _selOne.attr("selected", _column.selected)
                                        }
                                    }
                                }
                                break;
                            case "textarea":
                                var _controlID = _column.controlID || _controlPrefix + "textarea";
                                _controlElem = $("<textarea/>").attr("id", _controlID).attr("name", _controlID).appendTo(_controlOuter);
                                if (_column.defaultValue) {
                                    _controlElem.text(_column.defaultValue);
                                }
                                break;
                            case "radio":
                                var _controlID = _column.controlID || _controlPrefix + "radio";
                                //装载数据
                                if (_column.defaultValue) {
                                    for (var _optionIndex = 0; _optionIndex < _column.defaultValue.length; _optionIndex++) {
                                        var _option = _column.defaultValue[_optionIndex];
                                        var _radio = $("<input type='radio'/>").attr("id", _controlID + _optionIndex).attr("value", _option.value).attr("name", _controlID).appendTo(_controlOuter);
                                        $("<label class='radio-label'></label>").attr("for", _controlID + _optionIndex)
                                            .html(_option.text).appendTo(_controlOuter);
                                        if (_option.checked) {
                                            _radio.prop("checked", "checked");
                                        }
                                    }
                                }
                                _controlOuter.prev().attr("for", _controlID + 0);
                                break;
                            case "checkboxlist":
                                var _controlID = _column.controlID || _controlPrefix + "checkbox";  //装载数据
                                if (_column.defaultValue) {
                                    for (var _optionIndex = 0; _optionIndex < _column.defaultValue.length; _optionIndex++) {
                                        var _option = _column.defaultValue[_optionIndex];
                                        var _cbx = $("<input type='checkbox'/>").attr("id", _option.id).attr("value", _option.value).attr("name", _option.id).attr("groupname", _column.controlID)
                                            .attr("labeltext",_option.text).appendTo(_controlOuter);
                                        var _cbxlabel = $("<label class='checkbox-label'></label>").attr("for", _option.id)
                                            .html(_option.text).appendTo(_controlOuter);
                                        if(_column.checkboxLabelStyle){
                                            _cbxlabel.attr("style",_column.checkboxLabelStyle);
                                        }
                                        if (_option.checked) {
                                            _cbx.prop("checked", "checked");
                                        }
                                        if(_option.disabled){
                                            _cbx.prop("disabled", "disabled");
                                        }
                                    }
                                }
                                if (_column.disabled) {
                                    _controlOuter.find("input:checkbox").prop("disabled", "disabled");
                                }
                                _controlOuter.prev().attr("for", _controlID + 0);
                                break;
                            default :
                                ;
                                break;
                        }
                        if (_controlElem) {
                            _controlElem.appendTo(_controlOuter);
                            if (_column.disabled) {
                                _controlElem.attr("disabled", "");
                            }
                            if (_column.controlStyle) {
                                _controlElem.attr("style", _column.controlStyle);
                            }
                            if (_column.controlWidth) {
                                _controlElem.width(_column.controlWidth);
                            }
                            if (_column.controlCls) {
                                _controlElem.addClass(_column.controlCls);
                            }
                            if (_column.onKeyupHandle) {
                                var keyupCallback = function(_c,_el){
                                    return function(){
                                        _c.onKeyupHandle.call(_el);
                                    }
                                }
                                _controlElem.bind("keyup", keyupCallback(_column,_controlElem))
                            }

                            var _dataOptions = _getDataOptions(_column);
                            if (_dataOptions) {
                                _controlElem.attr("data-options", _dataOptions);
                            }
                        }
                    }
                    if(_column.tipHtml){
                        _controlOuter.append(_column.tipHtml);
                    }
//                    {linkButton:{innerHtml:"",cls:"button-class",onClick:function(){}}}
                    if (_column.linkButton) {
                        var _linkbutton = $("<a></a>").appendTo(_td.children(".formitem")).html(_column.linkButton.innerHtml)
                            .addClass(_column.linkButton.cls || "formitem-button")
                            .bind("click", _column.linkButton.onClick);
                    }
                }
            }
        }
        if (_opts.onLoadComplete) {
            _opts.onLoadComplete.call(_elem);
        }
    }

    $.fn.formhelper = function (_options, _args) {
        if (typeof _options == "string") {
            return $.fn.formhelper.methods[_options](this, _args);
        }
        var opts = $.extend({}, $.fn.formhelper.defaults, _options);
        return this.each(function () {
            var $this = $(this);
            var extendOpts = $.metadata ? $.extend({}, opts, $this.data()) : opts;
            var _dc = _init(this, extendOpts);
            $.data(this, "formhelper", {
                options: extendOpts,
                dc: _dc
            });
            _bindEvent(this);
        });
    };
    $.fn.formhelper.methods = {
        loadRows: function (_jq, _data) {
            return _jq.each(function () {
                _renderRows(this, _data);
            });
        }
    };
    $.fn.formhelper.defaults = {
        extraStyle: undefined,
        formContentTableCls: undefined,
        formContentTableOuterCls: undefined
    };
})(jQuery);