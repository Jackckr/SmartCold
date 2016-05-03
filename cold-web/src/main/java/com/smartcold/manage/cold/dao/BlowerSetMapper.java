package com.smartcold.manage.cold.dao;

import com.smartcold.manage.cold.entity.BlowerSetEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 23:31)
 */
public interface BlowerSetMapper {
    List<BlowerSetEntity> findByStorageId(int coldStorageId);
}
