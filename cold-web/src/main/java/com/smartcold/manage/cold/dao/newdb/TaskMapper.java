package com.smartcold.manage.cold.dao.newdb;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.newdb.TaskEntity;

/**
 * 任务处理中心
 * @author MaQiang34
 * class:TaskMapper
 */
public interface TaskMapper {
	
	public void delTempTask(Integer id);
	
	public List<Object> getTaskByUid(Integer uid);
	
	public void addTempTask(TaskEntity task);
	
	public void upTempState(@Param("id")Integer id,@Param("state")Integer state);
	
	
}