package com.smartcold.manage.cold.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 
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
	
	/**
	 * 获得16进制 Linux时间
	 * @return
	 */
	public static String getHextime(){
		return   (int)System.currentTimeMillis() / 1000+"";
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
	public static int daysBetween(Date smdate, Date bdate) {
		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			smdate = dateFormat.parse(dateFormat.format(smdate));
			bdate = dateFormat.parse(dateFormat.format(bdate));
			Calendar cal = Calendar.getInstance();
			cal.setTime(smdate);
			long time1 = cal.getTimeInMillis();
			cal.setTime(bdate);
			long time2 = cal.getTimeInMillis();
			long between_days = (time2 - time1) / (1000 * 3600 * 24);
			return Integer.parseInt(String.valueOf(between_days));
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
	
	public static void main(String[] args) {
		System.err.println(getBeforeMonthTime(1));
	}
	
}
