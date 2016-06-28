package com.smartcold.bgzigbee.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.entity.CityListEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-28 16:05)
 */
public interface CityListMapper {
    List<CityListEntity> findCitysByProvinceId(@Param("provinceID") int provinceID);

    CityListEntity findCityById(@Param("CityID") int CityID);
}
