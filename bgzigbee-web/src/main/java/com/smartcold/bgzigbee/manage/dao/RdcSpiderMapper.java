package com.smartcold.bgzigbee.manage.dao;

import com.smartcold.bgzigbee.manage.entity.RdcSpider;

/**
 * Created by qiangzi on 2017/10/16.
 */
public interface RdcSpiderMapper {
    void addSpider(RdcSpider rdcSpider);

    void updateSpider(RdcSpider rdcSpider);

    RdcSpider selectByRdcId(Integer rdcId);
}
