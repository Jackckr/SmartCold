package com.smartcold.manage.cold.dao.newdb;

import java.util.HashMap;
import java.util.List;




import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.SysWarningsInfo;


/**
 * 新的告警Mappe（用于替换其他告警）
 * @author MaQiang34
 * class:SysWarningsInfoMapper
 */
public interface SysWarningsInfoMapper {
	
    
    void addSyswarningsinfo(List<SysWarningsInfo> data);
	
    List<HashMap<String, Integer>> getTempWanningCoun(@Param("starttime")String starttime);
    
    Integer getSysWarcountByFilter(@Param("rdcid")Integer rdcid,@Param("type")Integer type,@Param("starttime")String starttime,@Param("endtime")String endtime );
    
    List<SysWarningsInfo> getSysWarningByFilter(@Param("rdcid")Integer rdcid,@Param("oids")String oids,@Param("type")Integer type,@Param("level")Integer level,@Param("starttime")String starttime,@Param("endtime")String endtime );
}
