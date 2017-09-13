package com.smartcold.manage.cold.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: TimeUtil 工具类,具类, 提供静态工具方法 操作字符串
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class TimeUtil {

	private static final ThreadLocal<SimpleDateFormat> athreadLocal = new ThreadLocal<SimpleDateFormat>() {
		@Override
		protected SimpleDateFormat initialValue() {
			return new SimpleDateFormat("yyyy-MM-dd");
		}
	};
	
    private static final ThreadLocal<SimpleDateFormat> bThreadLocal = new ThreadLocal<SimpleDateFormat>() {
        @Override
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }
    };
	public static String  getFormatDate(Date date){return	TimeUtil.athreadLocal.get().format(date);}

	public static String  getDate(){return	TimeUtil.bThreadLocal.get().format(new Date());}//获得时间
	public static String  getDate(Date date){return	TimeUtil.bThreadLocal.get().format(date);}
	public static Date  pasDate(String date){try {return	TimeUtil.bThreadLocal.get().parse(date);} catch (ParseException e) {e.printStackTrace();}return new Date();}
	
	public static int getDay() {  return  Calendar.getInstance().get(Calendar.DAY_OF_MONTH); }
	public static int getDateHour() { return Calendar.getInstance().get(Calendar.HOUR_OF_DAY); }
	
		
} 