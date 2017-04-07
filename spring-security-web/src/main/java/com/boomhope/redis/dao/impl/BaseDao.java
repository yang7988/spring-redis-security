package com.boomhope.redis.dao.impl;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.apache.log4j.Logger;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import com.boomhope.redis.dao.IBaseDao;
import com.boomhope.redis.vo.DataGridModel;

public class BaseDao<T> implements IBaseDao<T>{
	protected static Logger log = Logger.getLogger(BaseDao.class);
	protected String className;
	
	@Autowired
	protected SqlSessionTemplate sqlSession;

	public BaseDao(Class<? extends T> c)
	{
		this.className = c.getName();
	}

	@Override
	public int insert(T t)
	{
		return sqlSession.insert(toSqlId(INSERT), t);
	}

	@Override
	public int update(T t)
	{
		return sqlSession.update(toSqlId(UPDATE), t);
	}

	@Override
	public int delete(Object pk)
	{
		return sqlSession.delete(toSqlId(DELETE), pk);
	}

	@Override
	public List<?> list(Map<String, Object> condition)
	{
		return sqlSession.selectList(toSqlId(LIST), condition);
	}
	
	@Override
	public int count(Map<String, Object> condition)
	{
		return sqlSession.selectOne(toSqlId(COUNT), condition);
	}

	@Override
	public DataGridModel pageQuery(Map<String, Object> condition, int pageNo, int pageSize)
	{
		return pageQuery(LIST, COUNT, condition, pageNo, pageSize);
	}
	
	@Override
	public DataGridModel pageQuery(String listSqlId, String countSqlId, Map<String, Object> condition, int pageNo, int pageSize)
	{
		int total = sqlSession.selectOne(toSqlId(countSqlId), condition);
		List<?> rows = this.sqlSession.selectList(toSqlId(listSqlId), condition, new RowBounds((pageNo - 1) * pageSize, pageSize));
		DataGridModel dataGridModel = new DataGridModel();
		dataGridModel.setTotal(total);
		dataGridModel.setRows(rows);
		return dataGridModel;
	}

	@Override
	public String genSeqNumber(String sequenceName)
	{
		return null;
	}

	@Override
	public String toSqlId(String id)
	{
		return className.concat(".").concat(id);
	}

	public SqlSessionTemplate getSqlSession()
	{
		return sqlSession;
	}

	public void setSqlSession(SqlSessionTemplate sqlSession)
	{
		this.sqlSession = sqlSession;
	}
}
