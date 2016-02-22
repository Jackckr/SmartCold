package com.smartcold.manage.cold.dao;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.CompressorGroupEntity;

public interface CompressorGroupMapper {

	public List<CompressorGroupEntity> findLastNPoint(@Param("groupId") int groupId, @Param("npoint") int npoint);

	public List<CompressorGroupEntity> findPointByTime(@Param("groupId") int groupId, @Param("begin") Date begin,
			@Param("end") Date end);
}
