package com.boomhope.redis.service;

import java.util.List;

import com.boomhope.redis.domain.Principal;

public interface IUserService {
    Principal findUserByUserName(String username);
    List<String> getRoleListByUserId(String username);
}
