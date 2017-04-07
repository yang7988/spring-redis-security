package com.boomhope.redis.dao;

import java.util.List;
import java.util.Map;

import com.boomhope.redis.vo.DataGridModel;

public interface IBaseDao<T> {
	String INSERT = "insert";
	String UPDATE = "update";
	String DELETE = "delete";
	String LIST = "list";
	String COUNT = "count";
	String GETBYPK = "getByPK";

	/**
	 * 插入记录
	 * 
	 * @param t
	 * @return
	 */
	int insert(T t);

	/**
	 * 修改记录
	 * 
	 * @param t
	 * @return
	 */
	int update(T t);

	/**
	 * 删除记录
	 * 
	 * @param t
	 * @return
	 */
	int delete(Object pk);

	/**
	 * 查询列表
	 * 
	 * @param condition
	 *            查询条件
	 * @return
	 */
	List<?> list(Map<String, Object> condition);

	/**
	 * 获取数量
	 * 
	 * @param condition
	 *            查询条件
	 * @return
	 */
	int count(Map<String, Object> condition);

	/**
	 * 查询列表
	 * 
	 * @param condition
	 *            查询条件
	 * @param pageNo
	 *            页码
	 * @param pageSize
	 *            每页数量
	 * @return
	 */
	DataGridModel pageQuery(Map<String, Object> condition, int pageNo, int pageSize);

	/**
	 * 查询列表
	 * @param listSqlId
	 * @param countSqlId
	 * @param condition
	 * @param pageNo
	 * @param pageSize
	 * @return
	 */
	DataGridModel pageQuery(String listSqlId, String countSqlId, Map<String, Object> condition, int pageNo, int pageSize);

	/**
	 * 序列取值
	 * 
	 * @param sequenceName
	 * @return
	 */
	String genSeqNumber(String sequenceName);

	/**
	 * 拼装sqlid
	 * @param id
	 * @return
	 */
	String toSqlId(String id);
}
