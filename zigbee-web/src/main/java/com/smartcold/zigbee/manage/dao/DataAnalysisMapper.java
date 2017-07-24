package com.smartcold.zigbee.manage.dao;


import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface DataAnalysisMapper {
   List<HashMap<String, String>> getDataAnalysisBykey(@Param("type")Integer type,@Param("key")String key,@Param("startTime")Date startTime,@Param("endTime")Date endTime);
}