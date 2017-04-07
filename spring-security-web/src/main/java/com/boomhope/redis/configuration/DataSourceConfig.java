package com.boomhope.redis.configuration;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import com.alibaba.druid.pool.DruidDataSource;

@Configuration
@PropertySource("classpath:datasource.properties")
public class DataSourceConfig {
	@Autowired
	private Environment env;
	
	@Bean(name="dataSource")
	public DruidDataSource getDataSource() {
		DruidDataSource druidDataSource =  new DruidDataSource();
		druidDataSource.setDriverClassName(env.getProperty("driver"));
		druidDataSource.setUrl(env.getProperty("url"));
		druidDataSource.setUsername(env.getProperty("username"));
		druidDataSource.setPassword(env.getProperty("password"));
		druidDataSource.setInitialSize(env.getProperty("initialSize",Integer.class));
		druidDataSource.setMaxActive(env.getProperty("maxActive",Integer.class));
		druidDataSource.setMinIdle(env.getProperty("minIdle",Integer.class));
		druidDataSource.setMaxWait(env.getProperty("maxWait",Long.class));
		
//		BasicDataSource datasource = new BasicDataSource();
//		datasource.setDriverClassName(env.getProperty("driver"));
//		datasource.setUrl(env.getProperty("url"));
//		datasource.setUsername(env.getProperty("username"));
//		datasource.setPassword(env.getProperty("password"));
//		datasource.setInitialSize(env.getProperty("initialSize",Integer.class));
//		datasource.setMaxActive(env.getProperty("maxActive",Integer.class));
//		datasource.setMaxIdle(env.getProperty("maxIdle",Integer.class));
//		datasource.setMinIdle(env.getProperty("minIdle",Integer.class));
//		datasource.setMaxWait(env.getProperty("maxWait",Long.class));
		return druidDataSource;
	}

	@Bean(name="sqlSessionFactory")
	public SqlSessionFactoryBean getSqlSessionFactory(DataSource dataSource) throws Exception {
		SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
		sqlSessionFactory.setDataSource(dataSource);
		sqlSessionFactory.setTypeAliasesPackage("com.boomhope.redis.domain");
		String path = "classpath*:com/boomhope/redis/*/mapper/*Mapper.xml";
		Resource[] resources = new PathMatchingResourcePatternResolver().getResources(path);
		sqlSessionFactory.setMapperLocations(resources);
		return sqlSessionFactory;
	}
	
	@Bean(name="sqlSession")
	public SqlSessionTemplate getSessionTemplate(SqlSessionFactory sqlSessionFactoryBean) {
		SqlSessionTemplate sqlSession = new SqlSessionTemplate(sqlSessionFactoryBean);
		return sqlSession;
	}
	@Bean(name="transactionManager")
	public DataSourceTransactionManager getTransactionManager(DataSource dataSource) {
		DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
		transactionManager.setDataSource(dataSource);
		return transactionManager;
	}
}
