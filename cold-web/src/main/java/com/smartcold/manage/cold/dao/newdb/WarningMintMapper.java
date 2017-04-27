package com.smartcold.manage.cold.dao.newdb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.MaintorderEntity;
import com.smartcold.manage.cold.entity.newdb.WarningMintEntity;


public interface WarningMintMapper {
	
	public void upWarningMintEntity(WarningMintEntity obj);
	
	public void addWarningMintEntity(WarningMintEntity obj);
	
	public void delMaintAlarmByIds(@Param("ids")String ids);
	
	public void addMaintorder(List<MaintorderEntity> maintorderList);
	
	public List<WarningMintEntity> getWarningMintById(@Param("ids")String ids);
	
	public List<HashMap<String, Object>> getWarningType(@Param("pid")Integer pid);
	
	public List<WarningMintEntity> getMaintAlarmByFilter(@Param("rdcid")int rdcid, @Param("status")String status,@Param("level")Integer level,@Param("keyword")String keyword);
	
	public void upMaintAlarmstatuByIds( @Param("ids") String ids,@Param("userId") Integer userId, @Param("status") Integer status,@Param("desc") String desc);
	
	public void addMaintconFirma( @Param("rdcId") int rdcId,   @Param("maintid") int  maintid,@Param("starttime") String starttime,@Param("endtime") String endtime,@Param("phenomena") String phenomena,@Param("maintresult") String maintresult,@Param("cost") Double	cost,@Param("note") String	note,@Param("serverType") String	serverType);
	
	
}
