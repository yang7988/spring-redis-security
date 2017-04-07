package com.boomhope.redis.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import com.boomhope.redis.web.security.CustomAuthenticationProvider;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Autowired
    private CustomAuthenticationProvider customAuthenticationProvider;
	
	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/static/**").antMatchers("/views/error/**");
	}


	@Override
	protected void configure(HttpSecurity http) throws Exception {
		       http.csrf().disable().authorizeRequests().and()
		       .formLogin()
		           .loginPage("/login")
		           .loginProcessingUrl("/account/dologin")
				   .failureUrl("/login?error")
				   .defaultSuccessUrl("/home/index")
				   .usernameParameter("username").passwordParameter("password").permitAll()
			   .and()
			   .logout()
			       .logoutUrl("/logout").permitAll()
			       .logoutSuccessUrl("/login?logout=true")
			   .and()
			   .authorizeRequests()
			   .antMatchers("/auth/**").hasRole("ADMIN");
		       /*http
               .authorizeRequests()//该方法所返回的对象的方法来配置请求级别的安全细节
                   .antMatchers("/login")
                   .permitAll()//对于登录路径不进行拦截
                   .antMatchers("/show").authenticated()//authenticated()表示允许过的用户访问
               .and()
               .formLogin()//配置登录页面
                   .loginPage("/login")//登录页面的访问路径
                   .loginProcessingUrl("/check")//登录页面下表单提交的路径
                   .failureUrl("/login")//登录失败后跳转的路径
                   .defaultSuccessUrl("/show")//登录成功后默认跳转的路径
               .and()
               .csrf()//启用防跨站伪请求攻击，默认启用
               .and()
                   .logout()//用户退出操作
                       .logoutUrl("/logout")//用户退出所访问的路径，需要使用Post方式
                       .permitAll()
                       .logoutSuccessUrl("/login?logout=true")
               .and()
                   .authorizeRequests()
//               //定义路径保护的配置方法
//                    .antMatchers(HttpMethod.GET,"/admin")
//                   .authenticated()
                   .antMatchers(HttpMethod.GET,"/message/**","/object/**").hasRole("USER")
                   .anyRequest().permitAll()
               .and()
                   .rememberMe()//启用记住我功能
                       .tokenValiditySeconds(2419200);*/
       
	}


	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(customAuthenticationProvider);
	}

	
}
