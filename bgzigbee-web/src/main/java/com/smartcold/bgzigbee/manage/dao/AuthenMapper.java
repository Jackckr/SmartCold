package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.RdcAuthEntity;

public interface AuthenMapper {
	
	public void updateAuthstate(@Param("id")Integer id,@Param("ishandle")Integer ishandle,@Param("state")Integer state,@Param("note")String note);
	
	public Page<RdcAuthEntity> getRdcAuthList(@Param("type")Integer type,@Param("state")Integer state,@Param("coleam")String coleam,@Param("colval")String colval);
	
	
	
}