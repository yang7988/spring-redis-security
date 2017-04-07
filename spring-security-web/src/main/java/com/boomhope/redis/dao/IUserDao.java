package com.boomhope.redis.dao;

import java.util.List;

import com.boomhope.redis.domain.Principal;

public interface IUserDao extends IBaseDao<Principal>{
    public static String GETUSERBYNAME = "getUserByName";
	public Principal getUserByUserName(String username);

	public List<String> getUserRolesByName(String username);

}
