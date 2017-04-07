package com.boomhope.redis.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.boomhope.redis.dao.IUserDao;
import com.boomhope.redis.domain.Principal;

@Repository
public class UserDao extends BaseDao<Principal> implements IUserDao{
	public UserDao() {super(Principal.class);}

	@Override
	public Principal getUserByUserName(String username) {
		return this.sqlSession.selectOne(toSqlId(GETUSERBYNAME),username);
	}

	@Override
	public List<String> getUserRolesByName(String username) {
		return null;
	}

}
