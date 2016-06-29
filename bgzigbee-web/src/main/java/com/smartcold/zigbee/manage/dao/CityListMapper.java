package com.smartcold.zigbee.manage.dao;

import com.smartcold.zigbee.manage.entity.CityListEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-28 16:05)
 */
public interface CityListMapper {
    List<CityListEntity> findCitysByProvinceId(@Param("provinceID") int provinceID);

    CityListEntity findCityById(@Param("CityID") int CityID);
}
