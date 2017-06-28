package com.zigbee.manage.cold.service;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.smartcold.zigbee.manage.entity.CommentEntity;
import com.smartcold.zigbee.manage.service.CommentService;
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
/*@Transactional(rollbackFor = Exception.class)
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath*:config/spring/local/appcontext*.xml"})
public class CommentServiceTest {

    @Autowired
    private CommentService commentService;

    @Test
    @Rollback(true)
    public void findLastNComment_corret() throws Exception {
        List<CommentEntity> list = commentService.findLastNComment(1, 3);
        System.out.println("list:" + Lists.transform(list, new Function<CommentEntity, String>() {
            @Override
            public String apply(CommentEntity input) {
                return input.getContent();
            }
        }));
    }
}*/
