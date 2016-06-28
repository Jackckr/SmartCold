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
    List<Map<String, Object>> getBaseData(@Param("table")String table,@Param("code")String code,@Param("value")String value);
}
