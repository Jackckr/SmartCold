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
	
	//获得冷库的管理者电话号码
	String findRdcManger(@Param("rdcID") Integer rdcID );
     
	List<Rdc> findRDCByRDCId(@Param("rdcID") int rdcID);
    //根据name 获得所有冷库
	List<Rdc> searchRdc(@Param("filter") String filter);
	//根据名称获得有效360冷库
	List<Rdc> searchRdcByfilter(@Param("filter") String filter);
	//true:dev+plc false:dev
    List<Rdc> getDEVRdc(@Param("isall") Boolean isall);
}