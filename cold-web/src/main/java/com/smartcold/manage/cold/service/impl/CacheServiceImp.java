package com.smartcold.manage.cold.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;




import com.smartcold.manage.cold.service.CacheService;
import com.smartcold.manage.cold.service.RedisUtil;



@Service
public class CacheServiceImp implements CacheService {

	@Resource
	private RedisUtil redisUtil;
	
	public void cacheRemove(String key) {
		redisUtil.cleraChace(key);
	}
	
	public <V> V cacheResult(String key) {
		return (V)redisUtil.getDataFromCache(key);
	}
	
	public <V> V cacheResultList(String key) {
		return (V)redisUtil.getCacheList(key);
	}
	

	public <V> void cachePut(String key,V value) {
		redisUtil.putDataTocache(key, value);
	}


	

}
