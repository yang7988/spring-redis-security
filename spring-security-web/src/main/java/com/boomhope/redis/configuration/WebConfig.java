package com.boomhope.redis.configuration;

import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.boomhope.redis.web","com.boomhope.redis.controller"})
public class WebConfig extends WebMvcConfigurerAdapter {
	
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/static/").addResourceLocations("/static/**");
		super.addResourceHandlers(registry);
	}

	@Bean(name="jacksonObjectMapper")
	public ObjectMapper getObjectMapper(SimpleDateFormat dateFormat) {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setDateFormat(dateFormat);
		return objectMapper;
	}
	
	@Bean(name="dateFormat")
	public SimpleDateFormat getSimpleDateFormat() {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return dateFormat;
	}
	
    
	@Override
	public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		//http字符串消息转换器
		StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter();
		List<MediaType> supportedMediaTypes = new ArrayList<MediaType>();
		MediaType mediaType = new MediaType("text", "plain", Charset.forName("UTF-8"));
		supportedMediaTypes.add(mediaType);
		stringHttpMessageConverter.setSupportedMediaTypes(supportedMediaTypes);
		//http消息json转换器
		MappingJackson2HttpMessageConverter jacksonHttpMessageConverter = new MappingJackson2HttpMessageConverter();
		jacksonHttpMessageConverter.setObjectMapper(getObjectMapper(getSimpleDateFormat()));
		converters.add(stringHttpMessageConverter);
		converters.add(jacksonHttpMessageConverter);
	}

	@Bean(name = "freemarkerConfig")
	public FreeMarkerConfigurer getFreeMarkerConfigurer() {
		FreeMarkerConfigurer freemarkerConfig = new FreeMarkerConfigurer();
		freemarkerConfig.setTemplateLoaderPath("");
		freemarkerConfig.setDefaultEncoding("UTF-8");
		return freemarkerConfig;
	}

	@Bean(name = "viewResolver")
	public ViewResolver getViewResolver() {
		FreeMarkerViewResolver viewResolver = new FreeMarkerViewResolver();
		viewResolver.setCache(true);
		viewResolver.setPrefix("/views/");
		viewResolver.setSuffix(".html");
		viewResolver.setContentType("text/html;charset=UTF-8");
		viewResolver.setExposeSpringMacroHelpers(true);
		viewResolver.setRequestContextAttribute("requestContext");
		Properties props = new Properties();
		props.setProperty("title", "权限管理系统");
		props.setProperty("ieVersion", "IE=8,9,10");
		props.setProperty("jqueryVersion", "1.8.0");
		props.setProperty("easyuiVersion", "1.3.1");
		props.setProperty("skinName", "citizencard");
		props.setProperty("easyuiSkinName", "citizencard");
		props.setProperty("bootstrapVersion", "3.3.7");
		viewResolver.setAttributes(props);
		return viewResolver;
	}

	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}

}
