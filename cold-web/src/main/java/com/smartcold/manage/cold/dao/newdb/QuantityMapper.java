package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ForkLiftEntity;
import com.smartcold.manage.cold.entity.newdb.QuantityTask;

/**
 * 计算Q
 * @author MaQiang34
 *
 */
public interface QuantityMapper {
	
	List<QuantityTask> getTaskByIP(@Param("ip")String ip);//获得任务状态 根据IP获得可分配的任务
	
	void updateTakststatus(@Param("state")Boolean  state,@Param("key")String key);//获得任务状态
	
	boolean getTaskStatus(@Param("methodName")String methodName,@Param("ip")String ip,@Param("time")Date time);//获得任务状态
	
	
    //======================================================Q2======================================================
   
	
    //======================================================Q4======================================================
	/**
	 * 获得叉车信息
	 * @param oid
	 * @param stTime
	 * @param edTime
	 * @return
	 */
	List<ForkLiftEntity> findForkliftByTime(@Param("oid")Object oid,@Param("stTime")String stTime,@Param("edTime")String edTime);//
    //======================================================Q5======================================================
	
	
	
    //======================================================Q6======================================================
	
	
	
    //======================================================Q7======================================================

}
