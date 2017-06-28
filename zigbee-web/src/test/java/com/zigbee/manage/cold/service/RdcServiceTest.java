package com.zigbee.manage.cold.service;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.smartcold.zigbee.manage.entity.RdcEntity;
import com.smartcold.zigbee.manage.service.RdcService;
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
 * Date: qiunian.sun(2016-04-29 00:16)
 */
/*@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class RdcServiceTest {

    @Autowired
    private RdcService rdcService;

    @Test
    @Rollback(true)
    public void findRdcList_corret() throws Exception {
        List<RdcEntity> list = rdcService.findRdcList();
        System.out.println("list:" + Lists.transform(list, new Function<RdcEntity, String>() {
            @Override
            public String apply(RdcEntity input) {
                return input.getName();
            }
        }));
    }
}*/
