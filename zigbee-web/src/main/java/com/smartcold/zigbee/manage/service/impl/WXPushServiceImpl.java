package com.smartcold.zigbee.manage.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.smartcold.zigbee.manage.dao.UserOpenIdMapper;
import com.smartcold.zigbee.manage.service.RedisService;
import com.smartcold.zigbee.manage.service.WXPushService;
import com.smartcold.zigbee.manage.service.base.HttpService;
import com.smartcold.zigbee.manage.service.base.impl.HttpServiceImpl;
import com.smartcold.zigbee.manage.util.TimeUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;

/**
 * Created by qiangzi on 2017/9/22.
 */
@Service
public class WXPushServiceImpl implements WXPushService{
    @Autowired
    private RedisService redisService;
    @Autowired
    private UserOpenIdMapper userOpenIdMapper;

    @Scheduled(cron = "0 0 */2 * * ?")
    public void updateWXToken(){
        System.out.println("=============获取微信公众号token============ 时间："+TimeUtil.getDateTime());
        HttpService httpService = new HttpServiceImpl();
        String s = httpService.sendGet("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx57e766b379bdd9f7&secret=0e82c94e0c21f0ba8e106a4a2bc016ef");
        HashMap hashMap = JSONObject.parseObject(s, HashMap.class);
        redisService.delWXToken();
        redisService.putWXToken(hashMap.get("access_token").toString());
    }

    @Override
    public void wxPushAlarm(String userId, String date,String dev,String type,String desc) {
        String access_token = redisService.putWXToken(null);
        if(access_token==null){updateWXToken();}
        String url="https://api.weixin.qq.com/cgi-bin/message/template/send?access_token="+access_token;
        HttpService httpService = new HttpServiceImpl();
        String openId = userOpenIdMapper.selectByUserId(Integer.parseInt(userId));
        JSONObject alarmMode = createAlarmMode(openId, date,dev,type,desc);
        httpService.sendPostByJson(url,alarmMode);
    }

    private JSONObject createAlarmMode(String openId, String date,String dev,String type,String desc){
        HashMap<String, Object> param = new HashMap<String, Object>();
        HashMap<String, Object> data = new HashMap<String, Object>();
        HashMap<String, Object> first = new HashMap<String, Object>();
        HashMap<String, Object> keyword1 = new HashMap<String, Object>();
        HashMap<String, Object> keyword2 = new HashMap<String, Object>();
        HashMap<String, Object> keyword3 = new HashMap<String, Object>();
        HashMap<String, Object> keyword4 = new HashMap<String, Object>();
        HashMap<String, Object> remark = new HashMap<String, Object>();
        param.put("touser",openId);
        param.put("template_id","Kzufre-ZdhRsV_24Nq4jCO8f7uimJrnoaiELIM7xciA");
        first.put("value","您好，您的冷库有温度报警");
        first.put("color","#173177");
        keyword1.put("value",dev);
        keyword1.put("color","#173177");
        keyword2.put("value",date);
        keyword2.put("color","#173177");
        keyword3.put("value",type);
        keyword3.put("color","#173177");
        keyword4.put("value",desc);
        keyword4.put("color","#173177");
        remark.put("value","请及时处理");
        remark.put("color","#173177");
        data.put("first",first);
        data.put("keyword1",keyword1);
        data.put("keyword2",keyword2);
        data.put("keyword3",keyword3);
        data.put("keyword4",keyword4);
        data.put("remark",remark);
        param.put("data",data);
        return new JSONObject(param);
    }
}
