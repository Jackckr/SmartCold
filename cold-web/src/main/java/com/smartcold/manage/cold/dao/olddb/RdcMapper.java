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
	
	List<Map<String, Object>> findRdcManger();

	List<Rdc> findRDCByRDCId(@Param("rdcID") int rdcID);

	List<Rdc> searchRdc(@Param("filter") String filter);
	
	/**
	 * 360获得有效冷库
	 * @param filter
	 * @return
	 */
	List<Rdc> searchRdcByfilter(@Param("filter") String filter);
	
}