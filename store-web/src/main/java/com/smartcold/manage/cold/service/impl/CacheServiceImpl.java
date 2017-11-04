package com.smartcold.manage.cold.service.impl;

import javax.annotation.Resource;

import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.service.redis.CacheService;

/*
 * Copyright (C) DCIS 版权所有
 * 功能描述:
 * Create on MaQiang 2016-6-25 09:28:36
 */
@Service
public class CacheServiceImpl implements CacheService{

@Resource
   private CacheManager cacheManager;
//   @Resource
//   private RedisTemplate<String,Object> template;
   
	public <V> V getData( String cacheName,String key) {
		ValueWrapper valueWrapper = cacheManager.getCache(cacheName).get(key);
		return valueWrapper == null ? null :(V) valueWrapper.get();
	}

	public void removeKey(String cacheName,String key ) {
		this.cacheManager.getCache(cacheName).evict(key);
	}
	@Override
	public <V> void putData(String cacheName, String key, V value) {
		this.cacheManager.getCache(cacheName).put(key, value);
	}

   
//	public void removeKey(String key) {
//		try {
//			template.delete(key);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//	@SuppressWarnings("unchecked")
//	public <V> V getData(String key) {
//		try {
//			BoundValueOperations<String, Object> boundValueOps = template.boundValueOps(key);
//			return (V)boundValueOps.get();
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return null;
//	}
//
//	public void putData(String key, Object value) {
//		try {
//			BoundValueOperations<String, Object> boundHashOps=template.boundValueOps(key);
//			boundHashOps.set(value);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
	



	
}
