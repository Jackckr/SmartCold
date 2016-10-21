package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.RDCWeightSetEntity;

import org.apache.ibatis.annotations.Param;

/**
 * Author: qiunian.sun Date: qiunian.sun(2016-05-02 10:30)
 */
public interface RdcWeightSetMapper {

	RDCWeightSetEntity findRdcWeightSetByRdcId(@Param("rdcid") int rdcid);
	
	void insertRdcWeight(RDCWeightSetEntity entity);

	void deleteRdcWeight(@Param("id") int id);

}
