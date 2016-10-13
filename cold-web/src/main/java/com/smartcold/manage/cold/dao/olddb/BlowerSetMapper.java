package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.BlowerSetEntity;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 23:31)
 */
public interface BlowerSetMapper {
	
	/**
	 * 
	 * @param coldStorageId
	 * @return
	 */
    List<BlowerSetEntity> findByStorageId(int coldStorageId);
    
}
