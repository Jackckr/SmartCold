package com.smartcold.manage.cold.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.smartcold.manage.cold.entity.newdb.NewColdStorageEntity;

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

    private static Logger logger = LoggerFactory.getLogger(TimeUtil.class);
	public static SimpleDateFormat	datefm	    = new SimpleDateFormat("yyyy-MM-dd");
	public static SimpleDateFormat	datefmnyr	= new SimpleDateFormat("yyyy年MM月dd日");
	public static SimpleDateFormat	datefmlong	= new SimpleDateFormat("yyyyMMddHHmmssSSS");
	public static SimpleDateFormat	dateFormat	= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
	public static String  getDateTime(){return	TimeUtil.dateFormat.format(new Date());}//获得时间
	public static String  getDateTime(Date date){return	TimeUtil.dateFormat.format(date);}
	public static String  getFormatDate(Date date){return	TimeUtil.datefm.format(date);}
	public static String  getFormatDate(){return	TimeUtil.datefm.format(new Date());}
	
	
	public static String getMillTime(){
		return (System.currentTimeMillis()+"").substring(0, 10);
	}
	public static Long getLongtime(){
		return Long.parseLong( (System.currentTimeMillis()+"").substring(0, 10));
	}
	/**
	 * 获得16进制 Linux时间
	 * @return
	 */
	public static String getHextime(){
		return Integer.toHexString( (int) (System.currentTimeMillis() / 1000)).toUpperCase();
	}
	
	public static String[] getDayTime() {
	    	String sourceDateStr =  getFormatDate();
	    	return new String[]{ sourceDateStr+ " 00:00:01", sourceDateStr+ " 23:59:59"};
	}

	
	/**
	 *时间差(分钟)
	 * @param start
	 * @param end
	 * @return
	 */
	public static long minuteBetween(Long start) {
		try {
			   return (new Date().getTime()-start)/60000;//除以1000是为了转换成秒
		} catch (Exception e) {
			return -1;
		}
	}
	
	/**
	 * 获得剩余分钟数
	 * @param start
	 * @param end
	 * @return
	 */
	public static long getDownMint(Long excute) {
		try {
			   return (excute-new Date().getTime())/60000;//除以1000是为了转换成秒
		} catch (Exception e) {
			return -1;
		}
	}
	
	/**
	 * 获得两个时间差(秒)
	 * @param start
	 * @param end
	 * @return
	 */
	public static long secondBetween(Date start, Date end) {
		try {
			   return (end.getTime()-start.getTime())/1000;//除以1000是为了转换成秒
		} catch (Exception e) {
			return -1;
		}
	}


	/**
	 * 获得两个时间差(分钟)
	 * @param start
	 * @param end
	 * @return
	 */
	public static long minuteBetween(Date start, Date end) {
		try {
			   return (end.getTime()-start.getTime())/60000;//除以1000是为了转换成秒
		} catch (Exception e) {
			return -1;
		}
	}
	/**
	 * 获得两个时间差(小时)
	 * @param start
	 * @param end
	 * @return
	 */
	public static long hourBetween(Date start, Date end) {
		try {
			   return (end.getTime()-start.getTime())/3600000;//除以1000是为了转换成秒
		} catch (Exception e) {
			return -1;
		}
	}
	/**
	 * 计算两个日期之间相差的天数
	 * 
	 * @param smdate
	 *            较小的时间
	 * @param bdate
	 *            较大的时间
	 * @return 相差天数
	 * @throws ParseException
	 */
	public static int daysBetween(Date start, Date end) {
		try {
			long between_days = (end.getTime()-start.getTime())/86400000;
			return (int) between_days;
		} catch (Exception e) {
			return -1;
		}
	}
    /**
     * Date转String
     *
     * @param date
     * @param pattern
     * @return
     */
    public static String dateToString(Date date, String pattern) {
        String result = "";
        if ("".equals(pattern)) {
            pattern = "yyyy-MM-dd";
        }
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        try {
            result = sdf.format(date);
        } catch (Exception e) {
            logger.error("日期转换出错", e);
        }
        return result;
    }
   
    /**
     * 获取指定日期的 23：59：59
     *
     * @return
     */
    public static String getbefDayLast() {
    	String sourceDateStr = dateToString(getBeforeDay(1), "yyyy-MM-dd");
    	return sourceDateStr + " 23:59:59";
    }
    /**
     * 获取指定日期的 23：59：59
     *
     * @return
     */
    public static Date getDayLast(Date sourceDate) {
        String sourceDateStr = dateToString(sourceDate, "yyyy-MM-dd");
        String newDateStr = sourceDateStr + " 23:59:59";
        return stringToDate(newDateStr, "yyyy-MM-dd HH:mm:ss");
    }

    /** 
     * 使用参数Format将字符串转为Date 
     */  
    public static Date parseYMD(String strDate)  
    {  
        try {
			return datefm.parse(strDate);
		} catch (ParseException e) {
			 logger.error("日期转换出错", e);
		}  
        return null;
    } 
    
    public static Date  stringToDate(String datetime){
    	Date date = new Date();
        try {
            date = dateFormat.parse(datetime);
        } catch (ParseException e) {
            logger.error("日期转换出错", e);
        }
        return date;
    	
    
    }
    /**
     * String转Date
     *
     * @param dateStr
     * @param pattern
     * @return
     */
    public static Date stringToDate(String dateStr, String pattern) {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat(pattern);
        try {
            date = sdf.parse(dateStr);
        } catch (ParseException e) {
            logger.error("日期转换出错", e);
        }
        return date;
    }

    public static int getDay() {
        Calendar calendar = Calendar.getInstance();
        return calendar.get(Calendar.DAY_OF_MONTH);
    }
    public static int getDateHour() {
        Calendar calendar = Calendar.getInstance();
        return calendar.get(Calendar.HOUR_OF_DAY);
    }
    /**
     * 获取日期的小时
     *
     * @param date
     * @return
     */
    public static int getDateHour(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.HOUR_OF_DAY);
    }
    
    /**
     * 获得指定分钟前的时间
     * @param date
     * @return
     */
    public static Date getBeforeMinute(int MINUTE) {
    	return getBeforeByTemp(Calendar.MINUTE, -MINUTE);// 
    }
    
    /**
     * 获得指定小时前的时间
     * @param date
     * @return
     */
    public static Date getBeforeHOUR(int HOUR) {
    	return getBeforeByTemp(Calendar.HOUR, -HOUR);// 
    }
    /**
     * 获得之前的日期
     * @param date
     * @return
     */
    public static Date getBeforeDay(int DAY) {
    	return getBeforeByTemp(Calendar.DAY_OF_MONTH,  -DAY);
    }
    
    /**
     * 
     * @param type
     * @param time
     * @return
     */
    public static Date getBeforeByTemp(int type,int time) {
    	Calendar beforeTime = Calendar.getInstance();
    	beforeTime.add(type, time);
    	return beforeTime.getTime();
    }

    
    /**
	 * 获取每月第一天
	 * 
	 * @return 返回时间(字符串格式)
	 */
	public static String getBeginDay() {
		Calendar c = Calendar.getInstance();
		c.set(Calendar.DAY_OF_MONTH, 1);
		Date endTime = c.getTime();
		String timeBefore = datefm.format(endTime);
		return timeBefore;
	}

	/**
	 * 获取每月最后一天
	 * 
	 * @return 返回时间(字符串格式)
	 */
	public static String getEndDay() {
		Calendar c = Calendar.getInstance();
		c.set(Calendar.DATE, 1);
		c.roll(Calendar.DATE, -1);
		Date endTime = c.getTime();
		String timeBefore = datefm.format(endTime);
		return timeBefore;
	}
	/**
	 * 指定时间减去多少个月
	 * 
	 * @param interval
	 *            月
	 * @param dateTime
	 *            指定时间
	 * @return 返回时间(日期串格式)
	 */
	public static Date cutMonthByDate(int interval, Date dateTime) {
		Calendar c = Calendar.getInstance();
		c.setTime(dateTime);
		c.add(Calendar.MONTH, interval); // 当前时间减去几个月月
		Date datebefore = new Date(c.getTimeInMillis());
		return datebefore;
	}
	/**
	 * 获得month前的月份的第一天
	 * @param month
	 * @return
	 */
	public static String getBeforeMonthTime(int month) {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -month); 
		c.set(Calendar.DAY_OF_MONTH, 1);
		return datefm.format( c.getTime())+" 00:00:00" ;
	}
	/**
	 * 获得month前的月份的最后一天
	 * @param month
	 * @return
	 */
	public static String getEndMonthTime(int month) {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, -month);
		c.set(Calendar.DATE, 1);
		c.roll(Calendar.DATE, -1);
		return datefm.format(c.getTime())+" 23:59:59";
	}
	
	
	
}
