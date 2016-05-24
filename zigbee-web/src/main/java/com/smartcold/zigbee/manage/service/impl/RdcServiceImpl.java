package com.smartcold.zigbee.manage.service.impl;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.smartcold.zigbee.manage.dao.*;
import com.smartcold.zigbee.manage.dto.RdcDTO;
import com.smartcold.zigbee.manage.entity.*;
import com.smartcold.zigbee.manage.service.RdcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-04-29 00:14)
 */
@Service
public class RdcServiceImpl implements RdcService {

    @Autowired
    private RdcMapper rdcDao;

    @Autowired
    private RdcExtMapper rdcExtDao;

    @Autowired
    private StorageManageTypeMapper storageManageTypeDao;

    @Autowired
    private StorageTemperTypeMapper storageTemperTypeDao;

    @Autowired
    private StorageTypeMapper storageTypeDao;

    @Override
    public List<RdcEntity> findRdcList() {
        return rdcDao.findRdcList();
    }

    @Override
    public List<RdcDTO> findAllRdcDtos() {
        List<RdcDTO> rdcDTOs = Lists.newArrayList();

        List<RdcEntity> rdcList = rdcDao.findRdcList();
        List<RdcExtEntity> rdcExtList = rdcExtDao.findRdcExtList();
        List<StorageManageTypeEntity> manageTypes = storageManageTypeDao.findAll();
        List<StorageTemperTypeEntity> temperTypes = storageTemperTypeDao.findAll();
        List<StorageTypeEntity> storageTypes = storageTypeDao.findAll();
        if (!CollectionUtils.isEmpty(rdcList)) {
            for (RdcEntity rdcEntity : rdcList) {
                RdcDTO rdcDTO = new RdcDTO();
                rdcDTO.setId(rdcEntity.getId());
                rdcDTO.setProvinceId(rdcEntity.getProvinceId());
                rdcDTO.setSqm(rdcEntity.getSqm());
                String manageType = "";
                String temperType = "";
                String storageType = "";
                String storageTruck = "无";
                if (!CollectionUtils.isEmpty(rdcExtList)) {
                    for (RdcExtEntity rdcExtEntity : rdcExtList) {
                        if (rdcExtEntity.getRdcId() == rdcEntity.getId()) {
                            if (!CollectionUtils.isEmpty(manageTypes)) {
                                for (StorageManageTypeEntity storageManageTypeEntity : manageTypes) {
                                    if (rdcExtEntity.getCompanykind() == storageManageTypeEntity.getId()) {
                                        manageType = storageManageTypeEntity.getType();
                                    }
                                }
                            }
                            if (!CollectionUtils.isEmpty(temperTypes)) {
                                for (StorageTemperTypeEntity storageTemperTypeEntity : temperTypes) {
                                    if (rdcExtEntity.getCompanykind() == storageTemperTypeEntity.getId()) {
                                        temperType = storageTemperTypeEntity.getType();
                                    }
                                }
                            }
                            if (!CollectionUtils.isEmpty(storageTypes)) {
                                for (StorageTypeEntity storageTypeEntity : storageTypes) {
                                    if (rdcExtEntity.getCompanykind() == storageTypeEntity.getId()) {
                                        storageType = storageTypeEntity.getType();
                                    }
                                }
                            }
                            if (Strings.isNullOrEmpty(rdcExtEntity.getStoragetruck())) {
                                storageTruck = "有";
                            }
                        }
                    }
                }
                rdcDTO.setCompanykind(manageType);
                rdcDTO.setStoragetempertype(temperType);
                rdcDTO.setStoragetype(storageType);
                rdcDTO.setStoragetruck(storageTruck);
                rdcDTO.setRdcEntity(rdcEntity);
                rdcDTOs.add(rdcDTO);
            }
        }
        return rdcDTOs;
    }
}
