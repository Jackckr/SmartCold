package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.DeviceObjectMappingEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by corly on 16-8-20.
 */
public interface DeviceObjectMappingMapper {
    boolean insert(DeviceObjectMappingEntity deviceObjectMappingEntity);

    List<DeviceObjectMappingEntity> findByTypeOid(@Param("type") int type, @Param("oid")int oid);

}
