package com.smartcold.zigbee.manage.dao;


import com.smartcold.zigbee.manage.entity.MessageRecord;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by qiangzi on 2017/5/18.
 */
public interface MessageRecordMapping {

    void insertMessageRecord(MessageRecord messageRecord);//添加消息

    /*通过userId和rdcid查询消息*/
    List<MessageRecord> selByUidRdcId(@Param("uid") Integer uid, @Param("rdcId") Integer rdcId);
}
