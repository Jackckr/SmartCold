package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.ProvinceListEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 15:57)
 */
public interface ProvinceListMapper {

    List<ProvinceListEntity> findProvinceList();

}
