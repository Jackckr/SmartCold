package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.dto.ColdStorageTemperDTO;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-01 23:31)
 */
public interface ColdStorageService {

    List<ColdStorageTemperDTO> getTemperInfoById(int storageID, int npoint);

}
