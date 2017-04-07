//扩展了Date类，使用new Date().format('yyyy-MM-dd');得到字符串
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	// millisecond
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

//另类的日期转换，使用toDate('Nov 20, 2013 12:00:00 AM', 'yyyy-MM-dd');得到字符串
function toDate(str, format)
{
	try
	{
        if(str == "" || typeof  str ==='undefined')  {
            return "";
        }
		return new Date(Date.parse(str.replace(/-/g, "/"))).format(format);
	}
	catch(e)
	{
		return "";
	}
}

//根据身份证号得到年龄
function getAgeByIdNum(idNum)
{
	if(idNum&&idNum.length>0)
	{
		var bthDateStr = null;
		if(idNum.length==15)
		{
			//130503670401001
			bthDateStr = "19"+idNum.substring(6,12);
		}
		else if(idNum.length==18)
		{
			//xxxxxx190001013333
			bthDateStr = idNum.substring(6,14);
		}
		if(null == bthDateStr)
		{
			return -1;
		}
		var by = bthDateStr.substring(0, 4);
		var bm = bthDateStr.substring(4, 6);
		var bd = bthDateStr.substring(6);
		var bthDate = new Date(by,bm-1,bd);
		var now = new Date();
		var age = now.getFullYear() - bthDate.getFullYear();
		var dm = now.getMonth()-bthDate.getMonth();
		if(dm<0)
		{
			age--;
		}
		else if(dm==0)
		{
			var dd = now.getDate()-bthDate.getDate();
			if(dd<0)
			{
				age--;
			}
		}
		return age;
	}
	return -1;
}