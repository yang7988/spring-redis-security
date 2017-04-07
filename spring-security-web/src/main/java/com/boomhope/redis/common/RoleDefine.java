package com.boomhope.redis.common;

/**
 * 角色类型定义
 * 
 * @author "徐阳"
 *
 */
public interface RoleDefine {
	/** 系统角色 */
	Integer TYPE_SYSTEM = 0;

	/** 客户化角色 */
	Integer TYPE_CUST = 1;

	/** 本部门 */
	Integer SCOPE_MYDEPT = 0;

	/** 本单位（公司） */
	Integer SCOPE_MYORGAN = 1;

	/** 本集团(顶级组织) */
	Integer SCOPE_MYGROUP = 2;

	/** 全局 */
	Integer SCOPE_ALL = 9;

	/** 管理员 */
	String ADMIN = "admin";
}
