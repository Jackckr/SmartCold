package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.smartcold.manage.cold.entity.olddb.CompressorSetEntity;

/**
 * 计算Q
 * @author MaQiang34
 *
 */
public interface QuantityMapper {
	//获得任务状态->动态分配任务
	public boolean updateTaskStatus(Integer id);
	//获得机组运行时间
	List<CompressorSetEntity>   getcoldstoraginfo(@Param("oids")Object oids);
	public Double getSumRunTime(@Param("oid")Object oid,@Param("stTime")Date stTime);
	//获得Qsis
	public List<HashMap<String, Object>> getQuantitsis(@Param("rdcId")int rdcId,@Param("stTime")String stTime);
	//获得商品流转信息
	public List<HashMap<String, Object>>  getGoodQuantit(@Param("oid")int oid,@Param("stTime")String stTime,@Param("edTime")String edTime);
	//360体检->因子平均值集合
	public List<HashMap<String, Object>> getAVGTempYinZi(@Param("oid")Object oid,@Param("stTime")String stTime,@Param("edTime")String edTime);
	
    //======================================================Q6======================================================
	// 检查是否有设备->根据是否有数据判断PLC
	public Integer getCountBydevkey(@Param("deviceid")Object deviceid,@Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);
	public Integer getCountBykey(@Param("oid")Object oid,@Param("table")String table, @Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);
	//查询指定key平均值
	public Double getSisBayKey(@Param("type")int type,@Param("oid")int oid,@Param("key")String key,@Param("stTime")String stTime,@Param("edTime")String edTime);
    //======================================================Q7======================================================

}
