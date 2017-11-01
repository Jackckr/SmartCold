package com.smartcold.manage.cold.service.redis;

import javax.annotation.Resource;

import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Created by maqiang34 on 2017/6/19.
 */
@Service
public class CacheServiceImpl implements CacheService{

   @Resource
   private RedisTemplate<String,Object> template;

	public void removeKey(String key) {
		try {
			template.delete(key);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

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

	public void putData(String key, Object value) {
		try {
			BoundValueOperations<String, Object> boundHashOps=template.boundValueOps(key);
			boundHashOps.set(value);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	
//	@Resource
//	private CacheManager cm;
//
//	@Override
//	public <V> V cacheResult(String key, String cacheName) {
//		ValueWrapper valueWrapper = cm.getCache(cacheName).get(key);
//		return valueWrapper == null ? null :(V) valueWrapper.get();
//	}
//
//	@Override
//	public void cacheRemove(String key, String cacheName) {
//		cm.getCache(cacheName).evict(key);
//	}
//
//	@Override
//	public <V> void cachePut(String key, V value, String cacheName) {
//		cm.getCache(cacheName).put(key, value);
//
//	}
//	 

	
}
