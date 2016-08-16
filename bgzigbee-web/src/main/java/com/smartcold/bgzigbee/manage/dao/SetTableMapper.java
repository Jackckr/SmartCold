package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

/**
 * Created by corly on 16-8-13.
 */
public interface SetTableMapper {
    public boolean updateMapping(@Param("table") String table, @Param("mapping") String mapping, @Param("id")int id);

    public boolean deleteById(@Param("table")String table, @Param("id") int id);
}
