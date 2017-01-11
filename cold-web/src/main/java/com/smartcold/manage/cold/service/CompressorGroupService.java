package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.dto.CompressorDto;
import com.smartcold.manage.cold.dto.CompressorGroupWaterCostEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorGroupSetEntity;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 14:38)
 */
public interface CompressorGroupService {
	List<CompressorGroupSetEntity> findByUserId(int userid);

	CompressorGroupWaterCostEntity getWaterCost(int groupid);

	List<CompressorDto> getCompressorsState(int groupId);
	
}
