package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.dto.BlowerDTO;
import com.smartcold.manage.cold.entity.BlowerSetEntity;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 23:05)
 */
public interface CompressorBlowerService {

    List<BlowerDTO> findByUserId(int userid);
}
