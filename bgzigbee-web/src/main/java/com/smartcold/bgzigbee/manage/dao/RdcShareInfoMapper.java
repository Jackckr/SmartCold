package com.smartcold.bgzigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.RdcSharedInfoEntity;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created by qiangzi on 2017/5/24.
 */
public interface RdcShareInfoMapper {
    List<RdcSharedInfoEntity> findShareInfo(@Param("type") String type,@Param("stauts") String stauts,@Param("keyword")String keyword,@Param("startTime") Date sTime,@Param("endTime") Date eTime);

    RdcSharedInfoEntity findShareInfoById(Integer id);

    void delShareInfoById(Integer id);

    int delByRdcId(int rdcId);
}
