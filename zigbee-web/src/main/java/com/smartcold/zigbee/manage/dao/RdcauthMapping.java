package com.smartcold.zigbee.manage.dao;


import com.smartcold.zigbee.manage.entity.RdcAuthEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;


/**
 * Created by qiangzi on 2017/5/18.
 */
public interface RdcauthMapping {
	
	//
    void insertCertification(RdcAuthEntity rdcAuthEntity);

    /*通过userId和rdcid查询认证*/
    List<RdcAuthEntity> selByUidRdcId(@Param("uid") Integer uid, @Param("rdcId") Integer rdcId);
    /*通过用户id查询改用申请的认证*/
    List<RdcAuthEntity> selByAuditUid(int userId);
    /*通过冷库id查询该冷库申请的认证*/
    List<RdcAuthEntity> selAuditRdcId(@Param("rdcId") int rdcId,@Param("userId") int userId);
    /*通过冷库id查询该冷库申请的达标认证*/
    List<RdcAuthEntity> selStandRdcId(int rdcId);
    /*通过rdcId删除相关认证消息*/
    int delByRdcId(int rdcId);
}
