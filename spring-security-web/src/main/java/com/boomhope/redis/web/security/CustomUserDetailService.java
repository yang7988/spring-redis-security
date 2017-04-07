package com.boomhope.redis.web.security;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.boomhope.redis.common.util.DateFormat;
import com.boomhope.redis.domain.Principal;
import com.boomhope.redis.service.IUserService;

@Service
public class CustomUserDetailService implements UserDetailsService{
	@Autowired
    private IUserService userService;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Principal principal = userService.findUserByUserName(username);
		if(principal == null) {
			throw new UsernameNotFoundException("用户不存在");
		}
		List<String> rolsList = userService.getRoleListByUserId(username);
		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
		if(authorities != null && authorities.size() > 0) {
			for(String role:rolsList) {
				GrantedAuthority authority = new SimpleGrantedAuthority(role);
				authorities.add(authority);
			}
		}
		UserInfo userInfo = new UserInfo(principal.getName(),principal.getPwd(),authorities, DateFormat.formatDate(new Date()));
		return userInfo;
	}
}
