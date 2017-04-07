//暂时使用ajax去后台获取当前登录ID，之后使用cookie保存
function getUserId(key){
    var text = $.ajax({
        url : key,
        dataType : "json",
        type : "get",
        async : false,
        cache : false
    }).responseText;
    
    if (!isNaN(text)){
        return text;
    }else{
        top.$.messager.alert("信息", text);
    }
}