package com.smartcold.manage.cold.dao.olddb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;


public interface CongfigMapper {
	//1.获得常规配置
	public List<HashMap<String, Object>>  getObjMappingByRdcId(@Param("table") String table ,@Param("rdcId") String rdcId);
	//2.获得风机配置
	public List<HashMap<String, Object>>  getBlowerMappingByRdcId     (@Param("rdcId") String rdcId);
	//3.windscreenset
	public List<HashMap<String, Object>>  getWindscMappingByRdcId     (@Param("rdcId") String rdcId);
	//4.单体压缩机机的配置                                            
	public List<HashMap<String, Object>>  getCompreMappingByRdcId     (@Param("rdcId") String rdcId);
	//冷凝系统水泵
	public List<HashMap<String, Object>>  getEvaporativeMappingByRdcId(@Param("rdcId") String rdcId);
	//冷凝系统风机
	public List<HashMap<String, Object>>  getEBMappingByRdcId         (@Param("rdcId") String rdcId);

	
	
}
