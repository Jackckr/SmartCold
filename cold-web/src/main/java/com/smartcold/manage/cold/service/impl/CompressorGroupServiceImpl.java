package com.smartcold.manage.cold.service.impl;

import com.smartcold.manage.cold.dao.CompressorGroupSetMapper;
import com.smartcold.manage.cold.dao.RdcUserMapper;
import com.smartcold.manage.cold.dao.StorageKeyValueMapper;
import com.smartcold.manage.cold.entity.CompressorGroupSetEntity;
import com.smartcold.manage.cold.entity.RdcUser;
import com.smartcold.manage.cold.entity.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.CompressorGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 14:38)
 */
@Service
public class CompressorGroupServiceImpl implements CompressorGroupService {

    @Autowired
    private CompressorGroupSetMapper compressGroupSetDao;

    @Autowired
    private RdcUserMapper rdcUserDao;
    
    @Autowired
    private StorageKeyValueMapper storageKeyValueDao;
    

    @Override
    public List<CompressorGroupSetEntity> findByUserId(int userid) {
        RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userid));
        if(rdcUser==null) return null;
        return compressGroupSetDao.findByRdcId(rdcUser.getRdcid());
    }

}
