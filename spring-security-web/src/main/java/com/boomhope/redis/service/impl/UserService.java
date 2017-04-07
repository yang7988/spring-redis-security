package com.boomhope.redis.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boomhope.redis.dao.IUserDao;
import com.boomhope.redis.domain.Principal;
import com.boomhope.redis.service.IUserService;

@Service
public class UserService implements IUserService{
	@Autowired
    private IUserDao userDao;
	
	@Override
	public Principal findUserByUserName(String username) {
		return userDao.getUserByUserName(username);
	}

	@Override
	public List<String> getRoleListByUserId(String username) {
		return userDao.getUserRolesByName(username);
	}

}
