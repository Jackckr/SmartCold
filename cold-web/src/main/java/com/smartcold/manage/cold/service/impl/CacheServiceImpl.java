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
   
	
	public void cleraChace(String key){
    	template.delete(key);
    }
	
   @SuppressWarnings("unchecked")
   public <V> V getDataFromCache(String key){
   	BoundValueOperations<String, Object> boundValueOps = template.boundValueOps(key);
   	return (V)boundValueOps.get();
   }
   
	public void putDataTocache(String key,Object value){
	    	BoundValueOperations<String, Object> boundHashOps=template.boundValueOps(key);
	    	boundHashOps.set(value);
	}
	 

	
}
