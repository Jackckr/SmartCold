package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemValue;

public interface TempMapper {
	
 
	
	
	/**
	 * 批量插入数据
	 * @param dataList
	 */
     public void batchInsert(@Param("tid")int tid,List<ItemValue> dataList);
    
	  /**
	   * 
	   * @param tid:数据库地址
	   * @param type:查询数据类型
	   * @param oid:对象id
	   * @param key
	   * @param startTime
	   * @param endTime
	   * @return
	   */
	   public List<ItemValue> findVTByTime(@Param("oid")int  oid,@Param("key")String key,  @Param("startTime")Date startTime, @Param("endTime")Date endTime) ;
	

    
}