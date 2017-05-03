package com.smartcold.manage.cold.dao.olddb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.Rdc;

public interface RdcMapper {
	int deleteByPrimaryKey(Integer id);

	int insert(Rdc record);

	int insertSelective(Rdc record);

	Rdc selectByPrimaryKey(Integer id);

	int updateByPrimaryKeySelective(Rdc record);

	int updateByPrimaryKey(Rdc record);

	List<Rdc> findRdcList();
	
	String findRdcManger(@Param("rdcID") Integer rdcID );

	List<Rdc> findRDCByRDCId(@Param("rdcID") int rdcID);

	List<Rdc> searchRdc(@Param("filter") String filter);
	
	/**
	 * 360获得有效冷库
	 * @param filter
	 * @return
	 */
	List<Rdc> searchRdcByfilter(@Param("filter") String filter);
	
}