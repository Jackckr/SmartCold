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
}
