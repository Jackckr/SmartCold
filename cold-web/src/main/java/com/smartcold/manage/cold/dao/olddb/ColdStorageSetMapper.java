package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-01 23:23)
 */
public interface ColdStorageSetMapper {

	List<ColdStorageSetEntity> findAllColdStorage();

	List<ColdStorageSetEntity> findByRdcId(@Param("rdcId") int rdcId);

	List<ColdStorageSetEntity> findLastNPoint(@Param("id") int id, @Param("npoint") int npoint);

	List<ColdStorageSetEntity> findHasDoorStorage(@Param("rdcId") int rdcId);
	
	List<ColdStorageSetEntity> findByFilter( @Param("iunbalance")Integer iunbalance);
	
	ColdStorageSetEntity findById(@Param("Id") int Id); 
	
}
