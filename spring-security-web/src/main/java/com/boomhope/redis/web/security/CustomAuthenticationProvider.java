package com.boomhope.redis.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider{
	@Autowired
    private CustomUserDetailService customUserDetailService;
	
	@Override
	protected void additionalAuthenticationChecks(UserDetails userDetails,
			UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
	}

	@Override
	protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication)
			throws AuthenticationException {
		UserDetails loadedUser;
		try
		{
			loadedUser = customUserDetailService.loadUserByUsername(username);
		}
		catch (UsernameNotFoundException notFound)
		{
			logger.error("用户不存在：" + username);
			throw notFound;
		}
		catch (Exception repositoryProblem)
		{
			repositoryProblem.printStackTrace();
			throw new AuthenticationServiceException(repositoryProblem.getMessage(), repositoryProblem);
		}
		if (loadedUser == null)
		{
			throw new AuthenticationServiceException("UserDetailsService returned null, which is an interface contract violation");
		}
		// 此处校验密码
		if (authentication.getCredentials() == null)
		{
			logger.error("校验异常：密码为空");
			throw new BadCredentialsException("校验异常：密码为空");
		}
		String presentedPassword = authentication.getCredentials().toString();
		if (!loadedUser.getPassword().equals(presentedPassword))
		{
			logger.error("校验异常： 密码错误");
			throw new BadCredentialsException("校验异常： 密码错误");
		}
		authentication.setDetails(loadedUser);
		return loadedUser;
	}
}
