package com.smartcold.zigbee.manage.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by sunqiunian on 15/11/17.
 */
public class TimeUtil {

    private static Logger logger = LoggerFactory.getLogger(TimeUtil.class);
	public static SimpleDateFormat	datefm	= new java.text.SimpleDateFormat("yyyy-MM-dd");
	public static SimpleDateFormat	datefmnyr	= new java.text.SimpleDateFormat("yyyy年MM月dd日");
	public static SimpleDateFormat	dateFormat	= new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    
	public static String  getDateTime(){return	TimeUtil.dateFormat.format(new Date());}//获得时间
	
	public static Long getLongtime(){return Long.parseLong( (System.currentTimeMillis()+"").substring(0, 10));}
	/**
	 * 获得16进制 Linux时间
	 * @return
	 */
	public static String getHextime(){
		return Integer.toHexString( (int) (System.currentTimeMillis() / 1000)).toUpperCase();
	}
	
	public static int getDay() {
       return Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
    }
    public static int getDateHour() {
        return  Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
    } 
    public static int getDateMinute() {
        return  Calendar.getInstance().get(Calendar.MINUTE);
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

    public static void main(String[] args) {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        System.out.print(sdf.format(date));
    }
}
