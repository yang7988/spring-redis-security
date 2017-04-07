/**
 * author: liyue
 * Date: 13-9-10
 * Time: 下午5:09
 * dependency:jQuery
 * work for service module
 * 横向导航页面必须引用此脚本
 */

//初始化公共数据

var activateFlag = [
    {
        value: "",
        text: ""
    },
    {
        value: "0",
        text: "未激活"
    },
    {
        value: "1",
        text: "已激活"
    }
];

var idType = undefined, gender = undefined;

var cardState = [
    {text: "", value: ""},
    {text: "正常使用", value: "0"},
    {text: "书面挂失", value: "1"},
    {text: "口头挂失", value: "2"},
    {text: "卡注销", value: "3"},
    {text: "换卡", value: "4"},
    {text: "补卡", value: "5"},
    {text: "待补换", value: "6"}
];

var cardType = [
    {
        value: "",
        text: ""
    },
    {
        value: "01",
        text: "普通蓝卡"
    },
    {
        value: "02",
        text: "普通红卡"
    },
    {
        value: "03",
        text: "金融蓝卡"
    },
    {
        value: "04",
        text: "普通黄卡"
    },
    {
        value: "05",
        text: "优待黄卡"
    },
    {
        value: "06",
        text: "普通优待黄卡"
    },
    {
        value: "07",
        text: "金融优待蓝卡"
    },
    {
        value: "08",
        text: "金融优待黄卡"
    }
];

var abnormalType = [
    {text: "", value: ""},
    {text: "卡商制卡导致卡片质量问题", value: "0"},
    {text: "信息采集导致的卡面信息错误", value: "1"}
];

var dealState = [
    {text: "", value: ""},
    {text: "待处理", value: "0"},
    {text: "已处理", value: "1"}
];

var isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function adjustElemHeight(_elem, _diff) {
    if (isArray(_elem) && _elem.length == 2) {
        var _newElem = _elem[0];
        _diff = _elem[1];
        if (isNaN(_diff)) {
            _diff = 0;
        }
        $(_newElem).height($(document.body).outerHeight() - _diff);
    }
    else if (_elem) {
        if (isNaN(_diff)) {
            _diff = 0;
        }
        $(_elem).height($(document.body).outerHeight() - _diff);
    }
}

function afterPageLoadComplete(_functionArray) {
    for (var _functionIndex = 0; _functionIndex < _functionArray.length; _functionIndex++) {
        var _function = _functionArray[_functionIndex];
        _function.name.call(this, _function.options);
    }
}

function resetLoadingMask() {
    if ($("body").children("loading-outer").length == 0) {
        $("<div id='loading-outer'  class='ajax-loading-mask'>" +
            "</div>").appendTo("body");
        $("<div class='loading-icon' id='loading'></div>").appendTo("body");
    }
    /*
     *  初始化Loading位置
     */
    $("#loading-outer").css({
        width: $(document.body).outerWidth(),
        height: $(document.body).outerHeight(),
        display: "none"
    })
    $(".loading-icon").css({
        left: $(document.body).outerWidth() / 2 - $("#loading-outer .loading-icon").width() / 2,
        top: $(document.body).outerHeight() / 2 - $("#loading-outer .loading-icon").height() / 2,
        display: "none"
    })

    $("#loading-outer").ajaxStart(function () {
        $(this).show();
        $("#loading").show();
    });
    $("#loading-outer").ajaxComplete(function () {
        $(this).hide();
        $("#loading").hide();
    });
}

function checkBrowser() {
    if (navigator.userAgent.indexOf("IE") < 0) {
        $.messager.alert("提示", "请使用IE内核的浏览器！", "warning");
        return false;
    }
    return true;
}

function printBill(billFileName, billType, confirmOrderNo, fileDownload, myPrintCtr, printRootPath, contextPath) {
    if (!checkBrowser()) {
        return false;
    }
    if (!billType || !confirmOrderNo) {
        return false;
    }
    try {
        var bill = getBill({billType: billType, pk: confirmOrderNo}, fileDownload, printRootPath, contextPath)
        var prtURL = printRootPath + confirmOrderNo + ".htm"; //
        if (bill.flag == 1) {
            if (prtURL.indexOf(":") > 1) {
                prtURL = "file://" + prtURL;
            }
            myPrintCtr.DoHtmlPrint(prtURL);
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false
    }
}

function getBill(params, fileDownload, printRootPath, contextPath) {
    //var host = $.gzcard.getHostUrl("/gzcard-web");
    var host = $.gzcard.getHostUrl(contextPath);//"${requestContext.contextPath}"

    fileDownload.ServerUrl = host + "/file/download";
    fileDownload.Params = "billType=" + params.billType + "&pk=" + params.pk;
    fileDownload.Type = "202";
    fileDownload.BlockSize = "34200";
    fileDownload.FileName = params.pk + ".htm";
    fileDownload.SetProgressBar(false);
    fileDownload.FileSavePath = printRootPath;

    var result = fileDownload.DownLoad();
    return JSON.parse(result);
}

function getPrintType(formId) {
    var retObj = {printType: undefined};
    $(formId + ' input[name=printType]').each(function () {
        if (this.checked) {
            retObj.printType = this.value;
        }
    });
    return retObj;
}

/**
 * 打印回执
 * @param contextPath 站点名
 * @param downloadCtrl 下载控件名
 * @param printCtrl 打印控件
 * @param downloadPath 下载路径
 * @param cardJnlNo 流水号（必填）
 * @param name 办理人姓名（必填）
 * @param idNum 社会保障号（必填）
 * @param trxName 交易名称（必填）
 * @param cardTypes 卡种名称，多个卡种使用逗号隔开如（"金融蓝卡,普通优待黄卡"）（不是必填）
 * @param acceptDate 业务办理日期，"yyyy-MM-dd"格式（必填）
 * @param isPrintNotice 是否需要打印缴款通知书
 * @param fullName 付款人全称：身份证号+姓名
 * @param payType 缴款方式
 * @param payNo 缴款通知书编号
 * @param payCount 办理卡数量
 * @param callback 回调函数
 */
function printReceipt(contextPath, downloadCtrl, printCtrl, downloadPath, cardJnlNo, name, idNum, trxName, cardTypes,
                      acceptDate, isPrintNotice, fullName, payType, payNo, payCount,
                      printInfoList,idType,callback,civilCmd,tpParams) {
    var host = $.gzcard.getHostUrl(contextPath);
    var params = {};
    params.cardJnlNo = cardJnlNo;
    params.name = name;
    params.idNum = idNum;
    params.trxName = trxName;
    params.cardTypes = cardTypes;
    params.acceptDate = acceptDate;
    params.fullName = fullName;
    params.payType = payType;
    params.payNo = payNo;
    params.payCount = payCount;
    params.isPrintNotice = "0";//默认为不需要打印缴款通知书
    if (isPrintNotice) {
        params.isPrintNotice = "1";
    }
    //信息查询项目
    if(printInfoList && printInfoList!="")
    {
        params.isPrintCardInfo = "1";
        params.printInfoList_temp = printInfoList;
    }
    else
    	params.isPrintCardInfo = "0";
   // alert("isPrintCardInfo:" +params.isPrintCardInfo);
    if(idType){
        params.idType= idType;
    }
    var url =  host + '/model/process?cmd=103220&v=' + Math.random();
    //如果是民政请求则重写url
    if(civilCmd){
        url  =  host +'/thirdparty/process?cmd='+ civilCmd +'&'+tpParams+"&v=" + Math.random();
    }
    //生成
    $.gzcard.ajax({
        url: url,
        method: "POST",
        data: params,
        async: false,
        success: function (data, status, XHR) {
            if (data == 1) {
                if (downloadReceipt(downloadCtrl, host, cardJnlNo, downloadPath)) {
                    //打印
                    var prtURL = "file://" + downloadPath + cardJnlNo + ".htm";
                    printCtrl.DoHtmlPrint(prtURL);
                    if (typeof  callback !== "undefined") {
                        callback.call(this);
                    }
                }
                else {
                    $.messager.alert("提示", "获取回执失败！", "warning");
                }
            }
            else {
                $.messager.alert("提示", "生成回执失败！", "warning");
            }
        },
        error: function (XHR, status, errorThrow) {
            $.messager.alert("提示", "生成回执发生异常！", "500");
        }
    });
}

/**
 * 完成打印回执后显示完成按钮
 */
function afterPrintReceipt() {
    $("#finishBusiness").show();
}

function downloadReceipt(fileDownload, host, cardJnlNo, downloadPath) {
    if (!checkBrowser()) {
        return false;
    }
    //
    fileDownload.ServerUrl = host + "/file/download";
    fileDownload.Params = "cardJnlNo=" + cardJnlNo;
    fileDownload.Type = "210";//领卡后记录档案的最终选择图片
    fileDownload.BlockSize = "34200";
    fileDownload.FileName = cardJnlNo + ".htm";
    fileDownload.SetProgressBar(false);
    fileDownload.FileSavePath = downloadPath;
    //
    var result = JSON.parse(fileDownload.DownLoad());
    //
    if (result) {
        var flag = result.flag;
        if (flag == 1)//下载成功
        {
            return true;
        }
    }
    return false;
}

//下载旧照片
function downloadUserPhoto(params, fileDownload, fileName, fileSavePath, fileType, contextPath) {
    if (!checkBrowser()) {
        return false;
    }
    //var host = $.gzcard.getHostUrl("/gzcard-web");
    var host = $.gzcard.getHostUrl(contextPath);
    fileDownload.ServerUrl = host + "/file/download";
    fileDownload.Params = params;
    fileDownload.Type = fileType;//领卡后记录档案的最终选择图片
    fileDownload.BlockSize = "34200";
    fileDownload.FileName = fileName;
    fileDownload.SetProgressBar(false);
    fileDownload.FileSavePath = fileSavePath;

    var downloadOldPicResult = JSON.parse(fileDownload.DownLoad()), oldPicSrc = undefined;

    //显示图片
    if (downloadOldPicResult) {
        var flag = downloadOldPicResult.flag;
        if (flag == 1)//下载图片成功
        {
            return  fileSavePath + fileName;
        }
        else if (flag == 0)//图片不存在
        {
            $.messager.alert("提示", "社保（市民）卡相片下载失败，请刷新页面重试。", "warning");
        }
    }
}

function getSysDate(contextPath, format) {
    var host = $.gzcard.getHostUrl(contextPath);
    var params = {};
    if (format && format != null && format != 'undefined') {
        params.format = format;
    }
    var result = '';
    $.gzcard.ajax({
        url: host + '/model/process?cmd=102058&v=' + Math.random(),
        method: "POST",
        data: params,
        async: false,
        success: function (data, status, XHR) {
            if (data) {
                result = data;
            }
            else {
                if (top.$.messager != null) {
                    top.$.messager.alert("提示", "获取系统时间失败！", "warning", null, 4000);
                }
                else {
                    $.messager.alert("提示", "获取系统时间失败！", "warning", null, 4000);
                }
            }
        },
        error: function (XHR, status, errorThrow) {
            if (top.$.messager != null) {
                top.$.messager.alert("提示", "获取系统时间异常！", "warning", null, 4000);
            }
            else {
                $.messager.alert("提示", "获取系统时间异常！", "warning", null, 4000);
            }
        }
    });
    return result;
}

/**
 * 页面加载完毕后的操作
 * @param isAdjustFirstStep 是否调整样式
 * @param navIsShow         是否显示导航栏，若有则不用传递此参数，若无请传递false
 */
function afterPageLoad(isAdjustFirstStep, navIsShow) {
    /**
     * 调整第一步内容的位置
     * @param navIsShow 是否显示横向导航
     */
    function adjustCSS(navIsShow) {
        var referenceWidth = 0;//参照物的宽度

        if (!navIsShow && typeof navIsShow !== 'undefined') {
            referenceWidth = $("body").width();
        }
        else {
            if ($("ul.anchor").length == 0) {
                alert("没有定义导航！");
                return;
            }
            referenceWidth = $("ul.anchor").width();
        }
        //设置最后一步的位置
        var lastStepName = $("ul.anchor li:last-child a").attr("href");
        var ml = referenceWidth / 2 - ($("#step-1").width() + $(".actionBar").width()) / 2;
        var mllast = referenceWidth / 2 - $(lastStepName).width() / 2;
        if (ml < 0) {
            ml = 0;
        }
        if (mllast < 0) {
            mllast = 0;
        }
        $("#step-1").css("margin-left", ml + "px");

        if($("ul.anchor").css("display") == "block"){
            $(lastStepName).css("margin-left", mllast + "px");
        }

        if ($(".first-step-tips").length > 0) {
            ml = referenceWidth / 2 - ($(".first-step-tips").width()) / 2;
            if (ml < 0) {
                ml = 0;
            }
            $(".first-step-tips").css("left", ml + "px");
        }
    }

    //调整样式
    if (isAdjustFirstStep) {
        adjustCSS(navIsShow);
    }
}
/**
 * 设置步骤样式
 * @param stepCount
 * @param styleArray
 * styleArray = [
 *                      "",
 *                      undefined,
 *                      undefined,
 *                      ""
 *                  ]
 */
function setStepsStyle(stepCount,styleArray) {
    if(!stepCount){
        alert("请设置步骤数量");
    }
    var step1Style = "width: 520px;margin: 100px auto 0 auto;", //第一步样式
        t2step_LastStepStyle  ="",//共二步最后一步样式
        t3step_LastStepStyle ="width:750px;margin-top: 5px;", //共三步最后一步样式
        t4step_LastStepStyle ="width:750px;margin-top: 5px;";//共四步最后一步样式

    if(styleArray && styleArray.length>0 && styleArray[0])
    {
        step1Style= styleArray[0];
    }
    if(styleArray && styleArray.length==3 && styleArray[2]){
        t3step_LastStepStyle = styleArray[2];
    }
    if(styleArray && styleArray.length==4 && styleArray[3]){
        t4step_LastStepStyle = styleArray[3];
    }
    //设置第一步样式
    $("#step-1").attr("style", step1Style);

    //设置最后一步样式
    switch (stepCount){
        case 2:;break;
        case 3:
            $("#step-3").attr("style", t3step_LastStepStyle);
            break;
        case 4:
            $("#step-4").attr("style", t4step_LastStepStyle);
            break;
        default :;break;
    }
}
function renderStepsHtml(step1Rows,step2Rows,step3Rows,extopts) {
    $("#step-1").formhelper({});
    $("#step-2,#step-3").formhelper($.extend({}, { extraStyle: "margin: 10px 0 0 0;"}, extopts));
    if (step1Rows) {
        $("#step-1").formhelper("loadRows", step1Rows);
    }
    if (step2Rows) {
        $("#step-2").formhelper("loadRows", step2Rows);
    }
    if (step3Rows) {
        $("#step-3").formhelper("loadRows", step3Rows);
    }
}
/**
 * 初始化步骤
 * 对于第一步输入参数为证件类型和证件号码，共有四步的适用
 */
function renderSteps(step1Rows, step2Rows, step3Rows, extopts) {
    renderStepsHtml(step1Rows,step2Rows,step3Rows,extopts);
    setStepsStyle(4);
}

/**
 * 回填代办人信息
 *
 */
function backSetProxyInfo() {
    $('#proxyIdNum_temp').val($('#proxyIdNum').val());
    $('#proxyIdType_temp').combobox("setValue", $('#proxyIdType').combobox("getValue"));
    $('#proxyName_temp').val($('#proxyName').val());
    $('#proxyPhoneNum_temp').val($('#proxyPhoneNum').val());
    $('#proxyAddress_temp').val($('#proxyAddress').val());
    $('#proxyGender_temp').combobox('setValue', $('#proxyGender').combobox('getValue'));
}

/**
 * 设置代办人信息
 *
 */
function setProxyInfo() {
    $('#proxyIdNum').val($('#proxyIdNum_temp').val());
    $('#proxyIdType').combobox("setValue", $('#proxyIdType_temp').combobox("getValue"));
    $('#proxyName').val($('#proxyName_temp').val());
    $('#proxyGender').combobox('setValue', $('#proxyGender_temp').combobox('getValue'));
    $('#proxyPhoneNum').val($('#proxyPhoneNum_temp').val());
    $('#proxyAddress').val($('#proxyAddress_temp').val());
}

/**
 * 初始化卡片图标
 */
function initCardIcon() {
    //append popup
    var cardImgOuter = $("<div class='card-img-outer'></div>").appendTo($("body"));
    cardImgOuter.css({
        position: "absolute",
        top: "0",
        left: "0",
        height: "212px",
        width: "335px",
        display: "none",
        "z-index": 99999,
        background: "no-repeat 0 0"
    });
    //bind event
    $(".card-icon").each(function () {
        $(this).bind("mouseenter", function (e) {
            var posX = window.event.x, posY = window.event.y, objWidth = $(this).width(), objHeight = $(this).height(), parentOffsetLeft = $(this).offset().left, parentOffsetTop = $(this).offset().top, cardImgOuter = $(".card-img-outer");
            //根据列位置计算弹出框位置
            posX = parentOffsetLeft + objWidth;
            posY = $(this).offset().top;
            //计算水平方向
            if ($("body").width() - posX < cardImgOuter.width()) {
                posX = parentOffsetLeft - cardImgOuter.width() - 2;
            }
            //计算垂直方向
            if ($("body").height() - posY < cardImgOuter.height()) {
                posY = parentOffsetTop - cardImgOuter.height() - 2 + objHeight;
            }
            cardImgOuter.css({
                top: posY,
                left: posX,
                "background-image": "url(" + $(this).attr("timg") + ")"
            }).show();
        }).bind("mouseout", function (e) {
            $(".card-img-outer").hide();
        });
    });
}

/**
 * 横向导航回车后执行下一步操作
 * @param event
 */
function onNextStep(event) {
    event = window.event || event;
    if (event.keyCode == 13)
        $(".button-next", $('#wizard')).click();
}

/********************补换卡脚本*****************************/
//是否一代卡，并且医保银行为空
function isYiDaiCard(cardType, rowIndex) {
    var checkedItems = $('#cardGrid').datagrid('getChecked');
    for (var index = 0; index < checkedItems.length; index++) {
        var cardInfo = checkedItems[index];
        //一代卡没有医保银行的可选医保银行
        if (cardType == cardInfo.cardType) {
            //为社保卡，且没有金融功能为一代卡
            if (cardInfo.mainCard == '1' && cardInfo.financial == '0' && (cardInfo.medBank == null || cardInfo.medBank == '')) {
                return "1";
            }
        }
    }
    return "0";
}

function chooseMedBanks() {
    var canFixMedCnt = 0;
    var checkedItems = $('#cardGrid').datagrid('getSelections');
    $.each(checkedItems, function (index, item) {
        //为社保卡，且没有金融功能为一代卡
        if (item.mainCard == "1" && item.financial == "0" && (item.medBank == null || item.medBank == "")) {
            canFixMedCnt++;
        }
    });
    //一代卡没有医保银行的可选医保银行
    if (canFixMedCnt >= 1) {
        $('#medBank_step2').combobox("enable");
        $('#medAcct_step2').attr("disabled", false);
        $('.med-relation').show();
    } else {
        $('#medBank_step2').combobox("disable");
        $('#medAcct_step2').attr("disabled", true);
        $('.med-relation').hide();
        $('#medBank_step2').combobox("setValue", "");
        $('#medAcct_step2').val("");
    }
    return canFixMedCnt;
}

function chooseMedBank(cardType, rowIndex) {
    var canFixMedCnt = chooseMedBanks();//单个选择之前，先检查是否已经有选择其他的
    var checkedItems = $('#cardGrid').datagrid('getChecked');
    for (var index = 0; index < checkedItems.length; index++) {
        var cardInfo = checkedItems[index];
        //一代卡没有医保银行的可选医保银行
        if (cardType == cardInfo.cardType) {
            //为社保卡，且没有金融功能为一代卡
            if (cardInfo.mainCard == '1' && cardInfo.financial == '0' && (cardInfo.medBank == null || cardInfo.medBank == '')) {
                canFixMedCnt++;
            }
        }
    }
    //一代卡没有医保银行的可选医保银行
    if (canFixMedCnt >= 1) {
        $('#medBank_step2').combobox("enable");
        $('#medAcct_step2').attr("disabled", false);
        $('.med-relation').show();
    } else {
        $('#medBank_step2').combobox("disable");
        $('#medAcct_step2').attr("disabled", true);
        $('.med-relation').hide();
        $('#medBank_step2').combobox("setValue", "");
        $('#medAcct_step2').val("");
    }
}
/*********************补换卡脚本****************************/


//处理移动电话
var getEncryptedPhoneNum = function (mobileNum) {
    if(!mobileNum || mobileNum.length != 11){
        return "";
        //return "无预留移动电话";
    }
    return "*******"+mobileNum.substr(7,4);
};

//处理移动电话(显示固定电话)
var getTelPhoneNum = function (mobileNum) {
//    if(!mobileNum || mobileNum.length != 11){
////        return mobileNum;
//    	return "****"+mobileNum.substr(4,4);
//    }
//    return "*******"+mobileNum.substr(7,4);
	if(mobileNum&&mobileNum.length ==11){
		return "*******"+mobileNum.substr(7,4);
	}else if(mobileNum&&mobileNum.length ==8){
		return "****"+mobileNum.substr(4,4);
	}else if(mobileNum&&mobileNum.length ==7){
		return "***"+mobileNum.substr(3,4);
	}else{
		return "联系方式不正确";
	}
};

/**
 * 阻止事件冒泡
 * @param event
 */
function stopBubble(event) {
    if (event.stopPropagation) {
        // this code is for other browser
        event.stopPropagation();
    }
    else if (window.event) {
        // this code is for IE 8 or earlier
        window.event.cancelBubble = true;
    }
}
/**
 * 渲染服务处理结果 完全业务无关，可通用
 * @param obj 服务参数
 * @param container 放置返回结果html的容器
 * @param combineResultColumn 是否合并结果行 true/false
 *
 * obj：
 * {
 *   moduleName:"补卡",
 *   handleResult:{
 *                          result:"1", //全局成功失败
 *                          resultList:[
 *                                          {cardTypeName:"金融蓝卡",result:"1",......},
 *                                          {cardTypeName:"优待黄卡",......},
 *                                          ......
 *                                        ],
 *                      },
 *   header:[{text:"卡类型",style:"",cls:""},{text:"本地补卡",style:""},......],
 *   columns:["cardTypeName","result",.....] //用于循环获取resultList中的值
 * }
 */
function renderHandleResult(obj, container, combineResultColumn) {
    if (!container || !obj) {
        alert("请正确配置参数。");
        return;
    }
    /**
     * 变量声明
     */
    var moduleName = obj.moduleName, handleResult = obj.handleResult,
        headerObj = obj.header, columns = obj.columns;
    var resultFlag = handleResult.result, rows = handleResult.resultList,
        resultFlagText = resultFlag == "1" ? moduleName+"成功" : moduleName+"不成功，请网点工作人员致电38828456。";

    /**
     * 渲染内容
     */
    function renderContent() {
        var _table = $("<table cellpadding='0' cellspacing='0'></table>").addClass("lee-table").appendTo(container);

        //render header
        var _hearder = $("<tr></tr>").appendTo(_table);
        for (var _headerIndex = 0; _headerIndex < headerObj.length; _headerIndex++) {
            var _headerOne = headerObj[_headerIndex];
            var _th = $("<th>" + _headerOne.text + "</th>").addClass("lee-header").appendTo(_hearder);

            if(_headerOne.cls){
                _th.addClass(_headerOne.cls);
            }
            if(_headerOne.style){
                _th.attr("style",_headerOne.style);
            }
        }

        //render content
        function insertCell(_row, _columnName, _rowJq,_columnIndex) {
            var _td  = $("<td class=\"lee-cell\"></td>");
            if(_columnIndex>0){
                _td.addClass("lee-cell-result");
            }
            _td.html(_row[_columnName]).appendTo(_rowJq);
        }

        for (var _rowIndex = 0; _rowIndex < rows.length; _rowIndex++) {
            var _row = rows[_rowIndex];
            var _rowJq = $("<tr></tr>").appendTo(_table);
            for (var _columnIndex = 0; _columnIndex < columns.length; _columnIndex++) {
                if (combineResultColumn) {
                    //第一行第二列需要处理成功或失败标志
                    if (_rowIndex == 0 && _columnIndex == 1) {
                        $("<td class=\"lee-cell lee-cell-result\"></td>").prop("rowspan", rows.length)
                            .html(resultFlagText).appendTo(_rowJq);
                    }
                    //非第一行的第二列直接跳过
                    else if (_columnIndex == 1) {
                        continue;
                    }
                    //非第二列则需要处理单元格内容
                    else {
                        insertCell(_row, columns[_columnIndex], _rowJq,_columnIndex);
                    }
                }
                else {
                    insertCell(_row, columns[_columnIndex], _rowJq,_columnIndex);
                }
            }
        }
    }

    renderContent();
}

/**
 * 检查读卡器读卡结果
 * @param results
 * @returns {boolean}
 */
function checkReadCardResult(results) {
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.jsonObject.flag != 1 || !result.jsonObject.result || result.jsonObject.result == "") {
            $.messager.alert("提示", result.jsonObject.errorMessage, "warning", null, 2000);
            return false;
        }
    }
    return true;
}
/**
 * 页面帮助类，可进行页面跳转，刷新操作
 * @type {{goToPage: goToPage, reloadPage: reloadPage, reloadPageNew: reloadPageNew, backToIndex: backToIndex}}
 */
jQuery.pageHelper = {
    goToPage: function (cmd, contextPath, delay) {
        setTimeout(this.backToIndex(cmd, contextPath), delay || 1500);
    },
    /**
     * 建议弃用
     * @param contextPath
     * @param delay_
     */
    reloadPage: function (contextPath, delay_) {
        var delay = 1500;
        if (delay_ != null && delay_ != 'undefined' && delay_ > 0) {
            delay = delay_;
        }
        setTimeout(this.backToIndex(jQuery.gzcard.getQueryString("cmd"), contextPath), delay);
    },
    reloadPageNew: function (delay) {
        setTimeout(function () {
            window.location.reload();
        }, delay || 1500);
    },
    backToIndex: function (cmd, contextPath) {
        //window.location.href = jQuery.gzcard.getHostUrl("/gzcard-web/model/page?cmd=") + cmd;
        window.location.href = jQuery.gzcard.getHostUrl(contextPath) + "/model/page?cmd=" + cmd;
    }
}