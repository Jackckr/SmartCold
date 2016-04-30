package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.Rdc;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RdcMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Rdc record);

    int insertSelective(Rdc record);

    Rdc selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Rdc record);

    int updateByPrimaryKey(Rdc record);

    List<Rdc> findRdcList();

    List<Rdc> findRDCByRDCId(@Param("rdcID") int rdcID);
}