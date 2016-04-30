package com.smartcold.zigbee.manage.service.impl;

import com.smartcold.zigbee.manage.dao.RdcMapper;
import com.smartcold.zigbee.manage.entity.RdcEntity;
import com.smartcold.zigbee.manage.service.RdcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-04-29 00:14)
 */
@Service
public class RdcServiceImpl implements RdcService {

    @Autowired
    private RdcMapper rdcDao;

    @Override
    public List<RdcEntity> findRdcList() {
        return rdcDao.findRdcList();
    }
}
