package com.boomhope.redis.web.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class UserInfo extends User{
	private static final long serialVersionUID = 1L;
	private String loginTime;
	public UserInfo(String username, String password, boolean enabled, boolean accountNonExpired,
			boolean credentialsNonExpired, boolean accountNonLocked,
			Collection<? extends GrantedAuthority> authorities) {
		super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
	}
	public String getLoginTime() {
		return loginTime;
	}
	
	public UserInfo(String username, String password, Collection<? extends GrantedAuthority> authorities,String loginTime) {
		super(username, password, authorities);
		this.loginTime = loginTime;
	}
	public void setLoginTime(String loginTime) {
		this.loginTime = loginTime;
	}

}
