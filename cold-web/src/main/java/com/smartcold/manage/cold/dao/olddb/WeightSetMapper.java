package com.smartcold.manage.cold.dao.olddb;

import com.smartcold.manage.cold.entity.olddb.WeightSetEntity;

/**
 * 获得RDC占比配置
 * @author MaQiang34
 *
 */
public interface WeightSetMapper {
	
	public  WeightSetEntity  getWeightSet(Integer rdcid);

}
