package com.boomhope.redis.common;

/**
 * 主体类型常量定义接口
 * 
 * @author "徐阳"
 *
 */
public interface PrincipalDefine {
	Integer TYPE_PERSON = 0x10;

	/** 职位 */
	Integer TYPE_POSITION = 0x20;

	/** 部门 */
	Integer TYPE_DEPT = 0x30;

	/** 组织 */
	Integer TYPE_ORGAN = 0x40;

	/** 顶级组织 */
	Integer TYPE_TOP_ORGAN = 0x140;
}
