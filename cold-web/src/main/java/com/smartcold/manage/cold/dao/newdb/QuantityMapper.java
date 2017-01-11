package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.DeviceObjectMappingEntity;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;

/**
 * 计算Q
 * @author MaQiang34
 * class:MsgServiceimp
 */
public interface QuantityMapper {
	public boolean updateTaskStatus(Integer id);//获得任务状态->动态分配任务
	//======================================================压缩机组定时保养信息======================================================
	public List<CompressorSetEntity>   getcoldstoraginfo(@Param("oids")Object oids);//获得机组保养信息时间
	public Double getSumRunTime(@Param("oid")Object oid,@Param("stTime")Date stTime);//获得单体压缩机运行时间
	//======================================================360体检信息===========================================================
	//获得商品流转信息
	public List<HashMap<String, Object>>  getGoodQuantit(@Param("oid")int oid,@Param("stTime")String stTime,@Param("edTime")String edTime);
	//360体检->因子平均值集合
	public List<HashMap<String, Object>> getAVGTempYinZi(@Param("oid")Object oid,@Param("stTime")String stTime,@Param("edTime")String edTime);
	//获得Q信息
	public List<HashMap<String, Object>> getQuantitsis(@Param("rdcId")int rdcId,@Param("stTime")String stTime,@Param("endTime")String endTime);//获得Qsis
	
	public List<HashMap<String, Object>> getWarCountByTime(@Param("rdcId")Integer rdcId,@Param("stTime")String stTime ,@Param("edTime")String edTime);//获得高低报警次数->360体检
	public List<HashMap<String, Object>> getMothReportsisByrdcId(@Param("rdcId")Integer rdcId,@Param("startTime")String startTime ,@Param("endTime")String endTime);//获得月报表信息
	// 检查是否有设备->根据是否有数据判断PLC
	public Integer getCountBydevkey(@Param("deviceid")Object deviceid,@Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);
	public Integer getCountBykey(@Param("oid")Object oid,@Param("table")String table, @Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);
	//查询指定key平均值
	public Double getSisBayKey(@Param("type")int type,@Param("oid")int oid,@Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);
    //======================================================系统效率分析===========================================================
	public List<HashMap<String, Object>> getsumEByRdcid(@Param("rdcId")int rdcId,@Param("stTime")String stTime,@Param("endTime")String endTime);//計算電量E
	public List<HashMap<String, Object>> getsumQByRdcid(@Param("rdcId")int rdcId,@Param("stTime")String stTime,@Param("endTime")String endTime);//計算電量Q
	//======================================================门超时报警分析==================================================================
	public List<DeviceObjectMappingEntity>   getDoorDevMapper(); 
	public Double  getSwitchTime(@Param("deviceid")String deviceid,@Param("stTime")String stTime,@Param("value")Integer value);
	//======================================================月报表======================================================
	public String getCompNameByRdcId(@Param("rdcId")int rdcId);
	public List<HashMap<String, Object>> getSumKeyByRdcId(@Param("rdcId")int rdcId,@Param("table")String table,@Param("type")int type,@Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);

}
