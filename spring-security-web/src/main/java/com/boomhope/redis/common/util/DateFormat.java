package com.boomhope.redis.common.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormat {
	private static SimpleDateFormat sdf = null;
    private static String DEFAULT_TIME_FORMAT="yyyy-mm-dd HH:MM:ss";
    static {
    	sdf = new SimpleDateFormat(DEFAULT_TIME_FORMAT);
    }
    public static String formatDate(Date date) {
    	return sdf.format(date);
    }
    public static String formatDate(Date date,String format) {
    	return new SimpleDateFormat(format).format(date);
    }
}
