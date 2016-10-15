package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.Company;
import com.smartcold.manage.cold.entity.newdb.ForkLiftEntity;

/**
 * 计算Q
 * @author MaQiang34
 *
 */
public interface QuantityMapper {
	
	
	public boolean updateTaskStatus(Integer id);//获得任务状态
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
