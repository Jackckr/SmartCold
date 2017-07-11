package com.smartcold.bgzigbee.manage.dao;

/**
 * Created by qiangzi on 2017/7/9.
 */
public interface RdcAuthMapper {
    /*通过rdcid删除达标信息*/
    void delStandByRdcId(int rdcId);
    /*通过userid删除vip信息*/
    void delVipByUid(int userId);
}
