package com.zigbee.manage.cold.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.smartcold.bgzigbee.manage.service.RemoteService;

@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class RemoteServiceTest {
	
	@Autowired
	RemoteService remoteService;
	
	@Test
	public void testAddKeys() {
		Object res = remoteService.saveStorageKeys(4, "testKey", "test", "t");
		System.out.println(res);
	}

}
