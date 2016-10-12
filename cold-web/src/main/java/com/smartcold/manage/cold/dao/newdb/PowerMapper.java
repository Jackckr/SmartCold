package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.PowerEntity;

public interface PowerMapper {
	
   /**
    * 根据时间查询U错误的数据
    * @param startTime
    * @return
    */
	public List<PowerEntity> findUBlowerByTime(@Param("startTime") Date startTime);
	
	/**
	 * 根据时间查询电流数据
	 * @param startTime
	 * @return
	 */
	public List<PowerEntity> findIBlowerByTime(@Param("oid")int oid,  @Param("iunbalance")Double iunbalance, @Param("startTime") Date startTime);
}
