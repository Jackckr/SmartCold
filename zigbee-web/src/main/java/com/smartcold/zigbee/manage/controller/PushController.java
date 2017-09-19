package com.smartcold.zigbee.manage.controller;

import com.smartcold.zigbee.manage.entity.PushEntity;
import com.smartcold.zigbee.manage.util.StringUtil;
import com.smartcold.zigbee.manage.util.push.PushDemoTest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

/**
 * Created by qiangzi on 2017/9/18.
 */
@Controller
@RequestMapping("/push")
public class PushController {
    private static long ios_360_appKey=24627462;
    private static long ios_lianku_appKey=24615505;
    private static long android_lianku_appKey=24627414;

    @RequestMapping(value = "/push360Alarm")
    @ResponseBody
    public void push360Alarm(PushEntity pushEntity) throws Exception {
        //if(!StringUtil.checkToken(pushEntity.getToken())){return;}
        PushDemoTest pushDemoTest = new PushDemoTest();
        pushEntity.setAppKey(ios_360_appKey);
        pushDemoTest.pushByAccountToIos(pushEntity);
        pushEntity.setAppKey(android_lianku_appKey);
        pushDemoTest.pushByAccountToAndroid(pushEntity);
    }
}
