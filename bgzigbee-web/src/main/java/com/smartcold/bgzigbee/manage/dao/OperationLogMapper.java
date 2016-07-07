package com.smartcold.bgzigbee.manage.dao;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.dto.OperationLogDTO;
import com.smartcold.bgzigbee.manage.entity.OperationLog;

public interface OperationLogMapper {
	
	Page<OperationLogDTO> findByPage();
	
    int deleteByPrimaryKey(Integer id);

    int insert(OperationLog record);

    OperationLog selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(OperationLog record);

    int updateByPrimaryKeyWithBLOBs(OperationLog record);

    int updateByPrimaryKey(OperationLog record);
}