package com.smartcold.manage.cold.service.impl;

import com.google.common.collect.Lists;
import com.smartcold.manage.cold.dao.BlowerMapper;
import com.smartcold.manage.cold.dao.BlowerSetMapper;
import com.smartcold.manage.cold.dao.ColdStorageSetMapper;
import com.smartcold.manage.cold.dao.RdcUserMapper;
import com.smartcold.manage.cold.dto.BlowerDTO;
import com.smartcold.manage.cold.entity.BlowerEntity;
import com.smartcold.manage.cold.entity.BlowerSetEntity;
import com.smartcold.manage.cold.entity.ColdStorageSetEntity;
import com.smartcold.manage.cold.entity.RdcUser;
import com.smartcold.manage.cold.service.CompressorBlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-05-02 23:05)
 */
@Service
public class CompressorBlowerServiceImpl implements CompressorBlowerService {

    @Autowired
    private RdcUserMapper rdcUserDao;

    @Autowired
    private BlowerSetMapper blowerSetDao;

    @Autowired
    private BlowerMapper blowerDao;

    @Autowired
    private ColdStorageSetMapper coldStorageSetDao;

    @Override
    public List<BlowerDTO> findByUserId(int userid) {
        RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userid));
        List<ColdStorageSetEntity> storageIdList = coldStorageSetDao.findByRdcId(rdcUser.getRdcid());
        List<BlowerDTO> blowerList = Lists.newArrayList();
        if (storageIdList != null && !storageIdList.isEmpty()) {
            for (ColdStorageSetEntity coldStorageSetEntity : storageIdList) {
                List<BlowerSetEntity> blowerSets = blowerSetDao.findByStorageId(coldStorageSetEntity.getColdStorageID());
                if (blowerSets != null && !blowerSets.isEmpty()) {
                    for (BlowerSetEntity blowerSetEntity : blowerSets) {
                        List<BlowerEntity> blowers = blowerDao.findLastNPoint(blowerSetEntity.getBlowerId(), 1);
                        BlowerEntity blower = blowers.get(0);
                        BlowerDTO blowerDTO = new BlowerDTO();
                        blowerDTO.setAddTime(blower.getAddTime());
                        blowerDTO.setBlowerId(blower.getBlowerId());
                        blowerDTO.setColdStorageId(blowerSetEntity.getColdStorageId());
                        blowerDTO.setCompressorGroupId(blowerSetEntity.getCompressorGroupId());
                        blowerDTO.setDefrostingTemperature(blowerSetEntity.getDefrostingTemperature());
                        blowerDTO.setIsDefrosting(blower.getIsDefrosting());
                        blowerDTO.setIsRunning(blower.getIsRunning());
                        blowerDTO.setState(blower.getState());
                        blowerDTO.setStartTime(blower.getStartTime());
                        blowerDTO.setColdStorageName(coldStorageSetEntity.getName());
                        blowerList.add(blowerDTO);
                    }
                }
            }
        }
        return blowerList;
    }
}
