package com.smartcold.manage.cold.util;

import java.util.List;
import java.util.Map;
import java.util.Set;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类, 提供与集合相关的操作
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class SetUtil
{

	/**
	 * 判断list是否为null或者不包含任何元素(即size为0)
	 * 
	 * @param list
	 * @return
	 */
	public static boolean isNullList(List<?> list)
	{
		return list == null || list.isEmpty() ? true : false;
	}

	public static String[] listtoArray(List<String> value)
	{
		return value.toArray(new String[value.size()]);
	}

	/**
	 * 判断list是否为null或者不包含任何元素(即size为0)
	 * 
	 * @param list
	 * @return
	 */
	public static boolean isnotNullList(List<?> list)
	{
		return list == null || list.isEmpty() ? false : true;
	}

	/**
	 * 判断set是否为null或者不包含任何元素(即size为0)
	 * 
	 * @param list
	 * @return
	 */
	public static boolean isNullSet(Set<?> set)
	{
		return set == null || set.isEmpty() ? true : false;
	}

	/**
	 * 判断map是否为null或者不包含任何元素(即size为0)
	 * 
	 * @param map
	 * @return
	 */
	public static boolean isNullMap(Map<?, ?> map)
	{
		return map == null || map.isEmpty() ? true : false;
	}
	
	/**
	 * 判断map是否为null或者不包含任何元素(即size为0)
	 * 
	 * @param map
	 * @return
	 */
	public static boolean isNotNullMap(Map<?, ?> map)
	{
		return map == null || map.isEmpty() ? false : true;
	}

}
