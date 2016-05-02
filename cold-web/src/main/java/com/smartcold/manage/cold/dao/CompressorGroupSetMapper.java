package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.CompressorGroupSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 14:24)
 */
public interface CompressorGroupSetMapper {

    List<CompressorGroupSetEntity> findLastNPoint(@Param("rdcId") int rdcId);

}
