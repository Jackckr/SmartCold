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
	
	public void delAllTempTask();//删除所有临时任务 
	
	public void delTempTaskByID(Integer id);//删除临时任务
	
	public void addTempTask(TaskEntity task);//添加临时任务
	
	public boolean updateTaskStatus(Integer id);//获得任务状态->动态分配任务
	
	public List<Object> getTaskByUid(Integer uid);//获得用户所有有效任务
	
	public void upTempState(@Param("id")Integer id,@Param("state")Integer state);//更新任务状态-》进度，百分比
	
}