package com.boomhope.redis;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;

/**
 * Hello world!
 *
 */
public class Startup 
{
    public static void main( String[] args )
    {
    	AnnotationConfigWebApplicationContext apc = new AnnotationConfigWebApplicationContext(); 
    	apc.getBean("redisConnectionFactory");
    }
}
