package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.WarningMintEntity;



public interface WarningMintMapper {
	
	public void upWarningMintEntity(WarningMintEntity obj);
	
	public void addWarningMintEntity(WarningMintEntity obj);
	
	public void delMaintAlarmByIds(@Param("ids")String ids);
	
	public void upMaintAlarmstatuByIds( @Param("status")int status,  @Param("ids")String ids);
	
	
	public List<WarningMintEntity> getMaintAlarmByFilter(@Param("rdcid")int rdcid, @Param("status")Integer status,@Param("level")Integer level,@Param("keyword")String keyword);
	
	
	
}
