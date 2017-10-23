package com.smartcold.manage.cold.dao.olddb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.xmlbeans.impl.xb.xmlconfig.NamespaceList.Member2.Item;
import org.junit.runners.Parameterized.Parameters;

import com.smartcold.manage.cold.entity.comm.ItemConf;
import com.smartcold.manage.cold.entity.olddb.ConversionEntity;


public interface CongfigMapper {
	
	
	public ItemConf  findRdcConfByDevId(@Param("devid")String devid);
	
	//1.获得常规配置
	public List<HashMap<String, Object>>  getObjMappingByRdcId(@Param("table") String table ,@Param("rdcId") String rdcId);
	//2.获得风机配置
	public List<HashMap<String, Object>>  getBlowerMappingByRdcId     (@Param("rdcId") String rdcId);
	//3.windscreenset
	public List<HashMap<String, Object>>  getWindscMappingByRdcId     (@Param("rdcId") String rdcId);
	//4.单体压缩机机的配置                                            
	public List<HashMap<String, Object>>  getCompreMappingByRdcId     (@Param("rdcId") String rdcId);
	//冷凝系统水泵
	public List<HashMap<String, Object>>  getEvaporativewatersetByRdcId(@Param("rdcId") String rdcId);
	//冷凝系统风机
	public List<HashMap<String, Object>>  getEvaporativeblowersetByRdcId         (@Param("rdcId") String rdcId);//evaporativewaterset
	//获得其他配置（单位转换，值类型转换）
	
	public List<ConversionEntity>  getOHMappingByRdcId(@Param("kv")int kv,@Param("oid") String oid);
	
	
}
