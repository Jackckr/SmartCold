package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.CompressorGroupSetEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 14:38)
 */
public interface CompressorGroupService {
    List<CompressorGroupSetEntity> findByUserId(int userid);
}
