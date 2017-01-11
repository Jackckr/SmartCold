package com.smartcold.manage.cold.dao;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.smartcold.manage.cold.dao.newdb.StorageKeysMapper;
import com.smartcold.manage.cold.entity.newdb.StorageKeysEntity;
import com.smartcold.manage.cold.enums.StorageType;
import com.smartcold.manage.cold.service.StorageService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath*:config/spring/local/appcontext*.xml" })
public class StorageKeysNewTest {
	@Autowired
	StorageKeysMapper storageKeysNewMapper;
	@Autowired
	StorageService storageKeyValueService;

	// @Test
	// public void findData(){
	// List<NewStorageKeys> lists = storageKeysNewMapper.findAll();
	// assertTrue(lists.size()>0);
	// }

	@Test
	public void updateStorageKeys() {
		for (StorageType type : StorageType.values()) {
			StorageKeysEntity storageKeys = new StorageKeysEntity();
			storageKeys.setType(type.getType());
			storageKeys.setKey(type.toString());
			storageKeys.setDesc(type.getDesc());
			// boolean res =
			// storageKeysNewMapper.saveOrUpdateByType(storageKeys);
		}
	}
}
