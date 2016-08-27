package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.CompressorSetEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CompressorSetMapper {

	CompressorSetEntity findById(@Param("id") int id);

	List<CompressorSetEntity> findCompressorByGroupid(@Param("groupId") int groupId);

	boolean insert(CompressorSetEntity compressorSetEntity);

	boolean updateById(CompressorSetEntity entity);

	boolean deleteById(@Param("id") int id);
}
