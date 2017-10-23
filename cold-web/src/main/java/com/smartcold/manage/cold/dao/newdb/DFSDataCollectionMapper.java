package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemValue;




public interface DFSDataCollectionMapper {

	public void additem(ItemValue data);
	
	public void adddataList(@Param("table")String table,@Param("list")List<ItemValue> data);
	
	
}
