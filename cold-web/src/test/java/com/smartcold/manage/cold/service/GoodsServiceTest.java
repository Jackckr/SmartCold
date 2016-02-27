package com.smartcold.manage.cold.service;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.smartcold.manage.cold.entity.SingleType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by sunqiunian on 16/2/25.
 */
@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class GoodsServiceTest {

    @Autowired
    private GoodsService goodsService;

    @Test
    @Rollback(true)
    public void findBudgetListByBusinessIdAndRoleId_corret() throws Exception {
        List<SingleType> list = goodsService.getAllGoods();
        System.out.println("list:" + Lists.transform(list, new Function<SingleType, Integer>() {
            @Override
            public Integer apply(SingleType input) {
                return input.getGoodsEntity().size();
            }
        }));
    }
}
