package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

/**
 * 
 *@author Kaiqiang Jiang
 *@date:2016-6-22 上午11:11:51
 *@Description: Admin Mapper
 */
public interface SystemInformMapper {
    /**
     * @return
     */
    List<HashMap<String,Object>> getSystemInform(@Param("type") Integer type, @Param("stype") Integer stype,
           @Param("isRead") Integer isRead , @Param("status")Integer status, @Param("keyword") String keyword);
}
