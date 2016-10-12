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
	public static SimpleDateFormat	datefm	= new java.text.SimpleDateFormat("yyyy-MM-dd");
	public static SimpleDateFormat	datefmnyr	= new java.text.SimpleDateFormat("yyyy年MM月dd日");
	public static SimpleDateFormat	dateFormat	= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
	public static String  getDateTime(){return	TimeUtil.dateFormat.format(new Date());}//获得时间
	public static String  getDateTime(Date date){return	TimeUtil.dateFormat.format(date);}
	public static String  getFormatDate(Date date){return	TimeUtil.datefm.format(date);}
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
    	Calendar beforeTime = Calendar.getInstance();
        beforeTime.add(Calendar.MINUTE, -MINUTE);// 
        return beforeTime.getTime();
    }
    
    /**
     * 获得指定小时前的时间
     * @param date
     * @return
     */
    public static Date getBeforeHOUR(int HOUR) {
    	Calendar beforeTime = Calendar.getInstance();
    	beforeTime.add(Calendar.HOUR, -HOUR);// 
    	return beforeTime.getTime();
    }

}
