package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemValue;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.olddb.ColdStorageSetEntity;


/**
 * 温度告警服务
 * @author MaQiang34
 * class:TempWarningMapper
 */
public interface TempWarningMapper {
	
	//1.获得监控温度的冷库信息
	List<ColdStorageSetEntity> getAllMonitorTempSet();
	//2.
	// 获得最大/最小溫度
	ItemValue getMAITempData(@Param("table")String table,@Param("mv")String mv,@Param("deviceid")String deviceid,@Param("starttime")String starttime, @Param("endtime")String endtime);
	
	Integer getTolTempByDevId(@Param("deviceid")String deviceid,@Param("starttime")String starttime,@Param("endtime")String endtime);
	
   
    List<StorageKeyValue> getOverTempByDevId(@Param("deviceid")String deviceid,@Param("minvalue")Float minvalue,@Param("maxvalue")Float maxvalue,@Param("starttime")String starttime,@Param("endtime")String endtime);
    
	
}
