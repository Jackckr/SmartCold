package com.smartcold.bgzigbee.manage.dao;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.ColdStorageSetEntity;
import com.smartcold.bgzigbee.manage.entity.TempSetEntity;


/**
 * 
 * @author maqiang34
 *
 */
public interface TempSetMapper {
	
	public boolean delTempsetById(Integer id);

	public boolean addTempSet(TempSetEntity tempSetEntity);

	public boolean upTempSetById(TempSetEntity tempSetEntity);

	public boolean upTempMappingById(@Param("id") int id, @Param("mapping") String mapping);

	public List<TempSetEntity> findTempSetByStorageId(@Param("storageId") int storageId);
	
	
	
	//过期方法--更新配置后删除--在2017-3-10后删除 
	public void upcoldstoragesetMappingById();
	public List<TempSetEntity> getVTempsetMapper();
	public List<ColdStorageSetEntity> getValidColdMapper();
	
	
	
	
}
