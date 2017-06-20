package com.smartcold.manage.cold.dao.newdb;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.comm.ItemValue;
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
	// 获得最大/最小溫度/开始时间
	ItemValue getMAITempData(@Param("table")String table,@Param("mv")String mv,@Param("deviceid")String deviceid, @Param("tids") String tids,   @Param("starttime")String starttime, @Param("endtime")String endtime);
	//3.获得超温开始时间
	ItemValue getOverStrtTime(@Param("table")String table,@Param("deviceid")String deviceid,@Param("tids") String tids,  @Param("minTemp")float minTemp,  @Param("starttime")String starttime, @Param("endtime")String endtime);
	//4.获得超温数据进行分析
	List<ItemValue> getOverTempList(@Param("table")String table,@Param("deviceid")String deviceid, @Param("tids") String tids,   @Param("minTemp")Float minTemp,  @Param("starttime")String starttime, @Param("endtime")String endtime);
	
	
	
	
}
