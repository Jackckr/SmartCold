package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import com.smartcold.bgzigbee.manage.entity.ProvinceListEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 15:57)
 */
public interface ProvinceListMapper {

    List<ProvinceListEntity> findProvinceList();

}
