package com.smartcold.zigbee.manage.service.impl;

import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.RedisService;

import java.util.HashMap;

/**
 * Created by qiangzi on 2017/8/29.
 */
@Service
@CacheConfig(cacheNames = "RedisServiceImpl")
public class RedisServiceImpl implements RedisService{
    @Override
    @Cacheable(key="#token" )
    public UserEntity putUserToken(String token, UserEntity userEntity) {
        return userEntity;
    }

    @Override
    @CacheEvict(key = "#token",value = "RedisServiceImpl")
    public void delUserToken(String token) {

    }

    @Override
    @CacheEvict(key = "'userId_'+args[0]",value = "RedisServiceImpl")
    public void delUserId(Integer userId) {

    }

    @Override
    @CacheEvict(value = "ShareRdcController",allEntries = true)
    public void delToAddShare() {

    }

    @Override
    @Cacheable(key = "'userId_'+args[0]")
    public String putUserId(Integer userId, String token) {
        return token;
    }

    @Override
    @Cacheable(key = "'access_token'",value = "access_token")
    public String putWXToken(String access_token) {
        return access_token;
    }

    @Override
    @Cacheable(key="'putPhoneClick'",value="permissions")
    public HashMap<Integer, Long> putPhoneClick(HashMap<Integer, Long> userMap) {
        return userMap;
    }

    @Override
    @CacheEvict(value = "permissions",allEntries = true)
    public void delPhoneClick() {

    }

    @Override
    @CacheEvict(value ="access_token",allEntries = true)
    public void delWXToken() {

    }
}
