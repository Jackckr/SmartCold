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
}
