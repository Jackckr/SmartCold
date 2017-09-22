package com.smartcold.zigbee.manage.service;

/**
 * Created by qiangzi on 2017/9/22.
 */
public interface WXPushService {

    void wxPushAlarm(String userId,String date,String dev,String type,String desc);
}
