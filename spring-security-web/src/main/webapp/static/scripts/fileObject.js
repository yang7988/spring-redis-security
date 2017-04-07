jQuery.extend({
    read : function(dir, name){
        var filepath = dir + "/" + name;
        var fso = new ActiveXObject("Scripting.FileSystemObject"); 
        var file = fso.OpenTextFile(filepath,1); 
        var content = ""; 
        while (!file.AtEndOfStream) 
            content += file.ReadLine()+"\n"; 
        file.Close(); 
        return content;	
    },
    
    write : function (dir, name, filecontent){
        //浏览器类型
        var isIE = (navigator.userAgent.indexOf("MSIE") != -1);
        var isFireFox = (navigator.userAgent.indexOf("Firefox") != -1);
        var isWindows = (navigator.userAgent.indexOf("Windows ") != -1);
        
        //根据不同浏览器做不同的保存文本API
        var filepath;
        var from,to;
        if (isWindows){
            from = "/";
            to = "\\";
        }else{
            from = "\\";
            to = "/";
        }
        while(dir.indexOf(from) != -1){
            dir = dir.replace(from, to);
        }
        
        //IE使用ADODB.Stream
        if (isIE){
            filepath = dir + "\\" + name;
            var fso;
            try{
                fso = new ActiveXObject("Scripting.FileSystemObject");
            }
            catch (e){
                //被浏览器拒绝！\n请将IE选项'对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本'设置为'启用'
                $.messager.alert("信息", "创建Scripting.FileSystemObject失败！请参考帮助页面配置IE选项！");
                return false;
            }
            
            var data = dir.split("\\", -1);
            var parentFolder = '';
            $.each(data, function(index, value){
                if (index > 0){
                    var folder = parentFolder + "\\" + value;
                    if (!fso.FolderExists(folder)){
                        fso.CreateFolder(folder);
                    }
                    parentFolder = folder;
                }else{
                    parentFolder = value;
                }
            });
            
            try{
                var stream = new ActiveXObject("ADODB.Stream");
            }catch(e){
                //HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Internet Explorer\ActiveX Compatibility\{00000566-0000-0010-8000-00AA006D2EA4
                //Compatibility Flags设置为0
                $.messager.alert("信息", "创建ADODB.Stream失败！请参考帮助页面配置IE选项！");
                return false;
            }
            stream.LineSeparator=13;
            stream.Type=2;
            stream.Mode=3;
            stream.Charset="UTF-8";
            stream.Open();
            stream.WriteText(filecontent);
            stream.SaveToFile(filepath,2);
            stream.Close();
            return true;
        }else if (isFireFox){
            filepath = dir + "/" + name;
            try {  
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
            } catch (e) {
                //请在浏览器地址栏输入'about:config'并将'signed.applets.codebase_principal_support'设置为'true'
                $.messager.alert("信息", "保存操作被Firefox浏览器拒绝！请参考帮助页面配置Firefox选项！");  
                return false;
            }  
            var file = Components.classes["@mozilla.org/file/local;1"]
            .createInstance(Components.interfaces.nsILocalFile); 
            file.initWithPath( filepath );  
            if ( file.exists() == false ) {  
                file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );  
            }  
            var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]  
            .createInstance( Components.interfaces.nsIFileOutputStream );  
              
            outputStream.init( file, 0x04 | 0x08 | 0x20, 420, 0 );  
              
            var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]  
            .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);  
            converter.charset = 'UTF-8';
              
            var convSource = converter.ConvertFromUnicode(filecontent);  
            outputStream.write( convSource, convSource.length );  
            outputStream.close(); 
            return true;
        }else{
            $.messager.alert("信息","保存失败，未支持的浏览器。");
            return false;
        }
    }  
})

