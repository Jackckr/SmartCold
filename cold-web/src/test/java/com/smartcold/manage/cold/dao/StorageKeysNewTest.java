package com.smartcold.manage.cold.dao;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.smartcold.manage.cold.dao.newdb.NewStorageKeysMapper;
import com.smartcold.manage.cold.entity.newdb.NewStorageKeysEntity;
import com.smartcold.manage.cold.entity.newdb.StorageKeyValue;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class StorageKeysNewTest {
	@Autowired
	NewStorageKeysMapper storageKeysNewMapper;
	@Autowired
	StorageService storageKeyValueService;
	
//	@Test
//	public void findData(){
//		List<NewStorageKeys> lists = storageKeysNewMapper.findAll();
//		assertTrue(lists.size()>0);
//	}

	
	@Test
	public void updateStorageKeys(){
		for(StorageType type:StorageType.values()){
			NewStorageKeysEntity storageKeys = new NewStorageKeysEntity();
			storageKeys.setType(type.getType());
			storageKeys.setKey(type.toString());
			storageKeys.setDesc(type.getDesc());
			boolean res = storageKeysNewMapper.saveOrUpdateByType(storageKeys);
			assertTrue(res);
		}
	}
}
