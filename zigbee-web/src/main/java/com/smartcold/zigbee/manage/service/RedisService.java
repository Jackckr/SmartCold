package com.smartcold.zigbee.manage.service;


import com.smartcold.zigbee.manage.entity.UserEntity;

import java.util.HashMap;

/**
 * Created by qiangzi on 2017/8/29.
 */
public interface RedisService {
	
    UserEntity putUserToken(String token, UserEntity userEntity);

    void delUserToken(String token);

    void delUserId(Integer userId);

    void delToAddShare();

    String putUserId(Integer userId,String token);

    String putWXToken(String access_token);

    HashMap<Integer,Long> putPhoneClick(HashMap<Integer,Long> userMap);

    void delPhoneClick();

    void delWXToken();
}
