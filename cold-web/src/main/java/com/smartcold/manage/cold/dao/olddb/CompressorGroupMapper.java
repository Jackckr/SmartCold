package com.smartcold.manage.cold.dao.olddb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.CompressorGroupEntity;

public interface CompressorGroupMapper {

	public List<CompressorGroupEntity> findLastNPoint(@Param("groupId") int groupId, @Param("npoint") int npoint);

	public List<CompressorGroupEntity> findPointByTime(@Param("groupId") int groupId, @Param("begin") Date begin,
			@Param("end") Date end);
}
