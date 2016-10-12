package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

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
    
    /**
     * 根据符合条件的风机配置
     * @param rdcId ：冷库ID
     * @param fanPower： 风扇功率
     * @param frostPower：化霜功率
     * @return
     */
    List<BlowerSetEntity> findByFilter(@Param("rdcId")Integer rdcId,@Param("fanPower")Double fanPower,@Param("frostPower")Double frostPower);
}
