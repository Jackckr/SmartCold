package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemConf;

/**
 * 为QT设备接口
 * @author Administrator
 *
 */
public interface RdcConf {
	
   public ItemConf findrdcconfBydevId(@Param("devid")String devid);
	
}