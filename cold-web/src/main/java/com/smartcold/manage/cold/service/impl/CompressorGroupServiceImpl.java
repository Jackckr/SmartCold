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
    
    private static StorageType typePower = StorageType.COMPRESSOR_POWER;
    private static StorageType typePressLow = StorageType.COMPRESSOR_PRESS_L;
    private static StorageType typePressHigh = StorageType.COMPRESSOR_PRESS_H;
    
    private List<StorageKeyValue> getNums(StorageType type,int oid,Integer nums){
    	return storageKeyValueDao.findByNums(type.getTable(), oid, type.toString(), nums);
    }

    @Override
    public List<CompressorGroupSetEntity> findByUserId(int userid) {
        RdcUser rdcUser = rdcUserDao.findByUserId(Integer.valueOf(userid));
        if(rdcUser==null) return null;
        return compressGroupSetDao.findLastNPoint(rdcUser.getRdcid());
    }

	@Override
	public List<StorageKeyValue> findPowerByNums(int oid, Integer nums) {
		return getNums(typePower, oid, nums);
	}

	@Override
	public List<StorageKeyValue> findPressLowByNums(int oid, Integer nums) {
		return getNums(typePressLow, oid, nums);
	}

	@Override
	public List<StorageKeyValue> findPressHighByNums(int oid, Integer nums) {
		// TODO Auto-generated method stub
		return getNums(typePressHigh, oid, nums);
	}
}
