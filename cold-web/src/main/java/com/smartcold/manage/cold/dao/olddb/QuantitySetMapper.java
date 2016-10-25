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
	List<HashMap<String, Object>>  getColdstorageset();//根据冷库分组 获得换气配置集合
	
	List<HashMap<String, Object>> getcoldstoragedoorset();//根据门配置集合 coldstorageid oid
    //有效值：ids->BlowerSet id集合, frostPowers->风扇功率集合
	List<HashMap<String, Object>> findFanPower(@Param("ids")String ids);
	//有效值：ids->BlowerSet id集合, frostPowers->化霜功率集合
    List<HashMap<String, Object>> findFrostPower(@Param("ids")String ids);
    //获得配置表集合
//    List<HashMap<String, Object>> findColdstorages(@Param("talbe")String talbe);//根据rdc分组排序
    //获得指定配置信息功率信息
    List<HashMap<String, String>> getPowerGroupByRDC(@Param("talbe")String talbe,@Param("rdcid")Object rdcids);
    //======================================================Q======================================================

}
