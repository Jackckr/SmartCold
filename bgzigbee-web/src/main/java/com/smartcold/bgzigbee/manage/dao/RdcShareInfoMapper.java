package com.smartcold.bgzigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.RdcSharedInfoEntity;

import java.util.HashMap;
import java.util.List;

/**
 * Created by qiangzi on 2017/5/24.
 */
public interface RdcShareInfoMapper {
    List<RdcSharedInfoEntity> findShareInfo();
}
