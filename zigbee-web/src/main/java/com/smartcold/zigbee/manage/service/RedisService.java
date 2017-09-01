package com.smartcold.zigbee.manage.service;


import com.smartcold.zigbee.manage.entity.UserEntity;

/**
 * Created by qiangzi on 2017/8/29.
 */
public interface RedisService {
    UserEntity putUserToken(String token, UserEntity userEntity);

    void delUserToken(String token);

    void delToAddShare();
}
