package com.smartcold.manage.cold.dao.olddb;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

/**
 * 获得配置
 * @author MaQiang34
 *
 */
public interface QuantitySetMapper {
	
    //======================================================Q======================================================
	//Q7 获得门配置方法
	@Deprecated
	List<HashMap<String, Object>>  getColdstorageset();//根据冷库分组 获得换气配置集合
	//下面方法用于替换上面方法
	List<HashMap<String, Object>>   getColdstorageseting();//1
	Double  getHNbyOid(@Param("oid")Object oid,@Param("humidity")Object humidity,@Param("temperature")Object temperature);//2 获得含烷值
	Double  getventilationSet(@Param("cgvolume")Object cgvolume);//3 获得换气次数
	
	
	List<HashMap<String, Object>> getcoldstoragedoorset();//根据门配置集合 coldstorageid oid
    //有效值：ids->BlowerSet id集合, frostPowers->风扇功率集合
	List<HashMap<String, Object>> findFanPower(@Param("ids")String ids);
	//有效值：ids->BlowerSet id集合, frostPowers->化霜功率集合
    List<HashMap<String, Object>> findFrostPower(@Param("ids")String ids);
    //获得配置表集合
//    List<HashMap<String, Object>> findColdstorages(@Param("talbe")String talbe);//根据rdc分组排序
    //获得指定配置信息功率信息
    List<HashMap<String, Object>> getLightPowerByCoid(@Param("coid")Object  coid);//获得灯组功率
    List<HashMap<String, Object>> getPowerGroupByRDC(@Param("talbe")String talbe,@Param("rdcid")Object rdcids);//获得叉车平均功率
    //======================================================Q======================================================

}
