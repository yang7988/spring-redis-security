/**
 * author: liyue
 * Date: 13-8-19
 * Time: 上午10:15
 */
(function ($) {
    function _buildDataGrid(smartGridStandIn, extendOpts) {
        $(".lee-smartgrid").remove();//remove last smartgird
        var datagridWrap = $("<div class=\"datagrid-wrap\">"
            + "<div class=\"datagrid-view\">"
            + "<div class=\"datagrid-view1\">"
            + "<div class=\"datagrid-header\">"
            + "<div class=\"datagrid-header-inner\"></div>"
            + "</div>" + "<div class=\"datagrid-body\">"
            + "<div class=\"datagrid-body-inner\"></div>"
            + "</div>" + "<div class=\"datagrid-footer\">"
            + "<div class=\"datagrid-footer-inner\"></div>"
            + "</div>" + "</div>"
            + "<div class=\"datagrid-view2\">"
            + "<div class=\"datagrid-header\">"
            + "<div class=\"datagrid-header-inner\"></div>"
            + "</div>" + "<div class=\"datagrid-body\"></div>"
            + "<div class=\"datagrid-footer\">"
            + "<div class=\"datagrid-footer-inner\"></div>"
            + "</div>" + "</div>" + "</div>" + "</div>").addClass("panel-body");

        var cc = extendOpts.columns;

        $("<div></div>").addClass("panel").addClass("datagrid").addClass("lee-smartgrid").append(datagridWrap)
            .insertAfter(smartGridStandIn).width(extendOpts.width);

        $(smartGridStandIn).hide();//.appendTo(datagridWrap.children("div.datagrid-view"));
        var view = datagridWrap.children("div.datagrid-view").height(extendOpts.height).width(extendOpts.width);
        var _rowNumberView = view.children("div.datagrid-view1");
        var _datagridView = view.children("div.datagrid-view2");
        if (!extendOpts.rownumbers) {
            _rowNumberView.hide();
            _datagridView.css({left: 0});
        }
        return {
            panel: datagridWrap,
            columns: cc,
            dc: {
                view: view,
                view1: _rowNumberView,
                view2: _datagridView,
                header1: _rowNumberView.children("div.datagrid-header").children(
                    "div.datagrid-header-inner"),
                header2: _datagridView.children("div.datagrid-header").children(
                    "div.datagrid-header-inner"),
                body1: _rowNumberView.children("div.datagrid-body").children(
                    "div.datagrid-body-inner"),
                body2: _datagridView.children("div.datagrid-body"),
                footer1: _rowNumberView.children("div.datagrid-footer").children(
                    "div.datagrid-footer-inner"),
                footer2: _datagridView.children("div.datagrid-footer").children(
                    "div.datagrid-footer-inner")
            }
        };

    };

    function _init(smartGridStandIn) {
        var gridData = $.data(smartGridStandIn, "smartgrid");
        var opts = gridData.options;
        var dc = gridData.dc;
        opts.view.render.call(opts.view, gridData, dc.body2, false);
    }

    function _bindEvent(smartGridStandIn) {
        //绑定事件
        var gridData = $.data(smartGridStandIn, "smartgrid");
        var opts = gridData.options;
        gridData.dc.body2.find("tr").each(function () {
            var $this = $(this);
            $(this).bind("click", function (e) {
                var tt = $(e.target);
                var tr = tt.closest("tr.datagrid-row");
                if (!tr.length) {
                    return;
                }
                var rowIndex = getRowIndex(tr);
                if (tt.parent().hasClass("datagrid-cell-check")) {
                }
                else {
                    var row = opts.finder.getRow(smartGridStandIn, rowIndex);
                    var td = tt.closest("td[field]", tr);
                    if (td.length) {
                        var fieldName = td.attr("field");
                        //opts.onClickCell.call(smartGridStandIn, rowIndex, fieldName, row[fieldName]);
                    }
                    if (opts.singleSelect == true) {
                        _onSelect(smartGridStandIn, rowIndex, false, e);
                    }
                    //opts.onClickRow.call(smartGridStandIn, rowIndex, row);
                }
                e.stopPropagation();
            });
            $(this).find("td[field='isCheck'] input[type=radio]").bind("click", function (e) {
                $this.click();
                e.stopPropagation();
            });
        });
        function getRowIndex(tr) {
            if (tr.attr("datagrid-row-index")) {
                return parseInt(tr.attr("datagrid-row-index"));
            } else {
                return tr.attr("node-id");
            }
        }
    }

    function _onSelect(smartGridStandIn, rowIndex, isEnableMutiSelect, event) {
        var gridData = $.data(smartGridStandIn, "smartgrid");
        var dc = gridData.dc;
        var opts = gridData.options;
        var data = gridData.data;
        var selectedRows = $.data(smartGridStandIn, "smartgrid").selectedRows;
        if(typeof (data)==='undefined'|| typeof (data.rows)==='undefined'|| rowIndex >data.rows.length-1)
        {
             return false;
        }
        if (opts.singleSelect) {
            _onUnselectAll(smartGridStandIn);
            selectedRows.push(data.rows[rowIndex]);
        }
//        if (!isEnableMutiSelect && opts.checkOnSelect) {
//            _onCheck(smartGridStandIn, rowIndex, true);
//        }
        var tr = opts.finder.getTr(smartGridStandIn, rowIndex).addClass("datagrid-row-selected");
        tr.find("td[field='isCheck'] input[type=radio]")._propAttr("checked", true);
        opts.onSelect.call(smartGridStandIn, rowIndex, data.rows[rowIndex], event);
        if (tr.length) {
            var _4ca = dc.view2.children("div.datagrid-header")._outerHeight();
            var _4cb = dc.body2;
            var top = tr.position().top - _4ca;
            if (top <= 0) {
                _4cb.scrollTop(_4cb.scrollTop() + top);
            } else {
                if (top + tr._outerHeight() > _4cb.height() - 18) {
                    _4cb.scrollTop(_4cb.scrollTop() + top + tr._outerHeight()
                        - _4cb.height() + 18);
                }
            }
        }
    };

    function _onUnselectAll(smartGridStandIn, _4db) {
        var gridData = $.data(smartGridStandIn, "smartgrid");
        var opts = gridData.options;
        var rows = gridData.data.rows;
        $.data(smartGridStandIn, "smartgrid").selectedRows = [];
        opts.finder.getTr(smartGridStandIn, "", "selected").removeClass("datagrid-row-selected");
        opts.onUnselectAll.call(smartGridStandIn, rows);
    };

    function _initRows(smartGridStandIn, rows) {
        var opts = $.data(smartGridStandIn, "smartgrid").options;
        opts.view.insertRows.call(opts.view, smartGridStandIn, null, rows);
        if (opts.view.onAfterLoadData) {
            opts.view.onAfterLoadData.call(opts.view, smartGridStandIn, rows);
        }
    };

    function _getSelected(smartGridStandIn) {
        var opts = $.data(smartGridStandIn, "smartgrid").options;
        var data = $.data(smartGridStandIn, "smartgrid").data;
        if (opts.idField) {
            return $.data(smartGridStandIn, "smartgrid").selectedRows;
        } else {
            var rows = [];
            opts.finder.getTr(smartGridStandIn, "", "selected", 2).each(function () {
                var rowIndex = parseInt($(this).attr("datagrid-row-index"));
                rows.push(data.rows[rowIndex]);
            });
            return rows;
        }
    };

    function _insertRows(gridData, targetTable) {
        for (var i = 0; i < gridData.data.rows.length; i++) {
            gridData.data.total += 1;
            var row = gridData.data.rows[i];
            var dataGridBodyRow = $("<tr></tr>").addClass("datagrid-row").attr("datagrid-row-index", i)
                .appendTo(targetTable);
            for (var colIndex = 0; colIndex < gridData.options.columns.length; colIndex++) {
                var column = gridData.options.columns[colIndex];
                if (!column.hidden) {
                    var dataGridCellOuter = $("<td></td>").attr("field", column.field).appendTo(dataGridBodyRow);
                    var dataGridCell = $("<div></div>").appendTo(dataGridCellOuter);

                    if (column.radio == true) {
                        dataGridCell.addClass("datagrid-cell-check");//.css({"width": "35px"});
                        var radio = $("<input type='radio'/>").attr("id", gridData.options.groupname + i).attr("name", gridData.options.groupname);
                        dataGridCell.append(radio);
                        dataGridBodyRow.attr("for", gridData.options.groupname + i);
                    }
                    else {
                        for (var cell in row) {
                            if (cell === column.field) {
                                var fieldValue;
                                fieldValue = row[cell];
                                if (column.formatter) {
                                    fieldValue = column.formatter.call(this, row[cell], row,i);
                                }
                                dataGridCell.addClass("datagrid-cell").addClass("datagrid-cell-c" + (i + 1) + cell).css(
                                    {
                                        "width": column.width,
                                        "text-align": "left"
                                    }).html(fieldValue);
                            }
                        }
                    }

                }
            }
        }
    };

    function _onAfterLoadData(smartGridStandIn, rows) {
        var opts = $.data(smartGridStandIn, "smartgrid").options;
        opts.onAfterLoadData.call(smartGridStandIn, rows);
    };

    $.fn.smartgrid = function (method, options) {
        if (typeof method == "string") {
            return $.fn.smartgrid.methods[method](this, options);
        }
        var opts = $.extend({}, $.fn.smartgrid.defaults, method);
        return this.each(function () {
            var $this = $(this);
            var extendOpts = $.metadata ? $.extend({}, opts, $this.data()) : opts;
            var grid = _buildDataGrid(this, extendOpts);

            if (!grid.columns) {
                grid.columns = extendOpts.columns;
            }
            extendOpts.columns = $.extend(true, [], extendOpts.columns);

            $.data(this, "smartgrid", {
                options: extendOpts,
                panel: grid.panel,
                dc: grid.dc,
                selectedRows: [],
                data: {
                    total: 0,
                    rows: []
                }
            });
            _init(this);
        });
    };

    var operateView = {
        render: function (smartgrid, targetBody, isRowNumber) {
            /*装配header*/
            var dataGridHeaderTable = $("<table border='0' cellspacing='0' cellpadding='0'></table>").addClass("datagrid-htable").css("height", "25px");
            var headerTR = $("<tr></tr>").addClass("datagrid-header-row");
            for (var i = 0; i < smartgrid.options.columns.length; i++) {
                var column = smartgrid.options.columns[i];
                if (!column.hidden) {
                    var tempTD = $("<td></td>").attr("field", column.field).appendTo(headerTR);

                    if (column.radio == true) {
                        var dataGridCell = $("<div></div>").addClass("datagrid-header-check");//.css({"width": "35px", "text-align": "left"});
                        var radio = $("<input type='radio'/>").css("display", "none");
                        dataGridCell.append(radio);
                        tempTD.append(dataGridCell);
                    }
                    else {
                        var dataGridCell = $("<div></div>").addClass("datagrid-cell").css({"width": column.width, "text-align": "left"});
                        var dataGridCellTextSpan = $("<span></span>").html(column.title);
                        var dataGridCellSortSpan = $("<span></span>").addClass("datagrid-sort-icon").html("&nbsp;");
                        dataGridCell.append(dataGridCellTextSpan);
                        dataGridCell.append(dataGridCellSortSpan);
                        tempTD.append(dataGridCell);
                    }
                }
            }
            dataGridHeaderTable.append(headerTR);
            smartgrid.dc.header2.append(dataGridHeaderTable);

            //初始化数据
            var dataGridBodyTable = $("<table border='0' cellspacing='0' cellpadding='0'></table>")
                .appendTo(targetBody);
            smartgrid.options.groupname = smartgrid.options.groupname || "tempgroup";
            _insertRows(smartgrid, dataGridBodyTable);
        },
        updateRow: function (smartgrid, posIndex, row) {
            var opts = $.data(smartgrid, "smartgrid").options;
            var rows = $(smartgrid).smartgrid("getRows");
            $.extend(rows[posIndex], row);
            var rowStyle = opts.rowStyler ? opts.rowStyler.call(smartgrid, posIndex, rows[posIndex]) : "";

            function _buildRowContent(isRowNumber) {
                var columnFields = $(smartgrid).smartgrid("getColumnFields", isRowNumber);
                var tr = opts.finder.getTr(smartgrid, posIndex, "body", (isRowNumber ? 1 : 2));
                var isChecked = tr.find("div.datagrid-cell-check input[type=radio]").is(":checked");
                tr.html(this.renderRow.call(this, smartgrid, columnFields, isRowNumber, posIndex, rows[posIndex]));
                tr.attr("style", rowStyle || "");
                if (isChecked) {
                    tr.find("div.datagrid-cell-check input[type=radio]")._propAttr("checked", true);
                }
            };

            _buildRowContent.call(this, true);
            _buildRowContent.call(this, false);
            $(smartgrid).smartgrid("fixRowHeight", posIndex);
        },
        insertRows: function (smartGridStandIn, posIndex, rows) {
            var gridData = $.data(smartGridStandIn, "smartgrid");
            var targetTable = gridData.dc.body2.children("table");

            gridData.data.rows = rows;
            _insertRows(gridData, targetTable);
            _bindEvent(smartGridStandIn);
        },
        onBeforeRender: function (smartgrid, rows) {
        },
        onAfterRender: function (smartgrid) {
            var opts = $.data(smartgrid, "smartgrid").options;
            if (opts.showFooter) {
                var footer = $(smartgrid).smartgrid("getPanel").find("div.datagrid-footer");
                footer.find("div.datagrid-cell-rowNumber,div.datagrid-cell-check").css("visibility", "hidden");
            }
        },
        onAfterLoadData: function (smartgrid, rows) {
            _onAfterLoadData(smartgrid, rows);
        }
    };

    $.fn.smartgrid.methods = {
        getData: function (jq) {
            return $.data(jq[0], "smartgrid").data;
        },
        getRows: function (jq) {
            return $.data(jq[0], "smartgrid").data.rows;
        },
        getSelected: function (jq) {
            var rows = _getSelected(jq[0]);
            return rows.length > 0 ? rows[0] : null;
        },
        selectRow: function (jq, _rowIndex) {
            return jq.each(function () {
                _onSelect(this,_rowIndex);
            });
        },
        initRows: function (jq, rows) {
            return jq.each(function () {
                _initRows(this, rows);
            });
        }
    };

    $.fn.smartgrid.defaults = {
        width: 375,
        height: 150,
        rownumbers: false,
        singleSelect: true,
        columns: undefined,
        groupname: undefined,
        onSelect: function (rowIndex, rowData) {
        },
        onUnselectAll: function (rowData) {
        },
        onAfterLoadData: function () {
        },
        view: operateView,
        finder: {
            getTr: function (smartgrid, rowIndex, type, viewID) {
                type = type || "body";
                viewID = viewID || 0;
                var gridData = $.data(smartgrid, "smartgrid");
                var dc = gridData.dc;
                var opts = gridData.options;
                if (viewID == 0) {
                    var tr1 = opts.finder.getTr(smartgrid, rowIndex,
                        type, 1);
                    var tr2 = opts.finder.getTr(smartgrid, rowIndex,
                        type, 2);
                    return tr1.add(tr2);
                } else {
                    if (type == "body") {
                        var tr = $("#" + gridData.rowIdPrefix + "-"
                            + viewID + "-" + rowIndex);
                        if (!tr.length) {
                            tr = (viewID == 1 ? dc.body1
                                : dc.body2).find(">table>tbody>tr[datagrid-row-index="
                                    + rowIndex + "]");
                        }
                        return tr;
                    } else {
                        if (type == "footer") {
                            return (viewID == 1 ? dc.footer1 : dc.footer2).find(">table>tbody>tr[datagrid-row-index="
                                + rowIndex + "]");
                        } else {
                            if (type == "selected") {
                                return (viewID == 1 ? dc.body1
                                    : dc.body2)
                                    .find(">table>tbody>tr.datagrid-row-selected");
                            } else {
                                if (type == "last") {
                                    return (viewID == 1 ? dc.body1
                                        : dc.body2)
                                        .find(">table>tbody>tr:last[datagrid-row-index]");
                                } else {
                                    if (type == "allbody") {
                                        return (viewID == 1 ? dc.body1
                                            : dc.body2)
                                            .find(">table>tbody>tr[datagrid-row-index]");
                                    } else {
                                        if (type == "allfooter") {
                                            return (viewID == 1 ? dc.footer1
                                                : dc.footer2)
                                                .find(">table>tbody>tr[datagrid-row-index]");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            getRow: function (_5ee, _5ef) {
                return $.data(_5ee, "smartgrid").data.rows[_5ef];
            }
        }
    };
})(jQuery);