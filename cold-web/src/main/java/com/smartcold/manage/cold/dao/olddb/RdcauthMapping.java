package com.smartcold.manage.cold.dao.olddb;

import org.apache.ibatis.annotations.Param;

import com.smartcold.manage.cold.entity.olddb.RdcAuthEntity;

/**
 * Created by qiangzi on 2017/5/18.
 */
public interface RdcauthMapping {
	
	//
    void insertCertification(RdcAuthEntity rdcAuthEntity);
    
  //获得认证消息
  	Integer getRdcAuthByUid(@Param("userId")Integer userId);
    
    

    
    
}
