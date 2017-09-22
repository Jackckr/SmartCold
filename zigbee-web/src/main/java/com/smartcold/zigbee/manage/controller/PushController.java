package com.smartcold.zigbee.manage.controller;

import com.alibaba.fastjson.JSONObject;
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
    private static long appKey_360=24628597;
    private static long appKey_360_sx=24628984;
    private static long appKey_lianku=24628617;

    @RequestMapping(value = "/push360Alarm")
    @ResponseBody
    public void push360Alarm(String appKey, String title, String summary, String token, String userIds, String type, String rdcId) throws Exception {
        PushEntity pushEntity = new PushEntity(Long.parseLong(appKey), title, summary, token, userIds, Integer.parseInt(type), Integer.parseInt(rdcId));
        if(!StringUtil.checkToken(pushEntity.getToken())){return;}
        PushDemoTest pushDemoTest = new PushDemoTest();
        pushEntity.setAppKey(appKey_360);
        pushDemoTest.pushByAccountToIos(pushEntity);
        pushDemoTest.pushByAccountToAndroid(pushEntity);
        pushEntity.setAppKey(appKey_360_sx);
        pushDemoTest.pushByAccountToIos(pushEntity);
    }
}
