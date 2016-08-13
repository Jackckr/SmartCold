package com.smartcold.zigbee.manage.dao;


import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

/**
 * 工具类：提供公共组件数据
 * @author maqiang
 *
 */
public interface CommonMapper {
	
	List<Map<String, Object>> getCommData(@Param("codetype")String codetype);
	
	List<Map<String, Object>> getCommDataByID(@Param("type_code")Integer type_code,@Param("codetype")String codetype);
	
	List<Map<String, Object>> getBaseData(@Param("table")String table,@Param("code")String code,@Param("value")String value);
	
    List<Map<String, Object>> getBaseDataByID(@Param("table")String table,@Param("code")String code,@Param("value")String value,@Param("id")Integer id);
    
    
    
    
}
