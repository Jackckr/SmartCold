package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;


/**
 * 温度告警服务
 * @author MaQiang34
 * class:TempWarningMapper
 */
public interface TempWarningMapper {
	
	Integer getTolTempByDevId(@Param("deviceid")String deviceid,@Param("starttime")String starttime,@Param("endtime")String endtime);
   // 获得超温的数据
	Double getMaxTempByDevId(@Param("deviceid")String deviceid, @Param("minvalue")float minvalue, @Param("starttime")String starttime, @Param("endtime")String endtime);
	
	Double getMinTempByDevId(@Param("deviceid")String deviceid, @Param("minvalue")float minvalue, @Param("starttime")String starttime, @Param("endtime")String endtime);
   
    List<StorageKeyValue> getOverTempByDevId(@Param("deviceid")String deviceid,@Param("minvalue")Float minvalue,@Param("maxvalue")Float maxvalue,@Param("starttime")String starttime,@Param("endtime")String endtime);
    
	
}
