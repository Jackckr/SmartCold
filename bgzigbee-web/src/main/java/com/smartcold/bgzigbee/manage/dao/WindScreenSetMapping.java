package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.WindScreenSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface WindScreenSetMapping {

	WindScreenSetEntity findById(@Param("id") int id);

	List<WindScreenSetEntity> findByStorageId(@Param("storageid") int storageid);

	boolean insert(WindScreenSetEntity windScreenSetEntity);

	void delete(@Param("id") int id);

	void update(WindScreenSetEntity windScreenSetEntity);
}
