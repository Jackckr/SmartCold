package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 14:38)
 */
public interface CompressorGroupService {
    List<CompressorGroupSetEntity> findByUserId(int userid);
}
