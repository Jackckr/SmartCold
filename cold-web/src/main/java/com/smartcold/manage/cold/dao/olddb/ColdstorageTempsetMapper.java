package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;


public interface ColdstorageTempsetMapper {
	
	String getItem(@Param("rdcId")Integer rdcId,@Param("userId")Integer userId);
	//`rdcId` ,`userId`,`oids`
	void addItem(@Param("rdcId")int rdcId,@Param("userId")int userId,@Param("oids")String	oids);
	
	void upItem(@Param("rdcId")Integer rdcId,@Param("userId")Integer userId,@Param("oids")String	oids);
	
}
