package com.boomhope.redis.web.security;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Service;
public class LoginAuthenticationFilter extends UsernamePasswordAuthenticationFilter
{
	public static final String SPRING_SECURITY_FORM_USERNAME_KEY = "username";
	public static final String SPRING_SECURITY_FORM_PASSWORD_KEY = "password";
	private String usernameParameter = SPRING_SECURITY_FORM_USERNAME_KEY;
	private String passwordParameter = SPRING_SECURITY_FORM_PASSWORD_KEY;
	private boolean postOnly = true;

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException
	{
		if (postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("Authentication method not supported: " + request.getMethod());
        }

        String username = obtainUsername(request);
        String password = obtainPassword(request);

        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);

        // Allow subclasses to set the "details" property
        setDetails(request, authRequest);

        return this.getAuthenticationManager().authenticate(authRequest);
	}

	@Override
	protected String obtainUsername(HttpServletRequest request)
	{
		return obtainParameter(request, usernameParameter);
	}

	@Override
	protected String obtainPassword(HttpServletRequest request)
	{
		return obtainParameter(request, passwordParameter);
	}

	private String obtainParameter(HttpServletRequest request, String parameterName)
	{
		String value = request.getParameter(parameterName);
		if (value == null)
		{
			value = "";
		}
		return value;
	}

	public void setPostOnly(boolean postOnly)
	{
		this.postOnly = postOnly;
	}
}
