//以光标为分界的生僻字备份
var gCommonWordArrayByCaret = [];
var imageAngle = 0;
function rotateImage($image, clockwise) {
    var imageTop = 0;
    imageAngle = clockwise ? imageAngle + 90 : imageAngle - 90;
    $image.stopRotate();
    if ($image.height() < $image.width()) {
        if (Math.abs(imageAngle) % 180 == 90) {
            var vTop = ( $image.width() - $image.height()) / 2;
            imageTop = $image.css("top");
            $image.animate({top: vTop}, "fast");
            //$image.css("top", vTop);
        } else {
            //$image.css("top", imageTop);
            $image.animate({top: imageTop}, "fast");
        }
    }
    $image.rotate({
        angle: $image.getRotateAngle()[0],
        animateTo: imageAngle,
        callback: function (e) {

        }
    });
}

function zoomImage($image, type) {
    var vHeight = $image.height();
    var vWidth = $image.width();

    switch (type) {
        case -1:
        {
            vHeight -= vHeight * 0.1;
            vWidth -= vWidth * 0.1;
            $image.height(vHeight);
            $image.width(vWidth);
            break;
        }

        case 1:
        {
            vHeight += vHeight * 0.1;
            vWidth += vWidth * 0.1;
            $image.height(vHeight);
            $image.width(vWidth);
            break;
        }

        default:
        {
            $("#pImage").css("width", "");
            $("#pImage").css("height", "");
        }
    }
}

function initImage($image) {

    $image.attr("src", "");
    $image.css("top", "");
    zoomImage($image, 0);
    zoomImage($image, 0);
    $image.rotate(0);
    imageAngle = 0;
}

function ajaxGet(url, successHandler, errorHandler) {
    $.ajax({
        url: url,
        type: "get",
        cache: false,
        success: function (ret) {
            if ($.isFunction(successHandler))
                successHandler(ret);
        },
        error: function () {
            if ($.isFunction(errorHandler))
                errorHandler();
            else {
                top.$.messager.alert("警告", "系统遇到错误!请重试或者联系相关技术人员！", "warn");
            }
        }

    });
}

function ajaxPost(url, data, successHandler, errorHandler) {
    $.ajax({
        url: url,
        type: "post",
        cache: false,
        data: $.serialize(data),
        success: function (ret) {
            if ($.isFunction(successHandler))
                successHandler(ret);
        },
        error: function () {
            if ($.isFunction(errorHandler))
                errorHandler();
            else {
                top.$.messager.alert("错误", "系统遇到错误!请重试或者联系相关技术人员！", "error");
            }
        }
    });
}

//格式化下拉框文字长度
function formatCombox(row) {
    var defaultLen = 8;

    var len = row['text'].length;
    if (len > defaultLen) {
        return row['text'].substr(0, defaultLen) + "...";
    }

    return row['text'];
}

function formatNumber(val, row) {
    return formatNumber_(val, ',');
}

function formatNumber_(number, groupSeparator) {
    if (!number) {
        return number;
    }
    number = number + "";
    var s1 = number, s2 = "";
    var dpos = number.indexOf(".");
    if (dpos >= 0) {
        s1 = number.substring(0, dpos);
        s2 = number.substring(dpos + 1, _446.length);
    }
    if (!groupSeparator) {
        groupSeparator = ',';
    }

    if (groupSeparator) {

        var p = /(\d+)(\d{3})/;
        while (p.test(s1)) {
            s1 = s1.replace(p, "$1" + groupSeparator + "$2");
        }
    }
    if (s2) {
        return s1 + s2;
    }
    else {
        return s1;
    }
}

//日期格式化
function dateformat(val, row) {
    if (val == null) {
        return '';
    }
    return val.substring("0", "10");
}
// 日期比较 
function compareDate(s, e) {
    var sArray = s.split("-");
    var sDate = new Date(sArray[0], sArray[1], sArray[2]);
    var startTime = sDate.getTime();
    var eArray = e.split("-");
    var eDate = new Date(eArray[0], eArray[1], eArray[2]);
    var endTime = eDate.getTime();
    if (startTime > endTime) {
        $.messager.alert("很抱歉", "开始日期不能大于结束日期", "warning", null, 20000);
        return false;
    }
    return true;
}

//将页面字符串类型数据转换为JSON格式
function strToJson(str) {
    var json = eval('(' + str + ')');
    return json;
}

//队列调用JS方法（芯片内容检测中卡片结构检测时调用）
var KEQueue = function (data) {
    this.staticQueue = [];
    this.asyncQueue = [];
    this.status = "running";
    this.result = data;
    return this;
};
KEQueue.prototype = {
    next: function (callback, async) {//添加一个方法
        if (!!async) {
            this.staticQueue.push("async");//如果是异步方法（会有延时效果的方法）就添加标识
            this.asyncQueue.push(callback);//延时方法的存放数组
        } else {
            this.staticQueue.push(callback);//直接触发的方法的存放数组
        }
        return this;
    },
    wait: function (delay) {//延迟执行序列
        var self = this;
        this.next(function () {//模拟添加一个延时方法
            setTimeout(function () {
                self.wake.call(self);
            }, delay);
        }, true);
        return this;
    },
    go: function () {//按事件添加的先后顺序依次执行事件
        if (this.staticQueue.length == 0) return;

        while (this.staticQueue.length > 0) {
            if (this.status === "sleep") return;

            var fun = this.staticQueue.shift();
            if (typeof fun == "string" && fun == "async") {
                fun = this.asyncQueue.shift();
                fun(this.result);
                this.sleep();
            } else {
                fun(this.result);
            }
        }
    },
    sleep: function () {
        this.status = "sleep";
    },
    wake: function () {
        this.status = "running";
        this.go();
    }
};

//去除数字格式化并将其转化为int型
function removeFormat(val) {
    var str = val;
    var reg = new RegExp(',', 'g');
    str = str.replace(reg, '');
    var data = parseInt(str);
    return data;
}

//是,否转换
function formatIf(val, row) {
    if (val == '0') {
        return '否';
    }
    else if (val == '1') {
        return '是';
    }
}

//状态转换
function formatState(val, row) {
    if (val == '0') {
        return '注销';
    }
    else if (val == '1') {
        return '正常';
    }
    else if (val == '2') {
        return '停用';
    }
}


//判断当前浏览器是否为IE浏览器
function isIEExplorer() {
    //TODO  检查浏览器
    if (navigator.userAgent.indexOf("IE") < 0) {
        $.messager.alert("提示", "请使用IE内核的浏览器！", "warning");
        return false;
    }
    return true;
}

//是否为身份证号
function isIdentity(value) {
    if (value.length == 18 && 18 != value.length) return false;
    var number = value.toLowerCase();
    var d, sum = 0, v = '10x98765432', w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], a = '11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91';
    var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/);
    if (re == null || a.indexOf(re[1]) < 0) return false;
    if (re[2].length == 9) {
        number = number.substr(0, 6) + '19' + number.substr(6);
        d = ['19' + re[4], re[5], re[6]].join('-');
    } else d = [re[9], re[10], re[11]].join('-');
    if (!isDateTime.call(d, 'yyyy-MM-dd')) return false;
    for (var i = 0; i < 17; i++) sum += number.charAt(i) * w[i];
    return (re[2].length == 9 || number.charAt(17) == v.charAt(sum % 11));
}

//初始化按钮权限
function checkBtns() {
    if (authority != null && authority.length > 0) {
        for (var i = 0; i < authority.length; i++) {
            if (typeof btnTbs_cmd !== 'undefined') {
                for (var j = 0; j < btnTbs_cmd.length; j++) {
                    if (btnTbs_cmd[j] == authority[i]) {
                        btnTbs_show[j] = true;
                    }
                }
            }
            if (typeof btnDiv_cmd !== 'undefined') {
                for (j = 0; j < btnDiv_cmd.length; j++) {
                    if (btnDiv_cmd[j] == authority[i]) {
                        btnDiv_show[j] = true;
                        showDiv = true;
                    }
                }
            }
        }
    }
    if (typeof btnTbs_cmd !== 'undefined') {
        for (i = 0; i < btnTbs_cmd.length; i++) {
            if (btnTbs_show[i]) {
                $("#" + btnTbs_id[i]).show();
            }
            else {
                $("#" + btnTbs_id[i]).hide();
            }
        }
    }
}

//判断是否显示div中的按钮
function checkActionDiv() {
    if (!showDiv) {
        return false;
    }
    var tmp = false;
    for (var i = 0; i < btnDiv_show.length; i++) {
        if (btnDiv_show[i]) {
            var display = $("#" + btnDiv_id[i]).css("display");
            if (!display || display == 'inline-block') {
                tmp = true;
            }
        }
        else {
            $("#" + btnDiv_id[i]).hide();
        }
    }
    return tmp;
}
/**
 * liyue
 * 扩展重置表单的功能
 */
jQuery.fn.extend({
    resetForm: function () {
        this.get(0).reset();
        this.find("input[type=hidden]").val('');
    }
});