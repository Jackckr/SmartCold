package com.smartcold.bgzigbee.manage.dao;

import java.util.HashMap;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
/**
 * 
 *@author MaQiang34
 *@date:2016-6-22 上午11:11:51
 *@Description: AppointmentMapper 
 */
public interface AppointmentMapper {
	
	void  delByIds(@Param("ids")String ids);
	
	Page<HashMap<String, Object>> getList(@Param("status")Integer status);
	
	void  updatByIds(@Param("ids")String ids,@Param("commit")String commit,@Param("status")int status);
}
