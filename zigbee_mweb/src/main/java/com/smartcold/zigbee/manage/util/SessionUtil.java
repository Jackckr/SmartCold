package com.smartcold.zigbee.manage.util;
import javax.servlet.http.HttpServletRequest;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类, session工具类
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class SessionUtil
{

	public static int getSellUid(HttpServletRequest request)
	{
		Object selluid = request.getSession().getAttribute("selluid");
		if(selluid!=null){
		  return Integer.parseInt(selluid.toString());
		}
		return 0;
	}
	public static void removeSessionAttbuter(HttpServletRequest request,String key)
	{
		request.getSession().removeAttribute(key);
	}
	public static void setSessionAttbuter(HttpServletRequest request,String key, Object value)
	{
		request.getSession().setAttribute(key, value);
	}

	public static Object getSessionAttbuter(HttpServletRequest request,String key)
	{
		return request.getSession().getAttribute(key);
	}
	public static String getRootpath(HttpServletRequest request)
	{
		return request.getSession().getServletContext().getRealPath("");
	}
}
