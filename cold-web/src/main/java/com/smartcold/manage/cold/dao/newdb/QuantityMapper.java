package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ForkLiftEntity;

/**
 * 计算Q
 * @author MaQiang34
 *
 */
public interface QuantityMapper {
    //======================================================Q2======================================================
   
    //======================================================Q4======================================================
	List<ForkLiftEntity> findForkliftByTime(@Param("oid")Object oid,@Param("stTime")String stTime,@Param("edTime")String edTime);//获得叉车信息
    //======================================================Q5======================================================
    //======================================================Q6======================================================
    //======================================================Q7======================================================

}
