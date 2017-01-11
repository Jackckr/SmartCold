package com.smartcold.manage.cold.dao.newdb;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.ReportDailyEntity;

public interface ReportMonthlyMapper {

	public ReportDailyEntity findByStorageIdDate(@Param("storageid") int storageid, @Param("day") Date day);

	public List<ReportDailyEntity> findReportsByStorageId(@Param("storageid") int storageid, @Param("begin") Date begin,
			@Param("end") Date end);
}
