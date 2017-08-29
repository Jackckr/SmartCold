
package com.smartcold.manage.cold.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;


/**
 * Created by sunqiunian on 16/2/25.
 */

@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath*:config/spring/local/appcontext*.xml" })
public class StorageServiceTest {



	@Autowired
	private StorageService storageService;

	@Test
	public void findBudgetListByBusinessIdAndRoleId_corret() throws Exception {
		
	}

	
	
	
}

