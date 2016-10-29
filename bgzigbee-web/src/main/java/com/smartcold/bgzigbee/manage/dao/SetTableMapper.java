package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.bgzigbee.manage.dto.ColumnDescDTO;
import com.smartcold.bgzigbee.manage.dto.RdcIdAndNameDTO;

/**
 * Created by corly on 16-8-13.
 */
public interface SetTableMapper {
	boolean updateMapping(@Param("table") String table, @Param("mapping") String mapping, @Param("id") int id);

	boolean deleteById(@Param("table") String table, @Param("id") int id);

	List<ColumnDescDTO> findFiledsAndComment(@Param("table") String table);

	List findByRdcId(@Param("table") String table, @Param("rdcid") int rdcid);

	boolean insert(RdcIdAndNameDTO rdcIdAndNameDTO);

	boolean updateObj(@Param("table") String table, @Param("id") Integer id, @Param("name") String name,
			@Param("power") double power);

	boolean updateObj(@Param("table") String table, @Param("id") Integer id, @Param("name") String name,
			@Param("power") double power, @Param("platformdoorid") int platformdoorid);

}
