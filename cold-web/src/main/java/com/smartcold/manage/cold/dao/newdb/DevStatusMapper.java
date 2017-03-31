package com.smartcold.manage.cold.dao.newdb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageDataCollectionEntity;
/**
 * 设备状态信息
 * @author Administrator
 *
 */
public interface DevStatusMapper {
	
   public Integer getApplByApID(@Param("apid")String apid);
   
	public List<HashMap<String, String>> getDevPLbyApID(@Param("apid")String apid);
	
	public void addAPStatusList(List<StorageDataCollectionEntity> batchEntity);
	
	public void addDevStatusList(List<StorageDataCollectionEntity> batchEntity);
	
	

	
}
