//通过卡类型代码找卡类型名称
function getCardTypeName(cardType) {
    if (cardType == "01")
    {
        return "普通蓝卡";
    }
	else if(cardType=="02")
	{
		return "普通红卡";
	}
	else if(cardType=="03")
	{
		return "金融蓝卡";
	}
	else if(cardType=="04")
	{
		return "普通黄卡";
	}
	else if(cardType=="05")
	{
		return "优待黄卡";
	}
	else if(cardType=="06")
	{
		return "普通优待黄卡";
	}
	else if(cardType=="07")
	{
		return "金融优待蓝卡";
	}
	else if(cardType=="08")
	{
		return "金融优待黄卡";
	}
    else {
        return "";
    }
}

//通过卡状态代码找卡状态名称
function getCardStateName(cardState) {
    if (cardState == "0")//正常使用-0
    {
        return "正常使用";
    }
    else if (cardState == "1")//书面挂失-1
    {
        return "书面挂失";
    }
    else if (cardState == "2")//口头挂失-2
    {
        return "口头挂失";
    }
    else if (cardState == "3")//卡注销-3
    {
        return "卡注销";
    }
    else if (cardState == "4")//换卡-4
    {
        return "换卡";
    }
    else if (cardState == "5")//补卡-5
    {
        return "补卡";
    }
    else if (cardState == "6")//待补换状态-6
    {
        return "待补换状态";
    }
    else {
        return "";
    }
}
