package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.Temp;

public interface TempMapper {
	
    int deleteByPrimaryKey(Integer id);

    int insert(Temp record);

    int insertSelective(Temp record);

    Temp selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Temp record);

    int updateByPrimaryKey(Temp record);
    
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
	public List<ItemValue> findVTByTime(@Param("tid")int tid,@Param("oid")int  oid,@Param("key")String key,  @Param("startTime")Date startTime, @Param("endTime")Date endTime) ;
	

    
}