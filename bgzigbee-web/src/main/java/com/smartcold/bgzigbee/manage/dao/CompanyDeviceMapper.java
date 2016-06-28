package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import com.smartcold.bgzigbee.manage.entity.CompanyDeviceEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-21 22:38)
 */
public interface CompanyDeviceMapper {

    List<CompanyDeviceEntity> findAll();

}
