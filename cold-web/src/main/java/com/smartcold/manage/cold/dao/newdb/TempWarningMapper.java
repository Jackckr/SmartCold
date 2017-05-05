package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;


/**
 * 温度告警服务
 * @author MaQiang34
 * class:TempWarningMapper
 */
public interface TempWarningMapper {
	
	Integer getCountOverTempByDevId(@Param("deviceid")String deviceid,@Param("starttime")String starttime);
   // 获得超温的数据
	Double getMaxTempByDevId(@Param("deviceid")String deviceid, @Param("minvalue")float minvalue, @Param("starttime")String starttime);
   
    List<StorageKeyValue> getOverTempByDevId(@Param("deviceid")String deviceid,@Param("minvalue")Float minvalue,@Param("maxvalue")Float maxvalue,@Param("starttime")String starttime,@Param("endtime")String endtime);
    
    
    void addSyswarningsinfo(List<SysWarningsInfo> data);
	
}
