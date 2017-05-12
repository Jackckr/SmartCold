package com.smartcold.manage.cold.jobs.taskutil;

import java.util.Calendar;
import java.util.HashMap;

import com.smartcold.manage.cold.util.TimeUtil;
/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: CronExpConversion 工具类,具类, 提供静态工具方法 操作字符串
 * Create on MaQiang34 2017-5-11 15:06:34
 */
public class CronExpConversion {
    public static final String _EVERY = "every";
    public static final String _ANY = "any";
    public static final String _RANGES = "ranges";
    public static final String _INCREMENTS = "increments";
    public static final String _ADDITIONAL = "additional";
    public static final String _LAST = "last";
    public static final String _WEEKDAY = "weekday";
    public static final String _THENTH = "theNth";
    public static final String _CALENDAR = "calendar";

    public static final String _TYPE = "type";

    /**
     * 0 0 6 ? * 1#1 ? monthly; 0 0 6 ? * 1 ? weekly; 0 0 6 30 7 ? 2006 useDefined
     */
    static String[] headTitle = { "TYPE", "SECONDS", "MINUTES", "HOURS", "DAYOFMONTH", "MONTH","DAYOFWEEK", "YEAR" };

    /**
     * cron expression special characters Map specialCharacters
     */
    public static HashMap<String,Object> specialCharacters;

    static {
        specialCharacters = new HashMap<String,Object>(10);
        specialCharacters.put(_EVERY, "*");// * 代表任意合法的字段
        specialCharacters.put(_ANY, "?");// ? 表示没值被指定 ,只能出现在月和星期的字段
        specialCharacters.put(_RANGES, "-");// - 表示值的范围
        specialCharacters.put(_INCREMENTS, "/");// / 表示时间的增量
        specialCharacters.put(_ADDITIONAL, ",");// 表示指定多个值，例如在周字段上设置 "MON,WED,FRI" 表示周一，周三和周五触发
        specialCharacters.put(_LAST, "L");// L 如果用在"一月哪天"段上，表示一个月的最后一天；如果用在"星期"段上。表示一个星期的最后一天（星期六）
        specialCharacters.put(_WEEKDAY, "W");// W 表示最靠近给定时间的一天，（必须是星期一到星期五）
        specialCharacters.put(_THENTH, "#");// 只能出现在"星期"段位置 ,表示第几个星期
        specialCharacters.put(_CALENDAR, "C");

        specialCharacters.put(_TYPE, headTitle);
    }

    public static void set(String ex, int index) {
        ((String[]) specialCharacters.get(_TYPE))[index] = ex;
    }
    
    public static String getQuartzTime(Long time) {
		Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(time);
	    return  CronExpConversion.convertDateToCronExp("userDefined", new Integer[]{cal.get(Calendar.SECOND), cal.get(Calendar.MINUTE), cal.get(Calendar.HOUR)}, null, null, TimeUtil.getFormatDate(cal.getTime()));
	}
	
	
	public static String getQuartzTime(Calendar cal ) {
	    return  CronExpConversion.convertDateToCronExp("userDefined", new Integer[]{cal.get(Calendar.SECOND), cal.get(Calendar.MINUTE), cal.get(Calendar.HOUR)}, null, null, TimeUtil.getFormatDate(cal.getTime()));
	}
    /**
     * 页面设置转为UNIX cron expressions 转换算法
     * 
     * @param everyWhat
     * @param commonNeeds 包括 second minute hour
     * @param monthlyNeeds 包括 第几个星期 星期几
     * @param weeklyNeeds 包括 星期几
     * @param userDefinedNeeds 包括具体时间点
     * @return cron expression
     */
    public static String convertDateToCronExp(String everyWhat, Integer[] commonNeeds,Integer[] monthlyNeeds, String weeklyNeeds, String userDefinedNeeds) {
        String cronEx = "";
        String dayOfWeek = "";
        String commons = commonNeeds[0] + " " + commonNeeds[1] + " " + commonNeeds[2] + " ";
        if ("weekly".equals(everyWhat)) {
            dayOfWeek = weeklyNeeds; // 1
            if (dayOfWeek != null) {
                cronEx = (commons + CronExpConversion.specialCharacters.get(CronExpConversion._ANY) + " "
                        + CronExpConversion.specialCharacters.get(CronExpConversion._EVERY) + " "
                        + dayOfWeek + " ").trim();
            } else {
                cronEx = (commons + CronExpConversion.specialCharacters.get(CronExpConversion._ANY) + " "
                        + CronExpConversion.specialCharacters.get(CronExpConversion._EVERY) + " "
                        + CronExpConversion.specialCharacters.get(CronExpConversion._EVERY) + " ").trim();
            }
        } else if ("Daily".equals(everyWhat)) {
            cronEx = (commons + CronExpConversion.specialCharacters.get(CronExpConversion._ANY) + " "
                    + CronExpConversion.specialCharacters.get(CronExpConversion._EVERY) + " "
                    + CronExpConversion.specialCharacters.get(CronExpConversion._EVERY) + " ").trim();
        } else {// 立即执行--将定时任务的时间设置为当前时间
            String dayOfMonth = userDefinedNeeds.split("-")[2];
            if (dayOfMonth.startsWith("0")) {
                dayOfMonth = dayOfMonth.replaceFirst("0", "");
            }
            String month = userDefinedNeeds.split("-")[1];
            if (month.startsWith("0")) {
                month = month.replaceFirst("0", "");
            }
            // FIXME 暂时不加年份 Quartz报错
            /*
             *    String year = userDefinedNeeds.split("-")[0];
             * cronEx = (commons + dayOfMonth + " " + month + " " +
             * CronExRelated.specialCharacters.get(CronExRelated._ANY) + " " + year).trim();
             */
            cronEx = (commons + dayOfMonth + " " + month + " " + CronExpConversion.specialCharacters.get(CronExpConversion._ANY) + " ").trim();
        }
        System.out.println(cronEx);
        return cronEx;
    }
}