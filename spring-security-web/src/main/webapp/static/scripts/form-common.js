﻿function adjustElemHeight(a,b){if(isArray(a)&&2==a.length){var c=a[0];b=a[1],isNaN(b)&&(b=0),$(c).height($(document.body).outerHeight()-b)}else a&&(isNaN(b)&&(b=0),$(a).height($(document.body).outerHeight()-b))}function afterPageLoadComplete(a){for(var b=0;b<a.length;b++){var c=a[b];c.name.call(this,c.options)}}function resetLoadingMask(){0==$("body").children("loading-outer").length&&($("<div id='loading-outer'  class='ajax-loading-mask'></div>").appendTo("body"),$("<div class='loading-icon' id='loading'></div>").appendTo("body")),$("#loading-outer").css({width:$(document.body).outerWidth(),height:$(document.body).outerHeight(),display:"none"}),$(".loading-icon").css({left:$(document.body).outerWidth()/2-$("#loading-outer .loading-icon").width()/2,top:$(document.body).outerHeight()/2-$("#loading-outer .loading-icon").height()/2,display:"none"}),$("#loading-outer").ajaxStart(function(){$(this).show(),$("#loading").show()}),$("#loading-outer").ajaxComplete(function(){$(this).hide(),$("#loading").hide()})}function checkBrowser(){return navigator.userAgent.indexOf("IE")<0?($.messager.alert("\u63d0\u793a","\u8bf7\u4f7f\u7528IE\u5185\u6838\u7684\u6d4f\u89c8\u5668\uff01","warning"),!1):!0}function printBill(a,b,c,d,e,f,g){if(!checkBrowser())return!1;if(!b||!c)return!1;try{var h=getBill({billType:b,pk:c},d,f,g),i=f+c+".htm";return 1==h.flag?(i.indexOf(":")>1&&(i="file://"+i),e.DoHtmlPrint(i),!0):!1}catch(j){return!1}}function getBill(a,b,c,d){var e=$.gzcard.getHostUrl(d);b.ServerUrl=e+"/file/download",b.Params="billType="+a.billType+"&pk="+a.pk,b.Type="202",b.BlockSize="34200",b.FileName=a.pk+".htm",b.SetProgressBar(!1),b.FileSavePath=c;var f=b.DownLoad();return JSON.parse(f)}function getPrintType(a){var b={printType:void 0};return $(a+" input[name=printType]").each(function(){this.checked&&(b.printType=this.value)}),b}function printReceipt(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){var u=$.gzcard.getHostUrl(a),v={};v.cardJnlNo=e,v.name=f,v.idNum=g,v.trxName=h,v.cardTypes=i,v.acceptDate=j,v.fullName=l,v.payType=m,v.payNo=n,v.payCount=o,v.isPrintNotice="0",k&&(v.isPrintNotice="1"),p&&""!=p?(v.isPrintCardInfo="1",v.printInfoList_temp=p):v.isPrintCardInfo="0",q&&(v.idType=q);var w=u+"/model/process?cmd=103220&v="+Math.random();s&&(w=u+"/thirdparty/process?cmd="+s+"&"+t+"&v="+Math.random()),$.gzcard.ajax({url:w,method:"POST",data:v,async:!1,success:function(a){if(1==a)if(downloadReceipt(b,u,e,d)){var h="file://"+d+e+".htm";c.DoHtmlPrint(h),"undefined"!==typeof r&&r.call(this)}else $.messager.alert("\u63d0\u793a","\u83b7\u53d6\u56de\u6267\u5931\u8d25\uff01","warning");else $.messager.alert("\u63d0\u793a","\u751f\u6210\u56de\u6267\u5931\u8d25\uff01","warning")},error:function(){$.messager.alert("\u63d0\u793a","\u751f\u6210\u56de\u6267\u53d1\u751f\u5f02\u5e38\uff01","500")}})}function afterPrintReceipt(){$("#finishBusiness").show()}function downloadReceipt(a,b,c,d){if(!checkBrowser())return!1;a.ServerUrl=b+"/file/download",a.Params="cardJnlNo="+c,a.Type="210",a.BlockSize="34200",a.FileName=c+".htm",a.SetProgressBar(!1),a.FileSavePath=d;var e=JSON.parse(a.DownLoad());if(e){var f=e.flag;if(1==f)return!0}return!1}function downloadUserPhoto(a,b,c,d,e,f){if(!checkBrowser())return!1;var g=$.gzcard.getHostUrl(f);b.ServerUrl=g+"/file/download",b.Params=a,b.Type=e,b.BlockSize="34200",b.FileName=c,b.SetProgressBar(!1),b.FileSavePath=d;var h=JSON.parse(b.DownLoad());if(h){var j=h.flag;if(1==j)return d+c;0==j&&$.messager.alert("\u63d0\u793a","\u793e\u4fdd\uff08\u5e02\u6c11\uff09\u5361\u76f8\u7247\u4e0b\u8f7d\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5\u3002","warning")}}function getSysDate(a,b){var c=$.gzcard.getHostUrl(a),d={};b&&null!=b&&"undefined"!=b&&(d.format=b);var e="";return $.gzcard.ajax({url:c+"/model/process?cmd=102058&v="+Math.random(),method:"POST",data:d,async:!1,success:function(a){a?e=a:null!=top.$.messager?top.$.messager.alert("\u63d0\u793a","\u83b7\u53d6\u7cfb\u7edf\u65f6\u95f4\u5931\u8d25\uff01","warning",null,4e3):$.messager.alert("\u63d0\u793a","\u83b7\u53d6\u7cfb\u7edf\u65f6\u95f4\u5931\u8d25\uff01","warning",null,4e3)},error:function(){null!=top.$.messager?top.$.messager.alert("\u63d0\u793a","\u83b7\u53d6\u7cfb\u7edf\u65f6\u95f4\u5f02\u5e38\uff01","warning",null,4e3):$.messager.alert("\u63d0\u793a","\u83b7\u53d6\u7cfb\u7edf\u65f6\u95f4\u5f02\u5e38\uff01","warning",null,4e3)}}),e}function afterPageLoad(a,b){function c(a){var b=0;if(a||"undefined"===typeof a){if(0==$("ul.anchor").length)return void alert("\u6ca1\u6709\u5b9a\u4e49\u5bfc\u822a\uff01");b=$("ul.anchor").width()}else b=$("body").width();var c=$("ul.anchor li:last-child a").attr("href"),d=b/2-($("#step-1").width()+$(".actionBar").width())/2,e=b/2-$(c).width()/2;d<0&&(d=0),e<0&&(e=0),$("#step-1").css("margin-left",d+"px"),"block"==$("ul.anchor").css("display")&&$(c).css("margin-left",e+"px"),$(".first-step-tips").length>0&&(d=b/2-$(".first-step-tips").width()/2,d<0&&(d=0),$(".first-step-tips").css("left",d+"px"))}a&&c(b)}function setStepsStyle(a,b){a||alert("\u8bf7\u8bbe\u7f6e\u6b65\u9aa4\u6570\u91cf");var c="width: 520px;margin: 100px auto 0 auto;",e="width:750px;margin-top: 5px;",f="width:750px;margin-top: 5px;";switch(b&&b.length>0&&b[0]&&(c=b[0]),b&&3==b.length&&b[2]&&(e=b[2]),b&&4==b.length&&b[3]&&(f=b[3]),$("#step-1").attr("style",c),a){case 2:break;case 3:$("#step-3").attr("style",e);break;case 4:$("#step-4").attr("style",f)}}function renderStepsHtml(a,b,c,d){$("#step-1").formhelper({}),$("#step-2,#step-3").formhelper($.extend({},{extraStyle:"margin: 10px 0 0 0;"},d)),a&&$("#step-1").formhelper("loadRows",a),b&&$("#step-2").formhelper("loadRows",b),c&&$("#step-3").formhelper("loadRows",c)}function renderSteps(a,b,c,d){renderStepsHtml(a,b,c,d),setStepsStyle(4)}function backSetProxyInfo(){$("#proxyIdNum_temp").val($("#proxyIdNum").val()),$("#proxyIdType_temp").combobox("setValue",$("#proxyIdType").combobox("getValue")),$("#proxyName_temp").val($("#proxyName").val()),$("#proxyPhoneNum_temp").val($("#proxyPhoneNum").val()),$("#proxyAddress_temp").val($("#proxyAddress").val()),$("#proxyGender_temp").combobox("setValue",$("#proxyGender").combobox("getValue"))}function setProxyInfo(){$("#proxyIdNum").val($("#proxyIdNum_temp").val()),$("#proxyIdType").combobox("setValue",$("#proxyIdType_temp").combobox("getValue")),$("#proxyName").val($("#proxyName_temp").val()),$("#proxyGender").combobox("setValue",$("#proxyGender_temp").combobox("getValue")),$("#proxyPhoneNum").val($("#proxyPhoneNum_temp").val()),$("#proxyAddress").val($("#proxyAddress_temp").val())}function initCardIcon(){var a=$("<div class='card-img-outer'></div>").appendTo($("body"));a.css({position:"absolute",top:"0",left:"0",height:"212px",width:"335px",display:"none","z-index":99999,background:"no-repeat 0 0"}),$(".card-icon").each(function(){$(this).bind("mouseenter",function(){var b=window.event.x,c=window.event.y,d=$(this).width(),e=$(this).height(),f=$(this).offset().left,g=$(this).offset().top,h=$(".card-img-outer");b=f+d,c=$(this).offset().top,$("body").width()-b<h.width()&&(b=f-h.width()-2),$("body").height()-c<h.height()&&(c=g-h.height()-2+e),h.css({top:c,left:b,"background-image":"url("+$(this).attr("timg")+")"}).show()}).bind("mouseout",function(){$(".card-img-outer").hide()})})}function onNextStep(a){a=window.event||a,13==a.keyCode&&$(".button-next",$("#wizard")).click()}function isYiDaiCard(a){for(var c=$("#cardGrid").datagrid("getChecked"),d=0;d<c.length;d++){var e=c[d];if(a==e.cardType&&"1"==e.mainCard&&"0"==e.financial&&(null==e.medBank||""==e.medBank))return"1"}return"0"}function chooseMedBanks(){var a=0,b=$("#cardGrid").datagrid("getSelections");return $.each(b,function(b,c){"1"!=c.mainCard||"0"!=c.financial||null!=c.medBank&&""!=c.medBank||a++}),a>=1?($("#medBank_step2").combobox("enable"),$("#medAcct_step2").attr("disabled",!1),$(".med-relation").show()):($("#medBank_step2").combobox("disable"),$("#medAcct_step2").attr("disabled",!0),$(".med-relation").hide(),$("#medBank_step2").combobox("setValue",""),$("#medAcct_step2").val("")),a}function chooseMedBank(a){for(var c=chooseMedBanks(),d=$("#cardGrid").datagrid("getChecked"),e=0;e<d.length;e++){var f=d[e];a==f.cardType&&("1"!=f.mainCard||"0"!=f.financial||null!=f.medBank&&""!=f.medBank||c++)}c>=1?($("#medBank_step2").combobox("enable"),$("#medAcct_step2").attr("disabled",!1),$(".med-relation").show()):($("#medBank_step2").combobox("disable"),$("#medAcct_step2").attr("disabled",!0),$(".med-relation").hide(),$("#medBank_step2").combobox("setValue",""),$("#medAcct_step2").val(""))}function stopBubble(a){a.stopPropagation?a.stopPropagation():window.event&&(window.event.cancelBubble=!0)}function renderHandleResult(a,b,c){function k(){function l(a,b,c,d){var e=$('<td class="lee-cell"></td>');d>0&&e.addClass("lee-cell-result"),e.html(a[b]).appendTo(c)}for(var a=$("<table cellpadding='0' cellspacing='0'></table>").addClass("lee-table").appendTo(b),d=$("<tr></tr>").appendTo(a),e=0;e<f.length;e++){var h=f[e],k=$("<th>"+h.text+"</th>").addClass("lee-header").appendTo(d);h.cls&&k.addClass(h.cls),h.style&&k.attr("style",h.style)}for(var m=0;m<i.length;m++)for(var n=i[m],o=$("<tr></tr>").appendTo(a),p=0;p<g.length;p++)if(c)if(0==m&&1==p)$('<td class="lee-cell lee-cell-result"></td>').prop("rowspan",i.length).html(j).appendTo(o);else{if(1==p)continue;l(n,g[p],o,p)}else l(n,g[p],o,p)}if(!b||!a)return void alert("\u8bf7\u6b63\u786e\u914d\u7f6e\u53c2\u6570\u3002");var d=a.moduleName,e=a.handleResult,f=a.header,g=a.columns,h=e.result,i=e.resultList,j="1"==h?d+"\u6210\u529f":d+"\u4e0d\u6210\u529f\uff0c\u8bf7\u7f51\u70b9\u5de5\u4f5c\u4eba\u5458\u81f4\u753538828456\u3002";k()}function checkReadCardResult(a){for(var b=0;b<a.length;b++){var c=a[b];if(1!=c.jsonObject.flag||!c.jsonObject.result||""==c.jsonObject.result)return $.messager.alert("\u63d0\u793a",c.jsonObject.errorMessage,"warning",null,2e3),!1}return!0}var activateFlag=[{value:"",text:""},{value:"0",text:"\u672a\u6fc0\u6d3b"},{value:"1",text:"\u5df2\u6fc0\u6d3b"}],idType=void 0,gender=void 0,cardState=[{text:"",value:""},{text:"\u6b63\u5e38\u4f7f\u7528",value:"0"},{text:"\u4e66\u9762\u6302\u5931",value:"1"},{text:"\u53e3\u5934\u6302\u5931",value:"2"},{text:"\u5361\u6ce8\u9500",value:"3"},{text:"\u6362\u5361",value:"4"},{text:"\u8865\u5361",value:"5"},{text:"\u5f85\u8865\u6362",value:"6"}],cardType=[{value:"",text:""},{value:"01",text:"\u666e\u901a\u84dd\u5361"},{value:"02",text:"\u666e\u901a\u7ea2\u5361"},{value:"03",text:"\u91d1\u878d\u84dd\u5361"},{value:"04",text:"\u666e\u901a\u9ec4\u5361"},{value:"05",text:"\u4f18\u5f85\u9ec4\u5361"},{value:"06",text:"\u666e\u901a\u4f18\u5f85\u9ec4\u5361"},{value:"07",text:"\u91d1\u878d\u4f18\u5f85\u84dd\u5361"},{value:"08",text:"\u91d1\u878d\u4f18\u5f85\u9ec4\u5361"}],abnormalType=[{text:"",value:""},{text:"\u5361\u5546\u5236\u5361\u5bfc\u81f4\u5361\u7247\u8d28\u91cf\u95ee\u9898",value:"0"},{text:"\u4fe1\u606f\u91c7\u96c6\u5bfc\u81f4\u7684\u5361\u9762\u4fe1\u606f\u9519\u8bef",value:"1"}],dealState=[{text:"",value:""},{text:"\u5f85\u5904\u7406",value:"0"},{text:"\u5df2\u5904\u7406",value:"1"}],isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)},getEncryptedPhoneNum=function(a){return a&&11==a.length?"*******"+a.substr(7,4):""},getTelPhoneNum=function(a){return a&&11==a.length?"*******"+a.substr(7,4):a&&8==a.length?"****"+a.substr(4,4):a&&7==a.length?"***"+a.substr(3,4):""};jQuery.pageHelper={goToPage:function(a,b,c){setTimeout(this.backToIndex(a,b),c||1500)},reloadPage:function(a,b){var c=1500;null!=b&&"undefined"!=b&&b>0&&(c=b),setTimeout(this.backToIndex(jQuery.gzcard.getQueryString("cmd"),a),c)},reloadPageNew:function(a){setTimeout(function(){window.location.reload()},a||1500)},backToIndex:function(a,b){window.location.href=jQuery.gzcard.getHostUrl(b)+"/model/page?cmd="+a}};