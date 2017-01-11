package com.smartcold.manage.cold.service;

import com.smartcold.manage.cold.entity.olddb.Rdc;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Author: qiunian.sun
 * Date: qiunian.sun(2016-08-18 09:28)
 */
@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class RdcServiceTest {

    @Autowired
    private RdcService rdcService;

    @Test
    @Rollback(true)
    public void findRdcsByUserId() throws Exception {
        int userid = 4;
        List<Rdc> rdcsByUserId = rdcService.findRdcsByUserId(userid);
        System.out.println("size: " + rdcsByUserId.size());
        for (Rdc rdc:rdcsByUserId){
            System.out.println(rdc.getId());
        }
    }

}
