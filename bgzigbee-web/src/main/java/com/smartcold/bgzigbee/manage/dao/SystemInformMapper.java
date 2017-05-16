package com.smartcold.bgzigbee.manage.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;

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

    List<HashMap<String,Object>> getNoReadSystemInform();

    void changeIsRead(Integer id);

    void changeState(Integer id);

    HashMap<String,Object> getSystemInformByID(Integer id);
    
    Page<HashMap<String,Object>> getSystemInform(@Param("type") Integer type, @Param("stype") Integer stype,@Param("isRead") Integer isRead , @Param("status")Integer status, @Param("keyword") String keyword);
}
