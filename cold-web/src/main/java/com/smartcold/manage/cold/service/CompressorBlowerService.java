package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.dto.BlowerDTO;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 23:05)
 */
public interface CompressorBlowerService {

	List<BlowerDTO> findByRdcId(int userid);
}
