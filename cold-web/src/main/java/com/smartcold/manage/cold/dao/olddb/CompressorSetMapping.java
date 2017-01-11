package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;

public interface CompressorSetMapping {

	CompressorSetEntity findCompressorByid(@Param("id") int id);

	List<CompressorSetEntity> findCompressorByGroupid(@Param("groupId") int groupId);
}
