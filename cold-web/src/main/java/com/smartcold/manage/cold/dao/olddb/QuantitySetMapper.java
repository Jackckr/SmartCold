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
    //======================================================Q2======================================================
   
	@Deprecated
    List<HashMap<String, Object>> findColdstorages();// //有效值：rdcid->rdcid, ids->映射oid
    
    List<HashMap<String, String>> findBlowerData(@Param("ids")String ids);//有效值：ids->BlowerSet id集合, frostPowers->功率集合
    //======================================================Q3======================================================
    List<HashMap<String, String>> getCountforkliftset();//叉车功率信息
    
    //======================================================Q4======================================================
    //======================================================Q5======================================================
    //======================================================Q6======================================================
    //======================================================Q7======================================================

}
