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
    List<RdcSharedInfoEntity> findShareInfo(@Param("startTime") Date startTime);
}
