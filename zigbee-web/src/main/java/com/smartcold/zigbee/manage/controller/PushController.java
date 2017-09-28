package com.smartcold.zigbee.manage.controller;

import com.alibaba.fastjson.JSONObject;
import com.smartcold.zigbee.manage.dao.WxUserMapper;
import com.smartcold.zigbee.manage.entity.PushEntity;
import com.smartcold.zigbee.manage.service.RedisService;
import com.smartcold.zigbee.manage.service.WXPushService;
import com.smartcold.zigbee.manage.service.base.HttpService;
import com.smartcold.zigbee.manage.service.base.impl.HttpServiceImpl;
import com.smartcold.zigbee.manage.util.push.PushDemoTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;

/**
 * Created by qiangzi on 2017/9/18.
 */
@Controller
@RequestMapping("/push")
public class PushController {
    @Autowired
    private WXPushService wxPushService;
    @Autowired
    private RedisService redisService;
    @Autowired
    private WxUserMapper wxUserMapper;

    private static long appKey_360=24628597;
    private static long appKey_360_sx=24628984;
    private static long appKey_lianku=24628617;

    @RequestMapping(value = "/push360Alarm")
    @ResponseBody
    public void push360Alarm (String title, String summary, String token, String userIds, String type, String rdcId,String rdcName) throws Exception {
        PushEntity pushEntity = new PushEntity(title, summary, token, userIds, Integer.parseInt(type), Integer.parseInt(rdcId),rdcName);
        PushDemoTest pushDemoTest = new PushDemoTest();
        pushEntity.setAppKey(appKey_360);
        pushDemoTest.pushByAccountToIos(pushEntity);
        pushDemoTest.pushByAccountToAndroid(pushEntity);
        pushEntity.setAppKey(appKey_360_sx);
        pushDemoTest.pushByAccountToIos(pushEntity);
    }

    @RequestMapping(value = "/pushWXAlarm")
    @ResponseBody
    public void pushWXAlarm(String userId,String date,String dev,String type,String desc){
        wxPushService.wxPushAlarm(userId,date,dev,type,desc);
    }

    @RequestMapping(value = "/getOpenId")
    @ResponseBody
    public void getOpenId(String code,Integer state){
        HttpService httpService = new HttpServiceImpl();
        String openIdStr = httpService.sendGet("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx57e766b379bdd9f7&secret=0e82c94e0c21f0ba8e106a4a2bc016ef&code=" + code + "&grant_type=authorization_code");
        HashMap openIdEntity = JSONObject.parseObject(openIdStr, HashMap.class);
        String openid = openIdEntity.get("openid").toString();
        String access_token = redisService.putWXToken(null);
        if (access_token==null){
            wxPushService.updateWXToken();
            access_token=redisService.putWXToken(null);
        }
        String wxUserStr = httpService.sendGet("https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN");
        HashMap wxUserEntity = JSONObject.parseObject(wxUserStr, HashMap.class);
        wxUserEntity.put("addtime",new Date());
        int i = wxUserMapper.insertByMap(wxUserEntity);
        String msg=i>0?"微信用户\""+wxUserEntity.get("nickname")+"\"信息已存入数据库":"添加失败";
        System.out.println(msg);
    }
}
