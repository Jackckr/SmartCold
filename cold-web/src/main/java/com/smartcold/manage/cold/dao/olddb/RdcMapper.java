package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.Rdc;

import java.util.List;
import java.util.Map;

public interface RdcMapper {
	int deleteByPrimaryKey(Integer id);

	int insert(Rdc record);

	int insertSelective(Rdc record);

	Rdc selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Rdc record);

	int updateByPrimaryKey(Rdc record);

	List<Rdc> findRdcList();
	
	List<Map<String, String>> findRdcManger();

	List<Rdc> findRDCByRDCId(@Param("rdcID") int rdcID);

	List<Rdc> searchRdc(@Param("filter") String filter);
}