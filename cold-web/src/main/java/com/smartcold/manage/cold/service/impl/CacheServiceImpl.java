package com.smartcold.manage.cold.service.impl;

import javax.annotation.Resource;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.smartcold.manage.cold.service.redis.CacheService;

/**
 * Created by maqiang34 on 2017/6/19.
 */
@Service
public class CacheServiceImpl implements CacheService{

   @Resource
   private RedisTemplate<String,Object> template;

	@Override
	public void removeKey(String key) {
		try {
			template.delete(key);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public <V> V getData(String key) {
		try {
			BoundValueOperations<String, Object> boundValueOps = template.boundValueOps(key);
			return (V)boundValueOps.get();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public void putData(String key, Object value) {
		try {
			BoundValueOperations<String, Object> boundHashOps=template.boundValueOps(key);
			boundHashOps.set(value);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	 

	
}
