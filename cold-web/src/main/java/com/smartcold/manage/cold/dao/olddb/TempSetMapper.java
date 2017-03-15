package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.TempSetEntity;



public interface TempSetMapper {
	
	public List<TempSetEntity> getTempsetByRdcId(@Param("rdcId") Integer rdcId );
	
	public List<TempSetEntity> getTempsetBycoldstorageid(@Param("coldstorageid") Integer coldstorageid );
    
}