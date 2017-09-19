/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类, 提供静态工具方法 操作字符串
 * maqiag  
 */
package com.smartcold.zigbee.manage.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;


/*
 * Copyright (C) DCIS 版权所有
 * 功能描述: Utils 工具类,具类, 提供静态工具方法 操作字符串
 * Create on MaQiang 2016-6-25 09:28:36
 */
public class StringUtil
{

	public static final String	EMPTY_STRING	= "";

	public static 	String getToken(){
	  return 	EncodeUtil.encodeByMD5("token"+TimeUtil.getDateHour());
	}

	public static Boolean checkToken(String token){return getToken().equals(token);}
	
	
	/**
	 * 加密校验
	 * @param stoken
	 * ABCD->5D6B0eb27525f059327b8581809345b92f0cC72A
	 * @return
	 */
	public static boolean  vifCode(String code,String stoken){return code.equals(getCode(stoken)); }
	public static boolean  visStoken(String code,String stoken){return  stoken.substring(4, stoken.length()-4).equals(EncodeUtil.encodeByMD5(code+TimeUtil.getDay()));  }
	public static String  getCode(String stoken){int length=stoken.length();return stoken.substring(length-1,stoken.length())+stoken.substring(3,4)+stoken.substring(length-4,length-3)+stoken.substring(1,2); }
	public static String  md5Code(String Code){ char[] charArray = Code.toCharArray();Random r=new Random(); return r.nextInt(10)+""+charArray[3]+r.nextInt(10)+ charArray[1]+EncodeUtil.encodeByMD5(Code+TimeUtil.getDay())+ charArray[2]+r.nextInt(10)+r.nextInt(10)+ charArray[0];}
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
		return !(str == null || str.isEmpty());
	}

	public static String countNull(final Object str)
	{
		if(str==null||"null".equals(str)){
			return "";
		}else{
			return str.toString();
		}
	}
	/**
	 * 判断
	 * @param begin
	 * @param end
	 * @param c
	 * @return
	 */
	public static boolean indata(int begin, int end, int c)
	{
		if (begin == c || end == c)
			return true;
		if ((begin > c) != (end > c))
			return true;
		return false;
	}

	/**
	 * 使用delimiter连接字符串
	 * 
	 * @param delimiter
	 * @param strs
	 * @return
	 */
	public static String concatStringWithDelimiter(final String delimiter, final String... strs)
	{
		StringBuffer retStr = new StringBuffer();
		boolean isNull = false;
		int size = strs.length;
		for (int i = 0; i < size; i++)
		{
			if (isNullString(strs[i]))
			{
				strs[i] = "";
				isNull = true;
			}
			retStr.append(strs[i]);

			// 最后一个字符串为非空串, 则不需要再加上delimiter
			if (!isNull && i == size - 1)
			{
				break;
			}

			retStr.append(delimiter);
			isNull = false;
		}
		return retStr.toString();
	}

	public static boolean converBoolean(String object)
	{
		if ("1".equals(object))
		{
			return true;
		}
		return false;
	}




	/**
	 * 判断字符串是否为null或者空字符串(即长度为0的字符串)
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNullString(final String str)
	{
		return (str == null || str.isEmpty());
	}

	/**
	 * 使用分号(;)分割字符串strs
	 * 
	 * @param strs
	 *            字符串数组
	 * @return
	 */
	public static String[] splitString(final String strs)
	{
		return splitStringWithDelimiter(";", strs);
	}

	/**
	 * 使用分号(,)分割字符串strs
	 * 
	 * @param strs
	 *            字符串数组
	 * @return
	 */
	public static String[] splitfhString(final String strs)
	{
		return splitStringWithDelimiter(",", strs);
	}

	/**
	 * 使用delimiter分割字符串strs
	 * <实例：>",a,,b," 分割后->{null,a,null,b}
	 * <实例：>",a,,b," 分割后->{null,a,null,b,null}
	 * 
	 * @param delimiter
	 *            分割符
	 * @param strs
	 *            字符串数组
	 * @return
	 */
	public static String[] splitStringWithDelimiter(final String delimiter, String strs)
	{
		if (isNullString(strs))
		{
			return null;
		}

		List<String> strList = new ArrayList<String>();

		int index = 0;
		String strValue = null;
		while (strs.contains(delimiter))
		{
			strValue = null;
			index = strs.indexOf(delimiter);
			if (index != 0)
			{
				strValue = strs.substring(0, index);
			}

			strList.add(strValue);
			strs = strs.substring(index + delimiter.length());
		}

		if (!isNullString(strs))
		{
			strList.add(strs);
		}

		return strList.toArray(new String[strList.size()]);
	}

	/**
	 * 使用delimiter分割字符串strs
	 * <实例：>",a,,b," 分割后->{null,a,null,b,null}
	 * 
	 * @param delimiter
	 *            分割符
	 * @param strs
	 *            字符串数组
	 * @return
	 */
	public static String[] splitStringWithDelimiterHavEnd(final String delimiter, String strs)
	{
		if (isNullString(strs))
		{
			return null;
		}

		List<String> strList = new ArrayList<String>();

		int index = 0;
		String strValue = null;
		while (strs.contains(delimiter))
		{
			strValue = null;
			index = strs.indexOf(delimiter);
			if (index != 0)
			{
				strValue = strs.substring(0, index);
			}

			strList.add(strValue);
			strs = strs.substring(index + delimiter.length());
		}

		if ("".equals(strs))
		{
			strs = null;
		}
		strList.add(strs);

		return strList.toArray(new String[strList.size()]);
	}

	/**
	 * 如果字符串中包含“'”转换成“''” 保存此字符串到数据库时使用
	 * 为空返回""
	 * 
	 * @param value
	 */
	public static String translateSpecialChar(String value)
	{
		if (!isNullString(value))
		{
			return value.replaceAll("'", "''");
		}
		else
		{
			return "";
		}

	}

	public static String getSQLOrderString(String sortField, String defaultField, boolean isASC)
	{
		if (StringUtil.isNullString(sortField))
		{
			return defaultField;
		}
		else
		{
			if (isASC)
			{
				return sortField;
			}
			else
			{
				return sortField + " DESC";
			}
		}
	}
}
