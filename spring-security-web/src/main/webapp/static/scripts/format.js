/**
 * 请假类型
 * @param val
 * @param row
 * @returns {String}
 */
function formatLeaveState(val, row) {
	if (val == '0') {
		return '初始';
	} else if (val == '1') {
		return '审批';
	} else if (val == '2') {
		return '驳回';
	} else if (val == '3') {
		return '撤销';
	} else if (val == '4') {
		return '成功';
	}
	return '';
}

/**
 * 请假类型
 * @param val
 * @param row
 * @returns {String}
 */
function formatProcessDefinitionState(val, row) {
	if (val == 'false' || val == false) {
		return '正常';
	} else if (val == 'true' || val == true) {
		return '挂起';
	} 
	return '';
}
function gender(val, row) {
	if (val == '0') {
		return '女';
	} else if (val == '1') {
		return '男';
	}
}
function opLevel(val,row)
{
	if (val == '6')
	{
		return 'VIP';
	}
	return val;
	
}