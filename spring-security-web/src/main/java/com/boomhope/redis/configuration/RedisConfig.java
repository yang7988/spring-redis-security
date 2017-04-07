package com.boomhope.redis.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@Configuration
@PropertySource("classpath:redis.properties")
@EnableCaching
public class RedisConfig {
	@Autowired
	private Environment env;
	
	@Bean(name="redisConnectionFactory")
	public JedisConnectionFactory getRedisConnectionFactory() {
		String redisHost = env.getProperty("redis.host");
		int port = env.getProperty("redis.port", Integer.class);
		int dbindex = env.getProperty("redis.da.index", Integer.class);
		JedisConnectionFactory redisConnectionFactory = new JedisConnectionFactory();  
        redisConnectionFactory.setHostName(redisHost);  
        redisConnectionFactory.setPort(port);  
        redisConnectionFactory.setDatabase(dbindex);
        return redisConnectionFactory; 
	}
	/**
	 * 获取用于spring操作redis的模板对象,该对象封装了基本的CRUD操作方法
	 * @param cf
	 * @return
	 */
    @Bean(name="redisTemplate")  
    public RedisTemplate<String, String> getRedisTemplate(RedisConnectionFactory cf) {  
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<String, String>();  
        redisTemplate.setConnectionFactory(cf);  
        return redisTemplate;  
    }  
  
    /**
     * 获取spring用于管理redis的缓存管理器对象
     * @param redisTemplate
     * @return
     */
    @Bean(name="cacheManager")  
    public CacheManager getCacheManager(RedisTemplate<String, String> redisTemplate) {  
        RedisCacheManager cacheManager = new RedisCacheManager(redisTemplate);  
        cacheManager.setDefaultExpiration(3000);  
        return cacheManager;  
    }  
}
