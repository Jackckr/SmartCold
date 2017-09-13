package com.smartcold.manage.cold.util;

import java.util.Arrays;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类,具类, 提供静态工具方法 操作字符串
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class StringUtil
{

	public static final String	EMPTY_STRING	= "";
	
	
	/**
	 * 判断字符串是否为null或者空字符串(即长度为0的字符串)
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNull(final String str)
	{
		return (str == null || str.isEmpty());
	}
	/**
	 * 判断字符串是否为null或者空字符串(即长度为0的字符串)
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isnotNull(final String str)
	{
		return !isNull(str);
	}
	


	public static String countNull(final Object str)
	{
		if(str==null||"null".equals(str)){
			return "";
		}else{
			return str.toString();
		}
	}
	
	
	public static String getIdS(int [] oids)
	{
		if(oids!=null){
			String str= Arrays.toString(oids);
			return str.substring(1,str.length()-1);
		}
		return "";
	}
	public static int [] getIdS(String oids)
	{
		if(isnotNull(oids)){
			String[] ids = oids.split(",");
			int [] newids=new int[ids.length];
			for (int i = 0; i <ids.length; i++) {
				newids[i]=Integer.parseInt(ids[i]);
			}
			return newids;
		}
		return null;
	}
	
	
	 public synchronized static boolean verifyToken(String toke){
		   if(isnotNull(toke)){
			   String mdtokn = EncodeUtil.encodeByMD5("toke"+TimeUtil.getDateHour());
			   return mdtokn.equals(toke);
		   }
		   return false;
	}
	
}
