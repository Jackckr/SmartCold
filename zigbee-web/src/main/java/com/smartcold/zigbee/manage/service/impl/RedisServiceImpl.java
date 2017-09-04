package com.smartcold.zigbee.manage.service.impl;

import com.smartcold.zigbee.manage.entity.UserEntity;
import com.smartcold.zigbee.manage.service.RedisService;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Created by qiangzi on 2017/8/29.
 */
@Service
@CacheConfig(cacheNames = "RedisServiceImpl")
public class RedisServiceImpl implements RedisService{
    @Override
    @Cacheable(key="#token")
    public UserEntity putUserToken(String token, UserEntity userEntity) {
        return userEntity;
    }

    @Override
    @CacheEvict(key = "#token",value = "RedisServiceImpl")
    public void delUserToken(String token) {

    }

    @Override
    @CacheEvict(value = "ShareRdcController",allEntries = true)
    public void delToAddShare() {

    }
}
